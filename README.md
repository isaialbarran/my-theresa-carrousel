# My Theresa Carrousel

A modern movie discovery application built with React 19, TypeScript, and Server-Side Rendering (SSR) using Vite. Features streaming SSR, dynamic routing, and a clean architecture.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation

1. **Clone and install**
   ```bash
   git clone <https://github.com/isaialbarran/my-theresa-carrousel>
   cd my-theresa-carrousel
   npm install
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env and add your TMDB API credentials
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start SSR development server |
| `npm run build` | Production build |
| `npm run preview` | Test production build locally |
| `npm run lint` | Check code quality |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm run test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |

## 🏗️ Project Architecture

```
src/
├── domain/              # Business entities and rules
├── application/         # Use cases and hooks
├── infrastructure/      # External dependencies
├── presentation/        # UI components and pages
└── shared/             # Shared utilities
```

## 🌟 Features

- **🎬 Movie Discovery**: Browse popular, top-rated, and upcoming movies
- **❤️ Wishlist Management**: Save and manage favorite movies
- **🔍 Search & Filter**: Find movies by title or description
- **📱 Responsive Design**: Optimized for all devices
- **🚀 Server-Side Rendering**: Fast initial page loads
- **⚡ Performance**: Virtual scrolling and optimized rendering

## 🔧 Development

### Code Quality
Always run before committing:
```bash
npm run lint:fix
npm run test
```

### Testing URLs
- Homepage: `http://localhost:5173/`
- Wishlist: `http://localhost:5173/wishlist`
- Movie Detail: `http://localhost:5173/movie/123`

## 🚀 Production

### Build
```bash
npm run build
```

Creates optimized bundles in `dist/` folder.

### Environment Variables

#### Required TMDB API Variables
| Variable | Description | How to get |
|----------|-------------|------------|
| `VITE_TMDB_API_KEY` | Your TMDB API key | [Get from TMDB](https://www.themoviedb.org/settings/api) |
| `VITE_TMDB_ACCESS_TOKEN` | Your TMDB access token | [Get from TMDB](https://www.themoviedb.org/settings/api) |
| `VITE_TMDB_BASE_URL` | TMDB API base URL | `https://api.themoviedb.org/3` |

#### Optional Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5173` | Server port |
| `NODE_ENV` | `development` | Environment mode |

## 🛠️ Troubleshooting

### Port Already in Use
```bash
npx kill-port 5173
# Or use different port
PORT=3000 npm run dev
```

### Build Issues
```bash
npm run build:clean
npm install
npm run build
```

### Development Server Issues
1. Check Node.js version: `node --version` (≥18)
2. Clear cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Run quality checks: `npm run lint:fix && npm run test`
4. Commit and push changes
5. Open Pull Request

## 📄 License

This project is private and proprietary.