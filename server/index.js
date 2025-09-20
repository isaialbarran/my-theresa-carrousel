import { createServer as createHttpServer } from 'node:http'
import { createReadStream } from 'node:fs'
import { readFile, stat } from 'node:fs/promises'
import { extname, dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createServer as createViteServer } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const clientDist = resolve(rootDir, 'dist/client')
const serverDist = resolve(rootDir, 'dist/server')
const isProd = process.env.NODE_ENV === 'production'
const port = Number.parseInt(process.env.PORT ?? '5173', 10)

const mimeTypes = new Map([
  ['.js', 'text/javascript'],
  ['.mjs', 'text/javascript'],
  ['.cjs', 'text/javascript'],
  ['.css', 'text/css'],
  ['.html', 'text/html'],
  ['.json', 'application/json'],
  ['.ico', 'image/x-icon'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.svg', 'image/svg+xml'],
  ['.gif', 'image/gif'],
  ['.webp', 'image/webp'],
  ['.txt', 'text/plain'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
])

const replaceInitialRoute = (template, initialRoute) =>
  template.replace(
    '<!--initial-route-->',
    `<script>window.__INITIAL_ROUTE__ = ${JSON.stringify(initialRoute)};<\/script>`
  )

const injectAppHtml = (template, appHtml) =>
  template.replace('<!--app-html-->', appHtml)

const getRequestPath = (req) => {
  const url = req.originalUrl ?? req.url ?? '/'
  return url.split('?')[0]
}

const serveStaticAsset = async (req, res) => {
  const pathname = decodeURIComponent(getRequestPath(req))

  if (pathname === '/' || pathname === '') {
    return false
  }

  const filePath = resolve(clientDist, `.${pathname}`)

  if (!filePath.startsWith(clientDist)) {
    return false
  }

  try {
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) {
      return false
    }

    const ext = extname(filePath)
    const mimeType = mimeTypes.get(ext) ?? 'application/octet-stream'
    res.statusCode = 200
    res.setHeader('Content-Type', mimeType)
    createReadStream(filePath).pipe(res)
    return true
  } catch (error) {
    return false
  }
}

async function createServer() {
  if (!isProd) {
    const vite = await createViteServer({
      root: rootDir,
      logLevel: 'info',
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    })

    vite.middlewares.use('*', async (req, res) => {
      try {
        const url = getRequestPath(req)
        const rawTemplate = await readFile(resolve(rootDir, 'index.html'), 'utf-8')
        const template = await vite.transformIndexHtml(url, rawTemplate)
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
        const { appHtml, initialRoute, status } = await render(url)
        const html = replaceInitialRoute(injectAppHtml(template, appHtml), initialRoute)

        res.statusCode = status
        res.setHeader('Content-Type', 'text/html')
        res.end(html)
      } catch (error) {
        vite.ssrFixStacktrace(error)
        res.statusCode = 500
        res.end(error.stack)
      }
    })

    const server = createHttpServer(vite.middlewares)

    server.listen(port, () => {
      console.log(`\n✓ SSR dev server ready at http://localhost:${port}\n`)
    })

    return
  }

  const template = await readFile(resolve(clientDist, 'index.html'), 'utf-8')
  const serverEntryUrl = pathToFileURL(resolve(serverDist, 'entry-server.js')).href
  const { render } = await import(serverEntryUrl)

  const server = createHttpServer(async (req, res) => {
    const handled = await serveStaticAsset(req, res)
    if (handled) {
      return
    }

    try {
      const url = getRequestPath(req)
      const { appHtml, initialRoute, status } = await render(url)
      const html = replaceInitialRoute(injectAppHtml(template, appHtml), initialRoute)

      res.statusCode = status
      res.setHeader('Content-Type', 'text/html')
      res.end(html)
    } catch (error) {
      console.error('SSR render error:', error)
      res.statusCode = 500
      res.setHeader('Content-Type', 'text/plain')
      res.end('Internal Server Error')
    }
  })

  server.listen(port, () => {
    console.log(`\n✓ SSR server listening at http://localhost:${port}\n`)
  })
}

createServer().catch((error) => {
  console.error(error)
  process.exit(1)
})
