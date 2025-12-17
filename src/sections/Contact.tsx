import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, FileText, ArrowRight } from 'lucide-react'
import { Button, GlassCard } from '../components'
import { useReducedMotion } from '../hooks'

const nextSteps = [
  {
    title: 'Send roof context',
    description: 'Area, geometry source, constraints (edges/obstacles), and desired spacing/overlap.',
  },
  {
    title: 'We generate a plan',
    description: 'Swaths + route + waypoint export from the BDR mission planner for your execution stack.',
  },
  {
    title: 'Run + validate outputs',
    description: 'Execute mission and review deliverables (coverage + findings + audit log).',
  },
]

export function Contact() {
  const reducedMotion = useReducedMotion()

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <ArrowRight size={18} className="text-roofus-accent" />
            <span className="text-xs font-mono text-roofus-muted">next_steps</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-mono font-semibold text-white">
            Request a demo / pilot
          </h2>
          <p className="text-roofus-muted mt-2 max-w-2xl">
            If you share basic roof context, we can generate a planning + execution flow and walk through the outputs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="grid md:grid-cols-3 lg:grid-cols-1 gap-5 h-full lg:auto-rows-fr">
            {nextSteps.map((item, index) => (
              <GlassCard key={item.title} delay={index * 0.05} hover={false} className="h-full !p-5">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-roofus-accent/15 border border-roofus-border flex items-center justify-center font-mono text-roofus-accent">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-semibold text-white mb-0.5">{item.title}</h3>
                    <p className="text-sm text-roofus-muted leading-snug">{item.description}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <motion.div
            initial={reducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-7 h-full flex flex-col"
          >
            <h3 className="text-sm font-mono font-semibold text-white mb-3">contact</h3>
            <p className="text-sm text-roofus-muted mb-6">
              Send an email with roof context (area, geometry source, obstacles) and desired spacing/overlap. We’ll respond with a plan + demo options.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-7">
              <Button
                href="mailto:info@buildingdiagnosticrobotics.com?subject=Roofus%20Demo%20Request&body=Roof%20area%20(sq%20ft):%0ARoof%20geometry%20source:%0AConstraints%20(edges/obstacles):%0ADesired%20line%20spacing%20(ft):%0A"
                icon={<Mail size={18} />}
              >
                Email demo request
              </Button>
              <Button
                variant="secondary"
                href="mailto:info@buildingdiagnosticrobotics.com?subject=Sample%20Deliverables%20Request"
                icon={<FileText size={18} />}
              >
                Request sample outputs
              </Button>
            </div>

            <div className="mt-auto space-y-3 text-roofus-muted">
              <a href="mailto:info@buildingdiagnosticrobotics.com" className="flex items-center gap-2 hover:text-roofus-accent transition-colors font-mono text-sm">
                <Mail size={16} />
                <span>info@buildingdiagnosticrobotics.com</span>
              </a>
              <a href="tel:+15105149518" className="flex items-center gap-2 hover:text-roofus-accent transition-colors font-mono text-sm">
                <Phone size={16} />
                <span>(510) 514-9518</span>
              </a>
              <span className="flex items-center gap-2 font-mono text-sm">
                <MapPin size={16} />
                <span>Brooklyn, New York 11205</span>
              </span>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-roofus-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/bdr-logo.svg"
                alt="Building Diagnostic Robotics"
                className="h-9 w-auto opacity-95"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-roofus-muted">
              © 2025 Building Diagnostic Robotics · Brooklyn, New York 11205. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-roofus-muted">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
