import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUp } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { label: 'specs', href: '#specs' },
  { label: 'planner', href: '#planning' },
  { label: 'robot', href: '#robot' },
  { label: 'outputs', href: '#deliverables' },
  { label: 'contact', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'glass-strong py-3' : 'glass py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#overview" className="flex items-center gap-3 group">
            <span className="inline-flex items-center gap-2">
              <span className="h-8 flex items-center">
                <img
                  src="/assets/bdr-logo.svg"
                  alt="Building Diagnostic Robotics"
                  className="h-8 w-auto opacity-95 group-hover:opacity-100 transition-opacity"
                  loading="lazy"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-mono font-semibold tracking-wide text-white/90 group-hover:text-white transition-colors">
                  ROOFUS
                </span>
                <span className="text-[11px] text-roofus-muted font-mono">
                  robot + BDR mission planner
                </span>
              </span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-roofus-muted hover:text-white transition-colors font-mono text-sm"
              >
                {item.label}
              </a>
            ))}

            <a
              href="#contact"
              className="px-4 py-2 bg-roofus-accent text-roofus-darker font-mono font-semibold rounded-xl hover:bg-roofus-secondary transition-all hover:shadow-lg hover:shadow-roofus-accent/20"
            >
              request_demo
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-strong mt-2 mx-4 rounded-2xl overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-roofus-text hover:text-white transition-colors font-mono py-2"
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href="#contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 px-5 py-3 bg-roofus-accent text-roofus-darker font-mono font-semibold rounded-xl text-center"
                >
                  request_demo
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-roofus-accent/20 transition-colors group"
            aria-label="Back to top"
          >
            <ArrowUp size={20} className="text-roofus-accent group-hover:text-white transition-colors" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}
