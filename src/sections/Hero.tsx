import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { Button } from '../components'
import { useReducedMotion } from '../hooks'

export function Hero() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="overview" className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto pl-6 pr-2.5 pt-28 pb-16 w-full">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-stretch lg:items-center">
          {/* Left: copy */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs font-mono text-roofus-muted mb-6">
              <span className="w-1.5 h-1.5 bg-roofus-accent rounded-full" />
              datasheet // rev 0.2
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-mono font-semibold tracking-tight text-white leading-tight">
              ROOFUS
              <span className="text-roofus-muted"> // </span>
              roof_inspection_platform
            </h1>

            <p className="mt-4 text-roofus-muted max-w-xl">
              Roof inspection robot paired with the <span className="text-white font-mono">BDR mission planner</span>.
              Deterministic geometry → coverage swaths → route → waypoint export → execution → report.
            </p>

            <div className="mt-6 glass rounded-2xl p-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs font-mono text-roofus-muted">mass</div>
                  <div className="font-mono text-white">12 kg (26.5 lb)</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-roofus-muted">envelope</div>
                  <div className="font-mono text-white">≈35×35×25 cm (~13.8×13.8×9.8 in)</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-roofus-muted">max_speed</div>
                  <div className="font-mono text-white">0.5 m/s (1.64 ft/s)</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-roofus-muted">max_slope</div>
                  <div className="font-mono text-white">20°</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-roofus-muted">battery</div>
                  <div className="font-mono text-white">24 V · 20 Ah (~480 Wh)</div>
                </div>
                <div>
                  <div className="text-xs font-mono text-roofus-muted">charge_time</div>
                  <div className="font-mono text-white">8 h (full)</div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button href="#contact" icon={<ArrowRight size={18} />}>
                Request demo
              </Button>
              <Button variant="secondary" href="#specs">
                View specs
              </Button>
              <Button
                variant="secondary"
                href="/assets/Roofus_Product_sheet.pdf"
                download="Roofus_Product_sheet.pdf"
              >
                Download Product sheet
              </Button>
            </div>
          </motion.div>

          {/* Right: robot image */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full lg:w-[570px] lg:shrink-0"
          >
            <div className="glass rounded-3xl overflow-hidden">
              <div className="p-4 border-b border-roofus-border flex items-center justify-between">
                <span className="text-xs font-mono text-roofus-muted">robot_preview</span>
                <a href="#robot" className="text-xs font-mono text-white/80 hover:text-white transition-colors">
                  open 3d →
                </a>
              </div>
              <div className="bg-roofus-dark/40 p-6">
                <img
                  src="/assets/robot.png"
                  alt="Roofus robot (placeholder render)"
                  className="w-full max-w-[430px] h-auto object-contain mx-auto"
                  loading="eager"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 flex items-center justify-center"
        >
          <motion.div
            animate={reducedMotion ? {} : { y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-roofus-muted"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest">Scroll</span>
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
