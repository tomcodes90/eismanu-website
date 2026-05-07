'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { Mail } from 'lucide-react'
import { clsx } from 'clsx'

const links = [
  { href: '/eis',                 label: 'Eis' },
  { href: '/speisen-getraenke',   label: 'Speisen & Getränke' },
  { href: '/ueber-uns',           label: 'Über uns' },
  { href: '/news',                label: 'News' },
  { href: '/kontakt',             label: 'Kontakt' },
]

function IconFacebook() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconInstagram() {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

const socials = [
  { href: 'https://facebook.com',  Icon: IconFacebook,  label: 'Facebook (öffnet in neuem Fenster)' },
  { href: 'https://instagram.com', Icon: IconInstagram, label: 'Instagram (öffnet in neuem Fenster)' },
  { href: 'mailto:info@eismanufaktur-geratal.de', Icon: () => <Mail aria-hidden="true" size={22} />, label: 'E-Mail schreiben' },
]

export function Navbar() {
  const [open, setOpen]         = useState(false)
  const [visible, setVisible]   = useState(true)
  const pathname                = usePathname()
  const hamburgerRef            = useRef<HTMLButtonElement>(null)
  const closeRef                = useRef<HTMLButtonElement>(null)
  const dialogRef               = useRef<HTMLDivElement>(null)
  const lastScrollY             = useRef(0)

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    function onScroll() {
      const currentY = window.scrollY
      if (currentY < 80 || currentY < lastScrollY.current) {
        setVisible(true)
      } else {
        setVisible(false)
      }
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll and manage focus when menu opens
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus management + Escape key + focus trap
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
        hamburgerRef.current?.focus()
        return
      }
      if (e.key === 'Tab') {
        const dialog = dialogRef.current
        if (!dialog) return
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])',
          ),
        )
        const first = focusable[0]
        const last  = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  function closeMenu() {
    setOpen(false)
    hamburgerRef.current?.focus()
  }

  return (
    <>
      <header className={clsx(
        'sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100',
        'transition-transform duration-300',
        visible ? 'translate-y-0' : '-translate-y-full',
      )}>
        <nav aria-label="Hauptnavigation" className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" aria-label="Startseite — EisManuFaktur Geratal" className="flex items-center">
            <Image
              src="/images/eis-granatapfel.png"
              alt="EisManuFaktur Geratal"
              height={72}
              width={72}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={clsx(
                    'font-kaushan text-lg transition-colors',
                    pathname === href
                      ? 'text-brand-red'
                      : 'text-brand-dark hover:text-brand-red',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop social icons + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/#reservierung" className="btn-primary text-base px-4 py-2">
              Reservieren
            </Link>
            {socials.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="text-brand-teal hover:text-brand-red transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerRef}
            className="md:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-brand-dark"
            onClick={() => setOpen(true)}
            aria-label="Menü öffnen"
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      {open && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[60] flex flex-col md:hidden"
          style={{ backgroundImage: "url('/images/background_blue.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-brand-dark/60" />

          <div className="relative z-10 flex flex-col items-center h-full py-8 px-8">
            {/* Close button */}
            <button
              ref={closeRef}
              className="absolute top-8 right-8 text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={closeMenu}
              aria-label="Menü schließen"
            >
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="mt-6 mb-8">
              <Image
                src="/images/eismanu-logo.png"
                alt="EisManuFaktur Geratal"
                width={160}
                height={64}
                className="object-contain"
              />
            </div>

            {/* Nav links */}
            <nav aria-label="Mobile Navigation" className="flex flex-col items-center gap-5 flex-1 justify-center">
              {links.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  aria-current={pathname === href ? 'page' : undefined}
                  className={clsx(
                    'font-kaushan text-3xl transition-colors',
                    pathname === href ? 'text-brand-yellow' : 'text-white hover:text-brand-yellow',
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Social icons */}
            <div className="flex justify-center gap-4 mb-6">
              {socials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="w-12 h-12 rounded-xl bg-brand-teal flex items-center justify-center text-white hover:bg-brand-red transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
