# Falcon Charts Test

A React + TypeScript + Vite workspace for exploring and comparing multiple charting libraries with mock data.

## Features

- **Charting Libraries Demos:**
  - [Recharts](src/pages/RechartsDemo/RechartsDemo.tsx)
  - [Chart.js](src/pages/ChartJSDemo/ChartJSDemo.tsx)
  - [Plotly](src/pages/PlotlyDemo/PlotlyDemo.tsx)
  - [Victory](src/pages/VictoryDemo/VictoryDemo.tsx)
  - [Nivo](src/pages/NivoDemo/NivoCanvasDemo.tsx)
  - [ECharts](src/pages/EChartsDemo/EChartsDemo.tsx)
  - [D3](src/pages/D3Demo/D3Demo.tsx)
  - [VisX](src/pages/VisXDemo/VisXDemo.tsx) (note: VisX not React 19 compatible)

- **Data Sources:**
  - Users, allocations, engineer categories, work locations, revenue details, utilization data (see `data/` folder).

- **Reusable Utilities:**
  - [`countBy`](src/pages/utils.ts): Group and count by key.
  - Color palettes and business unit constants.

- **UI/UX:**
  - Tabbed navigation ([`App.tsx`](src/App.tsx))
  - Integrated Tailwind CSS for rapid styling.
  - Responsive layouts and chart containers.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Tailwind CSS Setup

- Tailwind is used for styling components and chart controls.
- Make sure your `tailwind.config.js` includes:
  ```js
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: { extend: {} },
    plugins: [],
  }
  ```
- For custom global styles, see [`src/pages/RechartsDemo/styles.css`](src/pages/RechartsDemo/styles.css).

## Chart Demos

Each chart demo page loads its own data and provides interactive controls:

- **Recharts:** Pie, Bar, Line, Stacked Bar, with zoom and axis controls.
- **Chart.js:** Pie and Bar charts.
- **Victory:** Pie, Bar, Stacked, Line charts.
- **Nivo:** Responsive Pie, Bar, Line charts.
- **Plotly:** Interactive charts with built-in zoom/pan.
- **D3:** Custom SVG charts (see hooks in [`D3Demo.tsx`](src/pages/D3Demo/D3Demo.tsx)).
- **ECharts:** Canvas-based charts.
- **VisX:** Demo placeholder.

## Data Structure

- `users.json`, `people_allocation.json`, `engineer_category.json`, `work_locations.json`, `revenue_details.json`, `utilization_data.json`
- See [`src/helperFunctions.ts`](src/helperFunctions.ts) for mock data generation.

## ESLint & TypeScript

- Type-aware linting recommended. See below for config example:

  ```js
  export default tseslint.config([
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        ...tseslint.configs.recommendedTypeChecked,
        ...tseslint.configs.strictTypeChecked,
        ...tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ])
  ```

  For React-specific lint rules, consider:
  ```js
  import reactX from 'eslint-plugin-react-x'
  import reactDom from 'eslint-plugin-react-dom'

  export default tseslint.config([
    globalIgnores(['dist']),
    {
      files: ['**/*.{ts,tsx}'],
      extends: [
        reactX.configs['recommended-typescript'],
        reactDom.configs.recommended,
      ],
      languageOptions: {
        parserOptions: {
          project: ['./tsconfig.node.json', './tsconfig.app.json'],
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
  ])
  ```

## Folder Structure

```
src/
  pages/
    RechartsDemo/
    ChartJSDemo/
    VictoryDemo/
    NivoDemo/
    NivoCanvasDemo/
    EChartsDemo/
    PlotlyDemo/
    D3Demo/
    VisXDemo/
    utils.ts
  helperFunctions.ts
  App.tsx
  App.css
data/
  users.json
  people_allocation.json
  engineer_category.json
  work_locations.json
  revenue_details.json
  utilization_data.json
```

## Notes

- For advanced chart features (zoom, pan, tooltips), compare the demos in each chart library tab.
- Some chart libraries (Plotly, Nivo, Victory) support built-in zoom/pan; others (Recharts, Chart.js) require manual implementation.
- For custom chart logic, see utility hooks and functions in each demo page.

---

**Explore each tab to compare charting libraries and UI controls!**

Note: this README.md is generated using Github copilot!