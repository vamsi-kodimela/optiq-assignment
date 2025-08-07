# CSS Architecture

This directory contains the modularized CSS files for the application, organized by concern and functionality.

## File Structure

```
src/styles/
├── index.css              # Main entry point that imports all modules
├── global.css             # Global styles, fonts, and base rules
├── app-layout.css         # Main application layout styles
├── node.css               # Custom node component styles
├── filter-controls.css    # Filter controls component styles
├── react-flow.css         # React Flow customizations
├── responsive.css         # Responsive design and media queries
└── README.md              # This file
```

## Module Organization

### global.css
- Font configurations
- Global reset styles
- Base typography

### app-layout.css
- Main application container
- Header styles
- Graph container layout

### node.css
- Custom node component styling
- Node type variants (cloud, aws, gcp, saas, service)
- Floating badges and indicators
- Node interactions (hover, active states)

### filter-controls.css
- Filter button styling
- Filter control panel layout
- Interactive states and animations

### react-flow.css
- React Flow component customizations
- Edge and arrow styling
- Control panel styling
- MiniMap styling

### responsive.css
- Mobile-first responsive design
- Breakpoint-specific adjustments
- Touch-friendly sizing

## Import Order

The CSS modules are imported in a specific order to ensure proper cascading:

1. Global styles (base)
2. Layout styles
3. Component-specific styles
4. Responsive styles (override)

## Usage

To use the modular CSS system, simply import the main index file:

```tsx
import './styles/index.css';
```

This will automatically load all the CSS modules in the correct order.

## Benefits

- **Maintainability**: Each file has a specific purpose
- **Reusability**: Components can be easily moved or reused
- **Performance**: Better caching and smaller chunks
- **Debugging**: Easier to locate and fix styles
- **Team Development**: Multiple developers can work on different modules