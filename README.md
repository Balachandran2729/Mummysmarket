
## ✨ Features

- **Product Browsing**: Browse an extensive product catalog with infinite scroll pagination
- **Product Search**: Real-time search functionality to quickly find desired products
- **Product Details**: Comprehensive product information, images, and specifications
- **Shopping Cart**: Intuitive cart management with add/remove functionality
- **Favorites/Wishlist**: Save favorite products for future purchases
- **Persistent Storage**: Local data persistence using AsyncStorage
- **Cross-Platform**: Seamless experience on iOS, Android, and Web
- **Type-Safe**: Full TypeScript support for enhanced code reliability
- **Responsive Design**: Optimized UI with NativeWind and Tailwind CSS
- **Bottom Tab Navigation**: Intuitive navigation between major app sections

## 🛠 Technology Stack

### Core Framework
- **React Native** (v0.81.5) - Cross-platform mobile development framework
- **Expo** (v54.0.37) - Development platform and distribution service
- **React** (v19.1.0) - UI library

### State Management
- **Redux Toolkit** (v2.12.0) - Predictable state container
- **React-Redux** (v9.3.0) - React bindings for Redux

### Navigation
- **React Navigation** (v7.x)
  - Bottom Tabs Navigation
  - Stack Navigation
  - Native Stack Navigation

### Styling & UI
- **NativeWind** (v4.2.6) - Tailwind CSS for React Native
- **Tailwind CSS** (v3.4.19) - Utility-first CSS framework
- **Expo Vector Icons** (v15.0.3) - Icon library

### Utilities
- **Axios** (v1.19.0) - HTTP client for API requests
- **AsyncStorage** (v2.2.0) - Local data persistence
- **Zod** (v4.4.3) - TypeScript-first schema validation


### Development Tools
- **TypeScript** (v5.9.2) - Static type checking
- **Babel** - JavaScript compiler

## 📁 Project Structure

```
MummysMarket/
├── assets/              # App icons and splash screens
├── src/
│   ├── core/
│   │   ├── common/      # Shared utilities and constants
│   │   │   └── colour.ts
│   │   ├── navigation/  # Navigation configuration
│   │   │   ├── TabNavigation.tsx
│   │   │   └── types.ts
│   │   └── redux/       # Redux store and slices
│   │       ├── store.ts
│   │       ├── productSlice.ts
│   │       ├── cartSlice.ts
│   │       ├── favoritesSlice.ts
│   │       ├── selectors.ts
│   │       ├── hooks.ts
│   │       └── index.ts
│   └── feature/         # Feature-specific screens and components
│       ├── cart/
│       │   ├── CartScreen.tsx
│       │   └── SaveProdect.tsx
│       └── home/
│           ├── HomeScreen.tsx
│           ├── ProdectDetails.tsx
│           ├── ProductCard.tsx
│           └── SkeletonCard.tsx
├── App.tsx              # Root application component
├── index.ts             # Entry point
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── babel.config.js      # Babel configuration
└── metro.config.js      # Metro bundler configuration
```

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MummysMarket
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```


## 📱 Core Architecture

### Redux Store Structure

The application uses Redux Toolkit with three main slices:

```typescript
{
  products: {
    items: Product[],
    loading: boolean,
    error: string | null,
    total: number,
    currentPage: number
  },
  favorites: {
    items: Product[],
    loading: boolean
  },
  cart: {
    items: CartItem[],
    total: number,
    itemCount: number
  }
}
```

### Key Redux Slices

- **productSlice.ts**: Manages product catalog, search, and pagination
- **cartSlice.ts**: Handles shopping cart operations (add, remove, update quantity)
- **favoritesSlice.ts**: Manages user's favorite products
- **selectors.ts**: Memoized selectors for efficient state access
- **hooks.ts**: Custom Redux hooks with TypeScript support

### Navigation Structure

The app uses a bottom tab navigator with the following primary routes:

1. **Home Tab**: Product browsing and search
   - Stack: HomeScreen → ProductDetails
2. **Cart Tab**: Shopping cart and checkout
   - Stack: CartScreen → SaveProduct (Saved/Wishlist items)
3. **Additional Tabs**: Future extensibility (Profile, Orders, etc.)

## 🔌 API Integration

The application integrates with a backend API using **Axios** for HTTP requests. API calls are made within Redux thunks for seamless async state management.

### Key API Operations

- Fetch product catalog with pagination
- Get product details
- Add/remove from cart
- Manage favorites
- Persist cart and favorites state locally

## 🎨 Styling

The app uses **NativeWind** (Tailwind CSS for React Native) for consistent, utility-first styling. This approach provides:

- **Consistency**: Unified design language across the app
- **Maintainability**: Easy-to-understand utility classes
- **Performance**: Optimized CSS generation
- **Responsiveness**: Built-in responsive design capabilities

### Color Palette

Colors are centralized in `src/core/common/colour.ts` for easy customization and consistency throughout the application.

## 💾 Local Data Persistence

The application uses **AsyncStorage** to persist:

- Cart items and state
- Favorite/wishlist items
- User preferences
- Search history (if applicable)

This ensures data persists even after app closure or device restart.

## 🧪 Type Safety

Full TypeScript support throughout the application:

- Strict TypeScript compilation (`strict: true`)
- Type-safe Redux state and selectors
- Typed React component props
- Runtime schema validation with Zod

## 📊 Performance Optimizations

- **Infinite Scroll**: Lazy load products with pagination limit of 15 items
- **Memoized Selectors**: Efficient Redux state access
- **Skeleton Loading**: Better perceived performance with skeleton screens
- **Image Optimization**: Native image loading mechanisms
- **Gesture Handling**: Smooth animations with React Native Reanimated


## 📋 Dependencies Overview

### Key Dependencies
- `@reduxjs/toolkit`: State management
- `@react-navigation/*`: Navigation solutions
- `axios`: API communication
- `nativewind`: Tailwind CSS styling
- `react-native-async-storage`: Local storage
- `zod`: Schema validation

### Development Dependencies
- `typescript`: Type safety
- `tailwindcss`: Styling framework
- `postcss`: CSS processing
- `autoprefixer`: CSS compatibility

## 🛡️ Best Practices

- **Component Composition**: Reusable, single-responsibility components
- **State Management**: Centralized Redux store for predictable state
- **Type Safety**: Strict TypeScript throughout
- **Error Handling**: Proper error states and user feedback
- **Performance**: Memoization and optimization techniques
- **Code Organization**: Feature-based folder structure for scalability


**Last Updated**: August 2026  
**Version**: 1.0.0  
**Status**: Production Ready ✅
