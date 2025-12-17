import { Navbar } from './components'
import { Hero, Specs, Planning, Robot3D, Deliverables, Contact } from './sections'
import { PerfModeProvider } from './hooks'
import { SpeedInsights } from '@vercel/speed-insights/react'

function App() {
  return (
    <PerfModeProvider>
      <div className="relative">
        {/* Noise overlay for texture */}
        <div className="noise-overlay" />
        
        {/* Navigation */}
        <Navbar />
        
        {/* Main content */}
        <main>
          <Hero />
          <Specs />
          <Planning />
          <Robot3D />
          <Deliverables />
          <Contact />
        </main>
        
        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </div>
    </PerfModeProvider>
  )
}

export default App
