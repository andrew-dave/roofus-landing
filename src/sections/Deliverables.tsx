import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, FileText, Database, Route } from 'lucide-react'
import { GlassCard } from '../components'
import { useReducedMotion } from '../hooks'

const deliverableBlocks = [
  {
    icon: Route,
    title: 'Planning outputs',
    items: ['waypoints.csv (x, y, yaw)', 'swath_corners.csv', 'route.json (swaths + params)'],
  },
  {
    icon: Database,
    title: 'Data products',
    items: ['thermal/* · rgb/* · lidar/* · gpr/*', 'timestamps + metadata (audit)', 'telemetry.jsonl (execution trace)'],
  },
  {
    icon: FileText,
    title: 'Reports',
    items: [
      'coverage_map.geojson (completeness)',
      'defect_map.geojson (annotations)',
      'report.pdf + export bundle',
      'repair_cost_estimate.csv (repairs)',
    ],
  },
]

export function Deliverables() {
  const reducedMotion = useReducedMotion()
  
  // Coverage-time estimator state (simple model)
  const [roofArea, setRoofArea] = useState(10000)
  const [lineSpacing, setLineSpacing] = useState(3)
  const [manualRate, setManualRate] = useState(15)

  // Constants for calculation
  const ROBOT_SPEED_MPS = 0.5 // meters per second
  const FEET_PER_METER = 3.28084
  const robotSpeedFtPerMin = ROBOT_SPEED_MPS * FEET_PER_METER * 60 // ≈98.4 ft/min
  const overheadFactor = 1.1 // 10% overhead for turns/safety

  // Ensure sane line spacing
  const effectiveLineSpacing = Math.max(lineSpacing, 0.5)
  const effectiveManualRate = Math.max(manualRate, 1)

  // Coverage rate uses path width (line spacing)
  const coverageRateSqFtPerMin = robotSpeedFtPerMin * effectiveLineSpacing

  // Calculations
  const estimatedScanTime = Math.ceil((roofArea / coverageRateSqFtPerMin) * overheadFactor)
  const manualInspectionTime = Math.ceil(roofArea / effectiveManualRate)
  const laborHoursSaved = Math.max(0, Math.round(((manualInspectionTime - estimatedScanTime) / 60) * 10) / 10)

  return (
    <section id="deliverables" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <FileText size={18} className="text-roofus-accent" />
            <span className="text-xs font-mono text-roofus-muted">outputs</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-semibold text-white">
            Deliverables + coverage model
          </h2>
          <p className="text-roofus-muted mt-2 max-w-2xl">
            Outputs are designed to be auditable: deterministic plans, telemetry, and exportable artifacts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Deliverables */}
          <div className="grid sm:grid-cols-2 gap-5">
            {deliverableBlocks.map((block, index) => (
              <GlassCard
                key={block.title}
                delay={index * 0.05}
                hover={false}
                className={`!p-5 md:!p-6 ${
                  deliverableBlocks.length % 2 === 1 && index === deliverableBlocks.length - 1 ? 'sm:col-span-2' : ''
                }`}
              >
                <div className="flex flex-col h-full min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-roofus-accent/20 to-roofus-secondary/20 flex items-center justify-center">
                      <block.icon size={18} className="text-roofus-accent" />
                    </div>
                    <h3 className="text-sm font-mono font-semibold text-white">{block.title}</h3>
                  </div>
                  <ul className="mt-3 space-y-1.5">
                    {block.items.map((item) => (
                      <li key={item} className="grid grid-cols-[auto_1fr] gap-2 text-sm text-roofus-muted font-mono">
                        <span className="text-roofus-muted/60">-</span>
                        <span className="min-w-0 truncate">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Estimator */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-6 md:p-7 h-full flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-roofus-accent/20 to-roofus-secondary/20 flex items-center justify-center">
                <Calculator size={18} className="text-roofus-accent" />
              </div>
              <div>
                <h3 className="text-sm font-mono font-semibold text-white">coverage_time_model</h3>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Inputs */}
              <div className="grid h-full sm:grid-cols-2 gap-4 content-between">
                <div>
                  <label className="block text-xs font-mono text-roofus-muted mb-1.5">
                    roof_area_sqft
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={roofArea}
                      onChange={(e) => setRoofArea(Number(e.target.value) || 0)}
                      style={{ width: 128 }}
                      className="w-full pl-4 pr-12 py-2.5 glass rounded-xl bg-roofus-dark/50 text-white border border-roofus-border focus:border-roofus-accent focus:outline-none transition-colors font-mono"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-roofus-muted">
                      ft²
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-roofus-muted mb-1.5">
                    line_spacing_ft
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={lineSpacing}
                      onChange={(e) => setLineSpacing(Number(e.target.value) || 1)}
                      className="w-full pl-4 pr-10 py-2.5 glass rounded-xl bg-roofus-dark/50 text-white border border-roofus-border focus:border-roofus-accent focus:outline-none transition-colors font-mono"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-roofus-muted">
                      ft
                    </span>
                  </div>
                </div>
                <div className="sm:col-span-2 sm:justify-self-center sm:w-[calc((100%-1rem)/2)]">
                  <label className="block text-xs font-mono text-roofus-muted mb-1.5">
                    manual_rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={manualRate}
                      onChange={(e) => setManualRate(Number(e.target.value) || 1)}
                      className="w-full pl-4 pr-16 py-2.5 glass rounded-xl bg-roofus-dark/50 text-white border border-roofus-border focus:border-roofus-accent focus:outline-none transition-colors font-mono"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-roofus-muted tracking-tight">
                      ft²/min
                    </span>
                  </div>
                  <p className="text-[11px] text-roofus-muted mt-2 font-mono">
                    typical range: 10–25 ft²/min
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="glass-strong rounded-2xl p-3 md:p-4 flex flex-col justify-self-center w-full md:max-w-[280px] text-center">
                <div className="mx-auto relative w-[250px] max-w-full rounded-xl border border-roofus-border/50 bg-roofus-dark/30 px-3 py-2">
                  <div className="flex flex-col gap-4 text-left">
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-roofus-muted mb-1 break-words leading-tight w-[95px]">
                        scan_time_min
                      </p>
                      <p
                        className="text-xl md:text-2xl font-mono font-semibold text-roofus-accent"
                        style={{ color: 'rgba(31, 137, 71, 1)' }}
                      >
                        {estimatedScanTime}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-mono text-roofus-muted mb-1 break-words leading-tight">
                        labor_hours_saved
                      </p>
                      <p className="text-xl md:text-2xl font-mono font-semibold text-roofus-secondary">
                        ~{laborHoursSaved}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-roofus-muted mt-4 font-mono">
                  Directional estimate only. Overhead factor includes turns/safety margins.
                </p>
              </div>
            </div>

            <p className="text-xs text-roofus-muted font-mono mt-6">
              v=0.5 m/s; rate ≈ 98.4×spacing ft²/min; +10% overhead
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

