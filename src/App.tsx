import { Navbar } from './components'
import { Hero, Specs, Planning, Robot3D, Deliverables, Contact } from './sections'
import { PerfModeProvider } from './hooks'

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
      </div>
    </PerfModeProvider>
  )
}

export default App
