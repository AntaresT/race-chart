import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { GraphProvider } from './provider/dataChart.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GraphProvider>
      <App />
  </GraphProvider>
)
