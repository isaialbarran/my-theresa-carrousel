# My Theresa Carrousel - Setup Guide

A modern movie discovery application built with React 19, TypeScript, and Server-Side Rendering (SSR) using Vite. Features streaming SSR, dynamic routing, and a clean architecture.

## 🚀 Quick Start

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-theresa-carrousel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📋 Available Scripts

### Development

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run dev` | Start SSR development server | For development with HMR |
| `npm run lint` | Run ESLint checks | Check code quality |
| `npm run lint:fix` | Auto-fix ESLint issues | Fix formatting issues |

### Production Build

| Command | Description | Usage |
|---------|-------------|-------|
| `npm run build` | Full production build | Complete build process |
| `npm run build:parallel` | Parallel build (faster) | Optimized build for CI/CD |
| `npm run preview` | Serve production build | Test production locally |

### Build Steps Breakdown

```bash
# Individual build steps (run automatically with npm run build)
npm run build:clean     # Remove dist folder
npm run build:types     # TypeScript compilation
npm run build:client    # Client-side bundle
npm run build:server    # Server-side bundle
```

## 🏗️ Project Architecture

```
src/
├── domain/              # Business entities and rules
│   ├── entities/       # Movie, Category types
│   └── repositories/   # Repository interfaces
├── application/        # Use cases and business logic
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API services
│   └── store/         # State management (Zustand)
├── infrastructure/    # External dependencies
│   └── repositories/ # API implementations
├── presentation/      # UI and components
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── hooks/        # Presentation hooks
│   └── routing/      # Route definitions
└── shared/           # Shared utilities
    └── utils/        # Helper functions
```

## 🔧 Development Workflow

### 1. Development Server

The development server provides:
- **Hot Module Replacement (HMR)** for instant updates
- **Server-Side Rendering** with streaming
- **TypeScript compilation** on-the-fly
- **SCSS preprocessing** with live reload

```bash
npm run dev
```

**Expected output:**
```
✓ SSR dev server ready at http://localhost:5173
```

### 2. Code Quality

Before committing, always run:
```bash
npm run lint
```

Auto-fix common issues:
```bash
npm run lint:fix
```

### 3. Testing the Application

#### Manual Testing Checklist

- [ ] **Homepage loads** with movie carousels
- [ ] **Movie details** open in modal
- [ ] **Wishlist functionality** (add/remove movies)
- [ ] **Navigation** between pages works
- [ ] **Search and filtering** in wishlist
- [ ] **Responsive design** on different screen sizes

#### Testing URLs

- Homepage: `http://localhost:5173/`
- Wishlist: `http://localhost:5173/wishlist`
- Movie Detail: `http://localhost:5173/movie/123`

## 🚀 Production Deployment

### 1. Build for Production

```bash
npm run build
```

This creates optimized bundles in the `dist/` folder:
```
dist/
├── client/           # Client-side assets
│   ├── index.html   # HTML template
│   ├── assets/      # JS, CSS, images
│   └── ...
└── server/           # Server-side bundle
    └── entry-server.js
```

### 2. Preview Production Build

```bash
npm run preview
```

**Expected output:**
```
✓ SSR server listening at http://localhost:5173
```

### 3. Environment Variables

The application supports these environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5173` | Server port |
| `NODE_ENV` | `development` | Environment mode |

Example:
```bash
PORT=3000 NODE_ENV=production npm run preview
```

## 🌟 Features

### Core Features

- **🎬 Movie Discovery**: Browse popular, top-rated, and upcoming movies
- **❤️ Wishlist Management**: Save movies for later viewing
- **🔍 Search & Filter**: Find movies by title or description
- **📱 Responsive Design**: Optimized for all devices
- **⚡ Virtual Scrolling**: Efficient rendering for large lists

### Technical Features

- **🚀 Server-Side Rendering (SSR)**: Fast initial page loads
- **📡 Streaming SSR**: Progressive content loading
- **🎯 Dynamic Routing**: Support for `/movie/:id` routes
- **💾 Client-side State**: Persistent wishlist with localStorage
- **🎨 SCSS Styling**: Modular and maintainable styles
- **♿ Accessibility**: ARIA labels and keyboard navigation

## 🔍 API Integration

The application integrates with **The Movie Database (TMDB) API**:

- **Popular Movies**: Latest trending movies
- **Top Rated**: Highest rated movies
- **Upcoming**: Soon-to-be-released movies
- **Movie Details**: Full movie information

## 🛠️ Troubleshooting

### Common Issues

#### Port Already in Use
```bash
Error: listen EADDRINUSE :::5173
```
**Solution:**
```bash
# Kill existing process
npx kill-port 5173
# Or use different port
PORT=3000 npm run dev
```

#### TypeScript Errors
```bash
npm run build:types
```
Check for TypeScript compilation errors.

#### Build Failures
```bash
# Clean and rebuild
npm run build:clean
npm install
npm run build
```

#### Development Server Not Starting
1. Check Node.js version: `node --version` (should be ≥18)
2. Clear npm cache: `npm cache clean --force`
3. Delete node_modules: `rm -rf node_modules && npm install`

### Performance Issues

#### Slow Initial Load
- Enable network throttling in DevTools
- Check bundle size: `npm run build` and inspect `dist/` folder
- Verify SSR is working (view page source should show rendered HTML)

#### Memory Issues
- Restart development server: `Ctrl+C` then `npm run dev`
- Clear browser cache and localStorage

## 📝 Development Tips

### Code Style

- Use **TypeScript** for type safety
- Follow **Clean Architecture** principles
- Write **semantic HTML** with proper ARIA labels
- Use **CSS custom properties** for theming
- Implement **error boundaries** for robustness

### State Management

- **Zustand** for global state (wishlist)
- **React hooks** for component state
- **Custom hooks** for reusable logic

### Performance

- **Lazy loading** for images
- **Virtual scrolling** for large lists
- **Memoization** for expensive calculations
- **Code splitting** at route level

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Run linting: `npm run lint:fix`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

**Need help?** Check the troubleshooting section or open an issue in the repository.