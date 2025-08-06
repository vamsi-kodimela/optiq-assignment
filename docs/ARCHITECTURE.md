# Cloud Risk Visualization - Architecture Guide

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── index.ts         # Component exports
│   ├── Graph/           # Main graph component
│   │   └── Graph.tsx
│   ├── nodes/           # Node-related components  
│   │   └── CustomNode.tsx
│   └── controls/        # UI control components
│       └── FilterControls.tsx
├── hooks/               # Custom React hooks
│   └── useGraphData.ts  # Graph state management
├── utils/               # Utility functions
│   └── iconResolver.tsx # Dynamic icon resolution
├── types/               # TypeScript type definitions
│   └── node.types.ts    # Node and edge types
├── constants/           # Application constants
│   └── icons.ts         # Icon mappings and configs
├── data/               # Static data and configurations
│   └── initialData.ts   # Initial graph data
├── styles/             # CSS styles
│   └── main.css        # Main stylesheet
└── App.tsx             # Root application component

public/
└── assets/
    └── logos/          # Brand logos and images
        ├── aws-logo.svg
        └── gcp-logo.svg
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Components**: Pure UI presentation logic
- **Hooks**: State management and business logic  
- **Utils**: Reusable utility functions
- **Types**: TypeScript definitions for type safety
- **Constants**: Configuration and static values

### 2. **Modular Design**
- **Component-based**: Each component has a single responsibility
- **Hook-based**: Custom hooks encapsulate complex logic
- **Type-safe**: Strong TypeScript typing throughout
- **Reusable**: Components and utilities can be easily reused

### 3. **Scalable Structure**
- **Easy to extend**: Add new node types, filters, or components
- **Maintainable**: Clear organization makes code easy to find and modify
- **Testable**: Isolated components and hooks are easy to test
- **Performance**: Optimized with React.memo and useCallback

## 🧩 Component Architecture

### Graph Component
```tsx
Graph/
└── Graph.tsx           # Main ReactFlow wrapper
    ├── FlowContent     # Inner component with ReactFlow context
    ├── CustomNode      # Custom node renderer
    ├── FilterControls  # Filtering UI
    └── useGraphData    # State management hook
```

### CustomNode Component
```tsx
CustomNode.tsx
├── Node rendering      # Visual node representation  
├── Icon resolution     # Dynamic icon selection
├── Badge display       # Alert/misconfig indicators
└── Interaction logic   # Click and hover handlers
```

### FilterControls Component
```tsx
FilterControls.tsx
├── Filter buttons      # All, Alerts, Misconfigurations
├── Active state        # Visual feedback for selection
└── Count display       # Statistics for each filter
```

## 🔧 State Management

### useGraphData Hook
```tsx
useGraphData()
├── Layout generation   # Dagre-based automatic layout
├── Node positioning    # Drag and drop support
├── Filtering logic     # Show/hide based on filters
├── Collapse/expand     # Hierarchical node management
└── Statistics          # Count calculations
```

## 🎨 Styling Architecture

### CSS Organization
```css
main.css
├── App layout          # Application-level styles
├── Node styles         # Custom node appearance
├── Badge styles        # Floating alert/misconfig badges
├── Control styles      # Filter and zoom controls
├── Graph styles        # ReactFlow customizations
└── Responsive styles   # Mobile and tablet adaptations
```

## 🔍 Icon System

### Dynamic Icon Resolution
```tsx
iconResolver.tsx
├── Logo components     # AWS/GCP brand logos
├── Service detection   # Keyword-based icon selection
├── Type mapping        # Node type to icon mapping
└── Fallback logic      # Default icons for unknown types
```

### Icon Categories
- **Cloud Providers**: AWS, GCP logos
- **Services**: Storage, Database, Compute, Network
- **Applications**: SaaS, Security, Monitoring
- **Infrastructure**: Regions, Zones, Containers

## 📊 Data Flow

```
initialData.ts → useGraphData → Graph → CustomNode
     ↓              ↓           ↓        ↓
  Raw data → State management → Layout → Rendering
```

### Data Transformation Pipeline
1. **Initial Data**: Static node/edge definitions
2. **Layout Generation**: Dagre calculates positions
3. **State Management**: Filtering, collapsing, dragging
4. **Rendering**: ReactFlow displays the graph

## 🚀 Extensibility

### Adding New Node Types
1. Add type to `constants/icons.ts`
2. Update `iconResolver.tsx` with icon logic
3. Add CSS styles for the new type
4. Update type definitions in `types/node.types.ts`

### Adding New Filters
1. Update `FilterType` in `types/node.types.ts`
2. Add filter logic to `useGraphData.ts`
3. Update `FilterControls.tsx` with new button
4. Add corresponding CSS styles

### Adding New Components
1. Create component in appropriate `components/` subdirectory
2. Export from `components/index.ts`
3. Import and use in parent components
4. Add corresponding styles and types

## 🧪 Testing Strategy

### Component Testing
- **Unit tests**: Individual component behavior
- **Integration tests**: Component interactions
- **Visual tests**: UI appearance and responsiveness

### Hook Testing
- **State management**: useGraphData hook behavior
- **Logic testing**: Filtering and layout algorithms
- **Performance testing**: Large dataset handling

## 📈 Performance Considerations

### Optimization Techniques
- **React.memo**: Prevent unnecessary re-renders
- **useCallback**: Stable function references
- **useMemo**: Expensive calculation caching
- **Code splitting**: Dynamic imports for large components

### Scalability Features
- **Virtual scrolling**: Handle large node counts
- **Incremental loading**: Load data on demand
- **Caching**: Store calculated layouts
- **Web Workers**: Offload heavy computations

This architecture provides a solid foundation for building, maintaining, and scaling the cloud risk visualization application.