import { motion } from 'framer-motion'
import { Target, Route, Send, Braces, Map } from 'lucide-react'
import { VideoFrame, GlassCard } from '../components'
import { useReducedMotion } from '../hooks'

const callouts = [
  {
    icon: Map,
    title: 'Explore: build map (teleop)',
    description: 'Drive Roofus in teleop to capture geometry and produce a map usable by the planner.',
  },
  {
    icon: Target,
    title: 'Input: ROI + constraints',
    description: 'Import the map/geometry, define the boundary polygon, and mark obstacles / no‑go zones.',
  },
  {
    icon: Route,
    title: 'Compute: swaths + route',
    description: 'BDR mission planner generates coverage swaths and an ordered route with consistent line spacing.',
  },
  {
    icon: Send,
    title: 'Export: CSV → execute',
    description: 'Export waypoints.csv (x,y,yaw) + swath_corners.csv, then execute with telemetry + logging.',
  },
]

const comparison = [
  {
    title: 'Operator (UI)',
    items: [
      'Teleop exploration / mapping',
      'Import map or roof geometry',
      'Define boundary ROI + obstacles',
      'Set line_spacing_ft + overlap policy',
      'Generate swaths + route (BDR mission planner)',
      'Export plan artifacts (CSV/JSON)',
      'Monitor telemetry + coverage',
    ],
  },
  {
    title: 'Roofus (robot)',
    items: [
      'Build map during teleop (exploration)',
      'Execute waypoint plan autonomously',
      'Maintain spacing + turn policy',
      'Capture GPR / thermal / LiDAR / RGB',
      'Stop on communication loss',
      'Log timestamps + metadata',
    ],
  },
]

export function Planning() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="planning" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Braces size={18} className="text-roofus-accent" />
            <span className="text-xs font-mono text-roofus-muted">planning</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-semibold text-white">
            BDR mission planner
          </h2>
          <p className="text-roofus-muted mt-2 max-w-2xl">
            Convert roof geometry into repeatable coverage paths. Planning runs on a laptop UI; execution runs on the robot.
            Outputs are deterministic and exportable for audit trails and before/after comparisons.
          </p>
        </motion.div>

        <div className="mb-16">
          {/* Video frame with WebM support and poster */}
          <VideoFrame
            src=""
            webmSrc="/assets/planner-demo.webm"
            fallbackImage="/assets/planner-placeholder.svg"
            poster="/assets/path_planning.png"
            className="aspect-video w-full max-w-5xl mx-auto"
            showControls={true}
          />

          {/* Callouts: 2x2 grid below video */}
          <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {callouts.map((callout, index) => (
              <GlassCard key={callout.title} delay={index * 0.1} hover={false} className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-roofus-accent/20 to-roofus-secondary/20 flex items-center justify-center">
                    <callout.icon size={20} className="text-roofus-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-semibold text-white mb-1">
                      {callout.title}
                    </h3>
                    <p className="text-roofus-muted text-sm">
                      {callout.description}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Operator vs Robot comparison */}
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {comparison.map((column, colIndex) => (
              <div key={column.title} className="glass rounded-3xl p-7">
                <h3 className="text-lg font-mono font-semibold text-white mb-4 flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      colIndex === 0 ? 'bg-roofus-accent' : 'bg-roofus-secondary'
                    }`}
                  />
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.items.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={reducedMotion ? {} : { opacity: 0, x: colIndex === 0 ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center gap-3 text-roofus-text text-sm font-mono"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          colIndex === 0 ? 'bg-roofus-accent' : 'bg-roofus-secondary'
                        }`}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
