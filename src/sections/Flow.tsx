import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Stepper } from '../components'
import { useReducedMotion } from '../hooks'

const steps = [
  {
    title: 'Capture',
    description: 'Define the roof geometry and boundaries using aerial imagery or CAD data.',
  },
  {
    title: 'Plan',
    description: 'Generate optimal coverage paths with the BDR mission planner.',
  },
  {
    title: 'Execute',
    description: 'Deploy Roofus to autonomously traverse the planned route with consistent coverage.',
  },
  {
    title: 'Analyze',
    description: 'Process captured data with automated defect detection and annotation.',
  },
  {
    title: 'Report',
    description: 'Generate shareable, auditable deliverables with coverage metrics and findings.',
  },
]

export function Flow() {
  const [activeStep, setActiveStep] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return

      const section = sectionRef.current
      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate progress through section
      const sectionTop = rect.top
      const progress = Math.max(0, Math.min(1, 
        (viewportHeight - sectionTop) / (sectionHeight + viewportHeight * 0.5)
      ))

      // Map progress to step index
      const stepIndex = Math.min(
        Math.floor(progress * steps.length),
        steps.length - 1
      )
      setActiveStep(stepIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="workflow"
      className="section-padding relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-[600px] bg-gradient-to-r from-roofus-accent/5 to-transparent blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-6 relative">
        <motion.div
          initial={reducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4">
            From plan to proof—
            <span className="gradient-text">end to end.</span>
          </h2>
          <p className="text-lg text-roofus-muted max-w-2xl mx-auto">
            A complete workflow that transforms roof geometry into auditable inspection data.
          </p>
        </motion.div>

        <Stepper steps={steps} activeStep={activeStep} />
      </div>
    </section>
  )
}



