import { motion } from 'framer-motion'
import { Braces, Gauge, Map, FileText, ScanLine, Cpu, Shield } from 'lucide-react'
import { useReducedMotion } from '../hooks'

type SpecRow = { key: string; value: string; note?: string }
type SpecGroup = { title: string; rows: SpecRow[] }

const specGroups: SpecGroup[] = [
  {
    title: 'platform',
    rows: [
      { key: 'mass', value: '12 kg (26.5 lb)' },
      { key: 'envelope', value: '≈35 × 35 × 25 cm (~13.8 × 13.8 × 9.8 in)' },
      { key: 'max_speed', value: '0.5 m/s (1.64 ft/s)' },
      { key: 'max_slope', value: '20°' },
    ],
  },
  {
    title: 'power',
    rows: [
      { key: 'battery', value: '24 V · 20 Ah (~480 Wh)' },
      { key: 'charge_time', value: '8 h (full)' },
    ],
  },
  {
    title: 'environment',
    rows: [
      { key: 'operating_temp', value: '0–40 °C (32–104 °F)' },
      { key: 'surface', value: 'commercial flat roofs and concrete surfaces' },
    ],
  },
  {
    title: 'safety',
    rows: [
      { key: 'failsafe', value: 'stop on communication loss' },
      { key: 'constraints', value: 'boundary + obstacle polygons (planner)' },
    ],
  },
]

const modules = [
  {
    icon: ScanLine,
    title: 'sensor_suite',
    lines: [
      'ground‑penetrating radar (GPR)',
      'thermal camera',
      '3D LiDAR',
      'RGB cameras',
      'multimodal ML pipeline → defect map + annotations (post)',
    ],
  },
  {
    icon: Cpu,
    title: 'compute + planning',
    lines: [
      'planner runs on laptop (operator UI)',
      'exploration/mapping via teleop on robot',
      'BDR mission planner generates swaths + route (deterministic)',
      'exports are CSV-friendly (x, y, yaw) at regular intervals',
    ],
  },
  {
    icon: Shield,
    title: 'operational_constraints',
    lines: [
      'commercial flat roofs (current target surface)',
      'line spacing drives coverage width (operator-set)',
      'collision avoidance via no‑go zones + obstacle polygons',
    ],
  },
]

const ioBlocks = [
  {
    icon: Map,
    title: 'Inputs',
    lines: [
      'map (from teleop exploration) or roof geometry',
      'boundary polygon',
      'no-go / obstacle polygons',
      'line spacing + overlap policy',
      'sensor capture profile (TBD)',
    ],
  },
  {
    icon: Braces,
    title: 'Outputs',
    lines: [
      'planned swaths + route',
      'waypoints.csv (x, y, yaw)',
      'swath_corners.csv',
      'execution trace + timestamps',
    ],
  },
  {
    icon: FileText,
    title: 'Artifacts',
    lines: [
      'audit trail: what / when / where',
      'coverage completeness metrics',
      'report package (visualizations + tables)',
    ],
  },
]

export function Specs() {
  const reducedMotion = useReducedMotion()
  const ArtifactsIcon = ioBlocks[2].icon

  return (
    <section id="specs" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Gauge size={18} className="text-roofus-accent" />
            <span className="text-xs font-mono text-roofus-muted">spec_sheet</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-semibold text-white">
            Specs + interfaces
          </h2>
          <p className="text-roofus-muted mt-2 max-w-2xl">
            A concise, public-facing spec sheet. Anything not finalized is marked <span className="font-mono text-white">TBD</span>.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: grouped specs */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="p-5 border-b border-roofus-border flex items-center justify-between">
              <span className="text-xs font-mono text-roofus-muted">hardware</span>
              <span className="text-xs font-mono text-roofus-muted">metric + imperial</span>
            </div>
            <div className="p-5">
              <div className="space-y-5">
                {specGroups.map((group, groupIndex) => (
                  <div
                    key={group.title}
                    className={groupIndex === 0 ? '' : 'pt-5 border-t border-roofus-border'}
                  >
                    <div className="text-xs font-mono text-roofus-muted mb-3">{group.title}</div>
                    <div className="space-y-3">
                      {group.rows.map((row) => (
                        <div
                          key={row.key}
                          className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-1.5 sm:gap-4 items-start sm:items-baseline"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-mono text-roofus-muted">{row.key}</div>
                            {row.note && <div className="text-[11px] text-roofus-muted/80">{row.note}</div>}
                          </div>
                          <div className="text-sm font-mono text-white text-left sm:text-right whitespace-normal sm:whitespace-nowrap break-words">
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: modules + I/O contract */}
          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="p-5 border-b border-roofus-border flex items-center justify-between">
              <span className="text-xs font-mono text-roofus-muted">modules</span>
              <span className="text-xs font-mono text-roofus-muted">system view</span>
            </div>
            <div className="p-5 space-y-4">
              {modules.map((block) => (
                <div key={block.title} className="glass-strong rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <block.icon size={16} className="text-roofus-accent" />
                    <span className="text-sm font-mono text-white">{block.title}</span>
                  </div>
                  <ul className="space-y-1">
                    {block.lines.map((line) => (
                      <li key={line} className="text-sm text-roofus-muted font-mono">
                        - {line}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="h-px bg-roofus-border my-2" />

              <div className="grid sm:grid-cols-2 gap-4">
                {ioBlocks.slice(0, 2).map((block) => (
                  <div key={block.title} className="glass-strong rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <block.icon size={16} className="text-roofus-accent" />
                      <span className="text-sm font-mono text-white">{block.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {block.lines.map((line) => (
                        <li key={line} className="text-sm text-roofus-muted font-mono">
                          - {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="glass-strong rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArtifactsIcon size={16} className="text-roofus-accent" />
                  <span className="text-sm font-mono text-white">{ioBlocks[2].title}</span>
                </div>
                <ul className="space-y-1">
                  {ioBlocks[2].lines.map((line) => (
                    <li key={line} className="text-sm text-roofus-muted font-mono">
                      - {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
