import { motion } from 'framer-motion'
import clsx from 'clsx'
import { useReducedMotion } from '../hooks'

interface Step {
  title: string
  description: string
  icon?: React.ReactNode
}

interface StepperProps {
  steps: Step[]
  activeStep: number
}

export function Stepper({ steps, activeStep }: StepperProps) {
  const reducedMotion = useReducedMotion()

  return (
    <div className="relative">
      {/* Connecting line */}
      <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-roofus-border md:-translate-x-px" />
      
      {/* Progress line */}
      <motion.div
        className="absolute left-6 md:left-1/2 top-0 w-px bg-gradient-to-b from-roofus-accent to-roofus-secondary md:-translate-x-px origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: (activeStep + 1) / steps.length }}
        transition={{ duration: reducedMotion ? 0 : 0.5, ease: 'easeOut' }}
        style={{ height: '100%' }}
      />

      <div className="space-y-12 md:space-y-16">
        {steps.map((step, index) => {
          const isActive = index <= activeStep
          const isCurrent = index === activeStep

          return (
            <motion.div
              key={step.title}
              initial={reducedMotion ? {} : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={clsx(
                'relative flex items-start gap-6',
                'md:grid md:grid-cols-2 md:gap-12',
                index % 2 === 1 && 'md:text-right'
              )}
            >
              {/* Step indicator */}
              <div
                className={clsx(
                  'relative z-10 flex-shrink-0',
                  'md:absolute md:left-1/2 md:-translate-x-1/2'
                )}
              >
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    boxShadow: isCurrent
                      ? '0 0 34px rgba(31, 137, 71, 0.55)'
                      : '0 0 0 rgba(31, 137, 71, 0)',
                  }}
                  transition={{ duration: reducedMotion ? 0 : 0.3 }}
                  className={clsx(
                    'w-12 h-12 rounded-full flex items-center justify-center font-display font-bold transition-colors duration-300',
                    isActive
                      ? 'bg-gradient-to-br from-roofus-accent to-roofus-secondary text-roofus-darker'
                      : 'glass text-roofus-muted'
                  )}
                >
                  {index + 1}
                </motion.div>
              </div>

              {/* Content */}
              <div
                className={clsx(
                  'flex-1 pt-1',
                  'md:col-span-1',
                  index % 2 === 0 ? 'md:pr-24' : 'md:pl-24 md:col-start-2'
                )}
              >
                <h3
                  className={clsx(
                    'text-xl md:text-2xl font-display font-bold mb-2 transition-colors duration-300',
                    isActive ? 'text-white' : 'text-roofus-muted'
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={clsx(
                    'text-base transition-colors duration-300',
                    isActive ? 'text-roofus-text' : 'text-roofus-muted/60'
                  )}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}



