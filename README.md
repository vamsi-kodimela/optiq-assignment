# Cloud Nodes Visualization

## 📋 Setup Instructions

### Prerequisites

- **Node.js**: Version 16 or higher
- **npm**: Version 7 or higher (comes with Node.js)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd optiq-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - The application will automatically reload when you make changes

### Build for Production

```bash
npm run build
```

The optimized build will be available in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🎯 Key Features Explained

### Collapsibility System

The application implements a sophisticated node collapse/expand system:

#### How It Works

1. **Hierarchical Data Structure**

   - Each node can have `children` array defining parent-child relationships
   - Parent nodes display a subtle collapse indicator when they have children

2. **State Management**

   - `collapsedNodeIds` array tracks which parent nodes are currently collapsed
   - Uses React's `useState` and `useMemo` for efficient re-rendering

3. **Click Interaction**

   ```typescript
   const onNodeClick = (event, node) => {
     if (node.data.children?.length > 0) {
       // Toggle collapse state
       setCollapsedNodeIds(
         (prev) =>
           prev.includes(node.id)
             ? prev.filter((id) => id !== node.id) // Expand
             : [...prev, node.id] // Collapse
       );
     }
   };
   ```

4. **Visibility Calculation**

   - When a node is collapsed, all its descendants are hidden recursively
   - Edges are automatically hidden if their source or target nodes are hidden
   - Uses `useMemo` for performance optimization

5. **Auto-fit View**
   - Automatically adjusts zoom and pan to fit visible nodes after collapse/expand
   - Provides smooth transitions for better user experience

#### Visual Indicators

- **Collapsible Nodes**: Show a subtle indicator when they have children
- **Smooth Transitions**: 500ms duration with padding for optimal viewing
- **Smart Layout**: Uses Dagre algorithm for automatic left-to-right positioning

### Filtering System

Advanced filtering allows users to focus on specific types of issues:

#### Filter Types

1. **All** (Default)

   - Shows all nodes regardless of alert/misconfiguration status
   - Displays both metrics in combined badges: `🔺 84 | ⚙️ 3`

2. **Alerts**

   - Shows only nodes with alerts > 0
   - Displays only alert counts in badges: `🔺 84`

3. **Misconfigurations**
   - Shows only nodes with misconfigurations > 0
   - Displays only misconfiguration counts in badges: `⚙️ 3`

#### Implementation Details

1. **Filter State Management**

   ```typescript
   const [activeFilter, setActiveFilter] = useState<FilterType>("all");
   ```

2. **Node Filtering Logic**

   ```typescript
   const filterNodes = (nodes) => {
     if (activeFilter === "all") return nodes;

     return nodes.filter((node) => {
       if (activeFilter === "alerts") return node.data.alerts > 0;
       if (activeFilter === "misconfigurations")
         return node.data.misconfigs > 0;
       return true;
     });
   };
   ```

3. **Dynamic Badge Display**

   - Badges conditionally render based on active filter
   - Combined badges show relevant metrics with pipe separator
   - Smart visibility prevents cluttered displays

4. **Filter Controls**
   - Positioned in top-left corner of the canvas
   - Horizontal layout with text labels for clarity
   - Consistent styling with zoom controls

#### Filter Interaction with Collapsibility

- Filters and collapse states work independently
- Collapsed nodes remain collapsed when switching filters
- Filter changes don't affect node hierarchy relationships
- Performance optimized with `useMemo` for combined operations

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **ReactFlow**: Advanced node-based editor and interactive diagrams
- **Dagre**: Automatic graph layout algorithm
- **Lucide React**: Modern icon library
- **Vite**: Fast build tool and development server

## 🔧 Customization

### Adding New Node Types

1. Update `NODE_TYPES` in `src/constants/icons.ts`
2. Add color definition in `src/styles/node.css`
3. Extend `getNodeIcon` function in `src/utils/iconResolver.tsx`
4. Add type to the TypeScript interfaces

### CSS Customization

The modular CSS architecture makes customization simple:

- **Global styles**: Edit `src/styles/global.css` for fonts and base styles
- **Layout changes**: Modify `src/styles/app-layout.css` for main application layout
- **Node appearance**: Update `src/styles/node.css` for node styling and colors
- **Filter controls**: Customize `src/styles/filter-controls.css` for filter button appearance
- **React Flow**: Modify `src/styles/react-flow.css` for graph controls and edges
- **Mobile responsive**: Adjust `src/styles/responsive.css` for mobile-specific styles


### Modifying Data

Update `src/data/initialData.ts` with your infrastructure data:

```typescript
export const initialData = {
  nodes: [
    {
      id: "unique-id",
      label: "Display Name",
      type: "node-type",
      alerts: 0,
      misconfigs: 0,
      children: ["child-id-1", "child-id-2"], // Optional
    },
  ],
  edges: [{ source: "parent-id", target: "child-id" }],
};
```


