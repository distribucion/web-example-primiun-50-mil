import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// ─── Particle Canvas ───────────────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 160, 85, ${p.alpha})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(201, 160, 85, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} id="particle-canvas" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = ['Problèmes', 'Solutions', 'Processus', 'Témoignages', 'FAQ']

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'rgba(8,10,15,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="font-display text-xl font-600 tracking-tight">
          <span style={{ color: '#E8EAF0' }}>jo.</span>
          <span style={{ color: 'var(--gold)' }}>productions</span>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace('é', 'e').replace('è', 'e')}`}
              className="text-sm transition-colors duration-200"
              style={{ color: '#9CA3AF', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8EAF0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
            >
              {item}
            </a>
          ))}
        </div>

        <a href="#contact" className="hidden md:inline-flex btn-gold font-display text-sm py-3 px-6">
          Réserver une démo →
        </a>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? 'rotate(45deg) translateY(8px)' : '' }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ opacity: menuOpen ? 0 : 1 }} />
          <span className="block w-5 h-0.5 bg-white transition-all" style={{ transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : '' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4" style={{ background: 'rgba(8,10,15,0.98)' }}>
          {navItems.map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm py-2" style={{ color: '#9CA3AF' }} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <a href="#contact" className="btn-gold text-sm text-center mt-2" onClick={() => setMenuOpen(false)}>
            Réserver une démo →
          </a>
        </div>
      )}
    </nav>
  )
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.from(badgeRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' })
      .from(headlineRef.current, { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out' }, '-=0.2')
      .from(subRef.current, { opacity: 0, y: 30, duration: 0.7, ease: 'power3.out' }, '-=0.4')
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .from(statsRef.current?.children ? Array.from(statsRef.current.children) : [], {
        opacity: 0, y: 20, stagger: 0.15, duration: 0.5, ease: 'power3.out'
      }, '-=0.2')
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ paddingTop: '80px' }}
    >
      <ParticleCanvas />

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '600px',
          background: 'radial-gradient(ellipse at center, rgba(201,160,85,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div ref={badgeRef} className="inline-flex items-center gap-2 mb-8">
          <span
            style={{
              background: 'rgba(201,160,85,0.1)',
              border: '1px solid rgba(201,160,85,0.25)',
              borderRadius: '50px',
              padding: '8px 20px',
              fontSize: '13px',
              color: 'var(--gold)',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '0.05em',
            }}
          >
            ✦ Solutions IA pour gynécologues en Suisse
          </span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-700 leading-none mb-6"
          style={{ fontSize: 'clamp(42px, 7vw, 88px)', letterSpacing: '-0.03em', color: '#F0F2F8' }}
        >
          Augmentez votre{' '}
          <span className="gradient-gold">patientèle</span>
          <br />
          avec l'IA
        </h1>

        {/* Subheadline */}
        <p
          ref={subRef}
          className="mx-auto mb-10 leading-relaxed"
          style={{ maxWidth: '560px', color: '#9CA3AF', fontSize: '18px', fontFamily: 'Inter, sans-serif' }}
        >
          Attirez plus de clients automatiquement, réduisez la charge de travail
          manuelle et améliorez vos conversions. <span style={{ color: '#E8EAF0' }}>Sans effort.</span>
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a href="#contact" className="btn-gold font-display">
            Réserver une démo gratuite →
          </a>
          <a href="#solutions" className="btn-outline font-display">
            Voir les solutions
          </a>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="flex flex-wrap gap-8 justify-center"
        >
          {[
            { value: '+40%', label: 'rendez-vous', color: 'var(--gold)' },
            { value: '2 min', label: 'temps de réponse', color: 'var(--teal)' },
            { value: '-30%', label: 'absences', color: 'var(--gold)' },
          ].map(stat => (
            <div
              key={stat.value}
              className="flex items-center gap-3"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '12px',
                padding: '12px 24px',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color, flexShrink: 0 }} />
              <span className="font-display font-600" style={{ color: stat.color, fontSize: '22px' }}>{stat.value}</span>
              <span style={{ color: '#6B7280', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: '#4B5563', fontSize: '11px', letterSpacing: '0.1em', fontFamily: 'Space Grotesk, sans-serif' }}
      >
        <span>SCROLL</span>
        <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, #4B5563, transparent)' }} />
      </div>
    </section>
  )
}

// ─── Problems Section ──────────────────────────────────────────────────────────
function ProblemsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.problem-card', {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.problem-grid', start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const problems = [
    {
      icon: '👤',
      text: 'Des patients potentiels vous contactent mais ne reçoivent pas de réponse à temps ?',
      solution: 'Notre IA répond automatiquement en moins de 2 minutes, 24h/24.',
    },
    {
      icon: '⏱',
      text: 'Vous passez trop de temps sur des tâches administratives au lieu de soigner vos patients ?',
      solution: 'Automatisez les tâches répétitives et gagnez jusqu\'à 15 heures par semaine.',
    },
    {
      icon: '📅',
      text: 'Des patients oublient leurs rendez-vous et ne se présentent pas ?',
      solution: 'Notre système de rappel intelligent réduit les absences de 30%.',
    },
    {
      icon: '💬',
      text: 'Vous avez du mal à répondre rapidement à toutes les demandes de votre cabinet ?',
      solution: 'Un assistant IA dédié gère toutes les demandes entrantes en temps réel.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="problemes"
      className="py-32 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">DIAGNOSTIC</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Reconnaissez-vous<br />ces défis ?
          </h2>
        </div>

        <div className="problem-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((p, i) => (
            <div
              key={i}
              className="problem-card card-hover"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '32px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(201,160,85,0.08)',
                  border: '1px solid rgba(201,160,85,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  marginBottom: '20px',
                }}
              >
                {p.icon}
              </div>
              <p
                className="mb-4 leading-relaxed"
                style={{ color: '#D1D5DB', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}
              >
                {p.text}
              </p>
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '14px', marginTop: '1px', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'var(--teal)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>{p.solution}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#contact" className="btn-outline font-display">
            Résoudre ces problèmes →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Solutions Section ─────────────────────────────────────────────────────────
function SolutionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.solution-card', {
        opacity: 0,
        y: 60,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.solutions-grid', start: 'top 75%' },
      })
      // Counter animation
      gsap.utils.toArray<HTMLElement>('.counter-val').forEach(el => {
        const target = parseFloat(el.dataset.target || '0')
        const isPercent = el.dataset.format === 'percent'
        const isMin = el.dataset.format === 'min'
        const isHour = el.dataset.format === 'hour'
        const isMinus = el.dataset.format === 'minus'
        gsap.from({ val: 0 }, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
          onUpdate: function () {
            const v = Math.round(this.targets()[0].val)
            if (isPercent) el.textContent = `+${v}%`
            else if (isMin) el.textContent = `${v} min`
            else if (isHour) el.textContent = `${v}h`
            else if (isMinus) el.textContent = `-${v}%`
            else el.textContent = String(v)
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const solutions = [
    {
      stat: '40', format: 'percent', label: 'Rendez-vous',
      title: 'Suivi automatique des nouveaux patients',
      problem: 'Des patients intéressés qui n\'obtiennent pas de réponse.',
      result: 'Transformez 40% de demandes en plus en rendez-vous confirmés.',
      icon: '👥',
    },
    {
      stat: '2', format: 'min', label: 'Réponse',
      title: 'Assistant IA disponible 24h/24',
      problem: 'Réponse tardive aux demandes de patients.',
      result: 'Vos patients reçoivent une réponse en moins de 2 minutes.',
      icon: '🤖',
    },
    {
      stat: '30', format: 'minus', label: 'Absences',
      title: 'Gestion intelligente des rendez-vous',
      problem: 'Patients qui oublient leurs rendez-vous.',
      result: 'Réduction des absences non signalées de 30%.',
      icon: '📆',
    },
    {
      stat: '15', format: 'hour', label: 'Économisées/sem.',
      title: 'Création automatique de devis et documents',
      problem: 'Heures perdues à rédiger les mêmes documents.',
      result: 'Économisez jusqu\'à 15 heures de travail administratif par semaine.',
      icon: '📋',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="py-32 px-6"
      style={{ background: 'rgba(255,255,255,0.01)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">SOLUTIONS IA</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            L'automatisation qui{' '}
            <span className="gradient-gold">transforme</span>
            <br />
            votre pratique
          </h2>
        </div>

        <div className="solutions-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((s, i) => (
            <div
              key={i}
              className="solution-card card-hover"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                  opacity: 0.5,
                }}
              />

              <div className="flex justify-between items-start mb-6">
                <div
                  style={{
                    width: '48px', height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(201,160,85,0.08)',
                    border: '1px solid rgba(201,160,85,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}
                >
                  {s.icon}
                </div>
                <div className="text-right">
                  <div
                    className="counter-val font-display font-700"
                    data-target={s.stat}
                    data-format={s.format}
                    style={{ fontSize: '32px', color: 'var(--teal)', lineHeight: 1 }}
                  >
                    —
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '12px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}>
                    {s.label}
                  </div>
                </div>
              </div>

              <h3 className="font-display font-600 mb-3" style={{ color: '#F0F2F8', fontSize: '18px' }}>
                {s.title}
              </h3>
              <p className="mb-4" style={{ color: '#6B7280', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                Problème résolu : {s.problem}
              </p>
              <div className="flex items-start gap-2">
                <span style={{ color: 'var(--teal)', fontWeight: 600, fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                <span style={{ color: 'var(--teal)', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>{s.result}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#contact" className="btn-gold font-display">
            Je veux ces solutions →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Process Section ───────────────────────────────────────────────────────────
function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.process-steps', start: 'top 75%' },
      })
      gsap.from('.process-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.process-steps', start: 'top 70%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const steps = [
    {
      num: '01',
      icon: '🔍',
      title: 'Consultation gratuite',
      desc: 'Évaluation des besoins de votre clinique. Sans engagement.',
    },
    {
      num: '02',
      icon: '⚙️',
      title: 'Mise en œuvre',
      desc: 'Solutions IA adaptées à votre pratique médicale spécifique.',
    },
    {
      num: '03',
      icon: '🚀',
      title: 'Résultats concrets',
      desc: 'Des améliorations mesurables en moins de 6 semaines.',
    },
  ]

  return (
    <section ref={sectionRef} id="processus" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-4">PROCESSUS</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Trois étapes vers<br />
            <span className="gradient-gold">la transformation</span>
          </h2>
        </div>

        <div className="process-steps grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting lines desktop */}
          <div
            className="process-line hidden md:block absolute"
            style={{
              top: '60px',
              left: 'calc(33.33% + 16px)',
              right: 'calc(33.33% + 16px)',
              height: '1px',
              background: 'linear-gradient(90deg, rgba(201,160,85,0.3), rgba(201,160,85,0.1))',
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              className="process-step text-center"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '40px 32px',
                position: 'relative',
              }}
            >
              {/* Step number */}
              <div
                className="font-display font-700 mb-6 mx-auto flex items-center justify-center"
                style={{
                  width: '52px', height: '52px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #C9A055, #E8C07A)',
                  color: '#080A0F',
                  fontSize: '15px',
                  letterSpacing: '0.02em',
                }}
              >
                {step.num}
              </div>

              <div style={{ fontSize: '32px', marginBottom: '16px' }}>{step.icon}</div>

              <h3 className="font-display font-600 mb-3" style={{ color: '#F0F2F8', fontSize: '20px' }}>
                {step.title}
              </h3>
              <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: '1.6', fontFamily: 'Inter, sans-serif' }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials Section ──────────────────────────────────────────────────────
function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.testimonials-grid', start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const testimonials = [
    {
      quote: 'Grâce à jo.productions, j\'ai augmenté mes conversions de 40% en 3 mois. Résultats concrets, zéro bullshit.',
      name: 'Dr. Dupont',
      role: 'Gynécologue à Genève',
      metric: '+40%',
      metricLabel: 'conversions',
    },
    {
      quote: 'J\'économise 15 heures chaque semaine grâce à l\'automatisation de mes suivis. Du temps pour mes patients, enfin.',
      name: 'Dr. Martin',
      role: 'Gynécologue à Lausanne',
      metric: '15h',
      metricLabel: 'économisées/sem.',
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="temoignages"
      className="py-32 px-6"
      style={{ background: 'rgba(255,255,255,0.01)' }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">TÉMOIGNAGES</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Ce que disent<br />
            <span className="gradient-gold">nos clients</span>
          </h2>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card card-hover"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '40px',
                position: 'relative',
              }}
            >
              {/* Quote mark */}
              <div
                style={{
                  fontSize: '80px',
                  lineHeight: 0.8,
                  color: 'rgba(201,160,85,0.15)',
                  fontFamily: 'Georgia, serif',
                  marginBottom: '16px',
                }}
              >
                "
              </div>

              <p
                className="mb-8 leading-relaxed"
                style={{ color: '#D1D5DB', fontSize: '17px', fontStyle: 'italic', fontFamily: 'Inter, sans-serif' }}
              >
                {t.quote}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: '44px', height: '44px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(201,160,85,0.3), rgba(201,160,85,0.1))',
                      border: '1px solid rgba(201,160,85,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px',
                    }}
                  >
                    👩‍⚕️
                  </div>
                  <div>
                    <div className="font-display font-600" style={{ color: '#F0F2F8', fontSize: '15px' }}>{t.name}</div>
                    <div style={{ color: '#6B7280', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{t.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-700" style={{ color: 'var(--teal)', fontSize: '24px' }}>{t.metric}</div>
                  <div style={{ color: '#6B7280', fontSize: '11px', letterSpacing: '0.05em', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {t.metricLabel.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#contact" className="btn-gold font-display">
            Je veux des résultats comme ça →
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Why Section ───────────────────────────────────────────────────────────────
function WhySection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-item', {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.why-list', start: 'top 75%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const reasons = [
    { icon: '🎯', title: 'Attraction de nouveaux patients', desc: 'Optimisation de votre présence et automatisation des réponses.' },
    { icon: '⚡', title: 'Gain de temps immédiat', desc: 'Automatisation des processus manuels répétitifs dès la semaine 1.' },
    { icon: '💬', title: 'Satisfaction client maximale', desc: 'Réponse instantanée à toutes les requêtes, 24h/24, 7j/7.' },
    { icon: '📊', title: 'Résultats mesurables', desc: 'Dashboard de suivi avec KPIs clairs. Les chiffres parlent d\'eux-mêmes.' },
    { icon: '🇨🇭', title: 'Expertise locale suisse', desc: 'Lausanne & Fribourg. On connaît le marché romand de l\'intérieur.' },
    { icon: '🚀', title: 'Déploiement en 6 semaines', desc: 'Pas de projets qui traînent. On exécute, on mesure, on livre.' },
  ]

  return (
    <section ref={sectionRef} className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">AVANTAGES</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Pourquoi choisir<br />
            <span className="gradient-gold">jo.productions ?</span>
          </h2>
          <p className="mt-4 mx-auto" style={{ color: '#6B7280', maxWidth: '500px', fontFamily: 'Inter, sans-serif' }}>
            La plupart des agences te vendent de la visibilité. Nous, on te vend des résultats.
          </p>
        </div>

        <div className="why-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="why-item card-hover flex gap-4"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  width: '44px', height: '44px',
                  borderRadius: '10px',
                  background: 'rgba(201,160,85,0.08)',
                  border: '1px solid rgba(201,160,85,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                }}
              >
                {r.icon}
              </div>
              <div>
                <h3 className="font-display font-600 mb-1" style={{ color: '#F0F2F8', fontSize: '15px' }}>{r.title}</h3>
                <p style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.5', fontFamily: 'Inter, sans-serif' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Section ───────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: 'Quelle est la durée de la mise en œuvre ?',
      a: 'La mise en œuvre complète prend entre 4 et 6 semaines. On commence par un audit de votre clinique, puis on déploie les automatisations progressivement pour ne pas perturber votre pratique.',
    },
    {
      q: 'Est-ce que je peux essayer les solutions avant de m\'engager ?',
      a: 'Oui. On commence toujours par une consultation gratuite de 45 minutes. Vous repartez avec un plan d\'action concret, que vous travailliez avec nous ou non.',
    },
    {
      q: 'Comment l\'IA améliore-t-elle la conversion des leads ?',
      a: 'L\'IA répond aux demandes en moins de 2 minutes, qualifie les patients potentiels, et planifie automatiquement les rendez-vous. Un lead qui reçoit une réponse rapide convertit 40% plus souvent.',
    },
    {
      q: 'Suis-je formé pour utiliser les nouvelles solutions ?',
      a: 'Oui. Chaque implémentation inclut une session de formation pour vous et votre équipe. L\'objectif est que vous soyez complètement autonomes dès la fin du déploiement.',
    },
    {
      q: 'Y a-t-il un service de support après l\'implémentation ?',
      a: 'Absolument. On reste disponibles pour ajuster, optimiser et faire évoluer les automatisations selon vos besoins. Pas de disparition après livraison.',
    },
  ]

  return (
    <section
      id="faq"
      className="py-32 px-6"
      style={{ background: 'rgba(255,255,255,0.01)' }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">FAQ</div>
          <h2
            className="font-display font-700"
            style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Questions<br />
            <span className="gradient-gold">fréquentes</span>
          </h2>
        </div>

        <div className="flex flex-col gap-0">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <button
                className="w-full flex items-center justify-between py-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-display font-500"
                  style={{ color: open === i ? 'var(--gold)' : '#D1D5DB', fontSize: '16px', transition: 'color 0.2s' }}
                >
                  {faq.q}
                </span>
                <span
                  style={{
                    color: 'var(--gold)',
                    fontSize: '20px',
                    flexShrink: 0,
                    marginLeft: '16px',
                    transform: open === i ? 'rotate(45deg)' : 'rotate(0)',
                    transition: 'transform 0.3s',
                    display: 'inline-block',
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: '24px' }}>
                  <p style={{ color: '#9CA3AF', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Inter, sans-serif' }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact / CTA Section ─────────────────────────────────────────────────────
function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-step', {
        opacity: 0,
        y: 40,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-steps', start: 'top 75%' },
      })
      gsap.from('.contact-form', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.contact-form', start: 'top 80%' },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Headline */}
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-4">COMMENCER MAINTENANT</div>
          <h2
            className="font-display font-700 mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Prêt à transformer<br />
            <span className="gradient-gold">votre clinique ?</span>
          </h2>
          <p style={{ color: '#9CA3AF', fontSize: '16px', fontFamily: 'Inter, sans-serif', maxWidth: '480px', margin: '0 auto' }}>
            Rejoignez les gynécologues suisses qui ont déjà automatisé leur pratique.
            Résultats concrets. Sans bullshit.
          </p>
        </div>

        {/* Steps */}
        <div className="contact-steps grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
          {[
            { num: '1', title: 'Consultation gratuite', desc: 'Évaluation des besoins de votre clinique.' },
            { num: '2', title: 'Solutions IA adaptées', desc: 'Mise en œuvre sur mesure pour votre pratique.' },
            { num: '3', title: 'Résultats en 6 semaines', desc: 'Des améliorations mesurables rapidement.' },
          ].map((s, i) => (
            <div
              key={i}
              className="contact-step text-center"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '28px 24px',
              }}
            >
              <div
                className="font-display font-700 mx-auto mb-4 flex items-center justify-center"
                style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(201,160,85,0.12)',
                  border: '1px solid rgba(201,160,85,0.3)',
                  color: 'var(--gold)',
                  fontSize: '16px',
                }}
              >
                {s.num}
              </div>
              <h3 className="font-display font-600 mb-2" style={{ color: '#F0F2F8', fontSize: '15px' }}>{s.title}</h3>
              <p style={{ color: '#6B7280', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div
          className="contact-form"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '24px',
            padding: 'clamp(32px, 5vw, 56px)',
          }}
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Nom complet', placeholder: 'Dr. Votre nom', type: 'text', full: false },
              { label: 'Téléphone', placeholder: '+41 XX XXX XX XX', type: 'tel', full: false },
              { label: 'Email', placeholder: 'votre@email.ch', type: 'email', full: false },
              { label: 'Nom du cabinet', placeholder: 'Cabinet Dr. ...', type: 'text', full: false },
            ].map((field, i) => (
              <div key={i} className={field.full ? 'md:col-span-2' : ''}>
                <label
                  className="block mb-2 font-display"
                  style={{ color: '#9CA3AF', fontSize: '13px', letterSpacing: '0.05em' }}
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    color: '#F0F2F8',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,160,85,0.4)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                />
              </div>
            ))}

            <div className="md:col-span-2">
              <label
                className="block mb-2 font-display"
                style={{ color: '#9CA3AF', fontSize: '13px', letterSpacing: '0.05em' }}
              >
                Message
              </label>
              <textarea
                rows={4}
                placeholder="Décrivez vos besoins et défis actuels..."
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                  color: '#F0F2F8',
                  fontSize: '15px',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                  resize: 'vertical',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(201,160,85,0.4)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
            </div>

            <div className="md:col-span-2 text-center">
              <button type="submit" className="btn-gold font-display" style={{ fontSize: '16px', padding: '16px 48px' }}>
                Je veux automatiser mon cabinet →
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-16 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Big CTA */}
        <div className="text-center mb-16">
          <p
            className="font-display font-700 mb-6"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: '#F0F2F8', letterSpacing: '-0.02em' }}
          >
            Votre histoire mérite<br />
            <span className="gradient-gold">d'être vue.</span>
          </p>
          <a href="#contact" className="btn-gold font-display">
            Réserver ma démo gratuite →
          </a>
        </div>

        <div
          style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', marginBottom: '40px' }}
        />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display text-lg font-600">
            <span style={{ color: '#E8EAF0' }}>jo.</span>
            <span style={{ color: 'var(--gold)' }}>productions</span>
          </div>

          <p style={{ color: '#4B5563', fontSize: '13px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>
            © 2026 jo.productions · Solutions IA pour cliniques gynécologiques · Lausanne & Fribourg
          </p>

          <div className="flex gap-6">
            {['Problèmes', 'Solutions', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                style={{ color: '#4B5563', fontSize: '13px', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#4B5563')}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Reveal animations
    gsap.utils.toArray<Element>('.reveal').forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      })
    })

    // Accessibility
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.globalTimeline.timeScale(100)
    }

    return () => {
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,85,0.15), transparent)' }} />
      <ProblemsSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
      <SolutionsSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
      <ProcessSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
      <TestimonialsSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
      <WhySection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent)' }} />
      <FAQSection />
      <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,85,0.1), transparent)' }} />
      <ContactSection />
      <Footer />
    </div>
  )
}
