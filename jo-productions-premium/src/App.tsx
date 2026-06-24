import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

const HERO_IMAGE = 'https://d8j0ntlcm91z4.cloudfront.net/user_2yxnC38yyLjxAYEPnOB6Vu0j63H/hf_20260624_213132_2121440c-0241-4ec9-8392-52cf18cd991c.png'

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201,160,85,${p.alpha})`
        ctx.fill()
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(201,160,85,${0.06 * (1 - dist / 100)})`
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
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} id="particle-canvas" />
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const navItems = [
    { label: 'Défis', href: '#problemes' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Processus', href: '#processus' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700" style={{
      background: scrolled ? 'rgba(6,8,13,0.92)' : 'transparent',
      backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,160,85,0.1)' : '1px solid transparent',
    }}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <a href="#" className="font-display font-bold text-xl" style={{ letterSpacing: '-0.02em' }}>
          <span style={{ color: '#E8EAF0' }}>jo.</span>
          <span style={{ color: 'var(--gold)' }}>productions</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className="text-sm font-medium transition-all duration-200"
              style={{ color: '#6B7280', fontFamily: 'Inter, sans-serif' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E8EAF0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}>
              {item.label}
            </a>
          ))}
        </div>
        <a href="#contact" className="hidden md:inline-flex btn-gold" style={{ padding: '11px 28px', fontSize: '14px' }}>
          Réserver une démo →
        </a>
        <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0, 1, 2].map(i => (
            <span key={i} className="block w-5 h-0.5 bg-white transition-all duration-300" style={{
              transform: menuOpen ? (i === 0 ? 'rotate(45deg) translateY(8px)' : i === 2 ? 'rotate(-45deg) translateY(-8px)' : '') : '',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-8 flex flex-col gap-5" style={{ background: 'rgba(6,8,13,0.98)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {navItems.map(item => (
            <a key={item.label} href={item.href} className="text-sm py-1" style={{ color: '#9CA3AF' }} onClick={() => setMenuOpen(false)}>{item.label}</a>
          ))}
          <a href="#contact" className="btn-gold text-sm text-center mt-2" onClick={() => setMenuOpen(false)}>Réserver une démo →</a>
        </div>
      )}
    </nav>
  )
}

function HeroSection() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    tl.from(imageRef.current, { opacity: 0, scale: 1.06, duration: 1.6, ease: 'power2.out' })
      .from(badgeRef.current, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' }, '-=1.1')
      .from(headlineRef.current, { opacity: 0, y: 50, duration: 1, ease: 'power3.out' }, '-=0.5')
      .from(subRef.current, { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.6')
      .from(ctaRef.current, { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' }, '-=0.5')
      .from(statsRef.current?.children ? Array.from(statsRef.current.children) : [], {
        opacity: 0, y: 20, stagger: 0.12, duration: 0.6, ease: 'power3.out'
      }, '-=0.3')
  }, [])
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ paddingTop: '80px' }}>
      <div ref={imageRef} className="absolute inset-0">
        <img src={HERO_IMAGE} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(6,8,13,0.5) 0%, rgba(6,8,13,0.25) 40%, rgba(6,8,13,0.65) 75%, rgba(6,8,13,1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(6,8,13,0.55) 100%)' }} />
      </div>
      <ParticleCanvas />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div ref={badgeRef} className="inline-flex items-center mb-8">
          <span style={{
            background: 'rgba(201,160,85,0.08)', border: '1px solid rgba(201,160,85,0.3)',
            borderRadius: '100px', padding: '9px 22px', fontSize: '12px', color: 'var(--gold)',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>✦ &nbsp;Solutions IA · Gynécologues Suisse</span>
        </div>
        <h1 ref={headlineRef} className="font-display font-bold mb-6" style={{
          fontSize: 'clamp(44px, 7.5vw, 96px)', letterSpacing: '-0.035em', lineHeight: 1.0, color: '#F4F6FC',
        }}>
          Augmentez votre{' '}
          <span className="gradient-gold">patientèle</span>
          <br />avec l'intelligence
          <br />artificielle
        </h1>
        <p ref={subRef} className="mx-auto mb-10" style={{
          maxWidth: '520px', color: 'rgba(200,205,220,0.75)', fontSize: '18px',
          fontFamily: 'Inter, sans-serif', lineHeight: 1.7,
        }}>
          Attirez plus de patients, automatisez l'administratif et réduisez les absences.{' '}
          <span style={{ color: '#E8EAF0', fontWeight: 500 }}>Résultats mesurables en 6 semaines.</span>
        </p>
        <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a href="#contact" className="btn-gold font-display">Réserver une démo gratuite →</a>
          <a href="#solutions" className="btn-outline font-display">Découvrir les solutions</a>
        </div>
        <div ref={statsRef} className="flex flex-wrap gap-4 justify-center">
          {[
            { value: '+40%', label: 'rendez-vous confirmés', color: 'var(--gold)' },
            { value: '< 2 min', label: "temps de réponse IA", color: 'var(--teal)' },
            { value: '−30%', label: "taux d'absences", color: 'var(--gold)' },
            { value: '15h', label: 'économisées / semaine', color: 'var(--teal)' },
          ].map(stat => (
            <div key={stat.value} className="flex items-center gap-3" style={{
              background: 'rgba(6,8,13,0.65)', backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '14px 24px',
            }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: stat.color, boxShadow: `0 0 8px ${stat.color}` }} />
              <span className="font-display font-bold" style={{ color: stat.color, fontSize: '20px', letterSpacing: '-0.02em' }}>{stat.value}</span>
              <span style={{ color: '#4B5563', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ color: '#374151', fontSize: '10px', letterSpacing: '0.15em', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
        <span>DÉFILER</span>
        <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, rgba(201,160,85,0.5), transparent)' }} />
      </div>
    </section>
  )
}

function ProblemsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.problem-card', { opacity: 0, y: 70, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.problem-grid', start: 'top 78%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const problems = [
    { icon: '👤', text: 'Des patients potentiels vous contactent mais ne reçoivent pas de réponse à temps ?', solution: 'Notre IA répond automatiquement en moins de 2 minutes, 24h/24.' },
    { icon: '⏱', text: 'Vous passez trop de temps sur des tâches administratives au lieu de soigner vos patients ?', solution: "Automatisez les tâches répétitives et gagnez jusqu'à 15 heures par semaine." },
    { icon: '📅', text: 'Des patients oublient leurs rendez-vous et ne se présentent pas ?', solution: 'Notre système de rappel intelligent réduit les absences de 30%.' },
    { icon: '💬', text: 'Vous avez du mal à répondre rapidement à toutes les demandes de votre cabinet ?', solution: 'Un assistant IA dédié gère toutes les demandes entrantes en temps réel.' },
  ]
  return (
    <section ref={sectionRef} id="problemes" className="py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">Diagnostic</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Reconnaissez-vous<br /><span className="gradient-gold">ces défis ?</span>
          </h2>
          <p className="mt-5 mx-auto" style={{ color: '#4B5563', maxWidth: '450px', fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.7 }}>
            La plupart des cabinets gynécologiques perdent 30% de leur potentiel par manque d'automatisation.
          </p>
        </div>
        <div className="problem-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {problems.map((p, i) => (
            <div key={i} className="problem-card feature-card">
              <div className="icon-box mb-6">{p.icon}</div>
              <p className="mb-5 leading-relaxed" style={{ color: '#9CA3AF', fontSize: '16px', fontFamily: 'Inter, sans-serif' }}>{p.text}</p>
              <div className="flex items-start gap-3" style={{ background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: '12px', padding: '14px 16px' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(0,200,150,0.9)', fontSize: '14px', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}>{p.solution}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <a href="#contact" className="btn-outline font-display">Résoudre ces problèmes →</a>
        </div>
      </div>
    </section>
  )
}

function SolutionsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.solution-card', { opacity: 0, y: 70, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.solutions-grid', start: 'top 78%' } })
      gsap.utils.toArray<HTMLElement>('.counter-val').forEach(el => {
        const target = parseFloat(el.dataset.target || '0')
        const fmt = el.dataset.format
        gsap.from({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
          onUpdate: function () {
            const v = Math.round(this.targets()[0].val)
            if (fmt === 'percent') el.textContent = `+${v}%`
            else if (fmt === 'min') el.textContent = `${v} min`
            else if (fmt === 'hour') el.textContent = `${v}h`
            else if (fmt === 'minus') el.textContent = `-${v}%`
            else el.textContent = String(v)
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const solutions = [
    { stat: '40', format: 'percent', label: 'Rendez-vous', title: 'Suivi automatique des nouveaux patients', problem: "Des patients intéressés qui n'obtiennent pas de réponse.", result: 'Transformez 40% de demandes en plus en rendez-vous confirmés.', icon: '👥' },
    { stat: '2', format: 'min', label: 'Réponse IA', title: 'Assistant IA disponible 24h/24', problem: 'Réponse tardive aux demandes de patients.', result: 'Vos patients reçoivent une réponse en moins de 2 minutes.', icon: '🤖' },
    { stat: '30', format: 'minus', label: 'Absences', title: 'Gestion intelligente des rendez-vous', problem: 'Patients qui oublient leurs rendez-vous.', result: 'Réduction des absences non signalées de 30%.', icon: '📆' },
    { stat: '15', format: 'hour', label: 'Économisées/sem.', title: 'Automatisation administrative complète', problem: 'Heures perdues à rédiger les mêmes documents.', result: "Économisez jusqu'à 15 heures de travail administratif par semaine.", icon: '📋' },
  ]
  return (
    <section ref={sectionRef} id="solutions" className="py-36 px-6" style={{ background: 'rgba(255,255,255,0.008)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">Solutions IA</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            L'automatisation qui <span className="gradient-gold">transforme</span><br />votre pratique
          </h2>
        </div>
        <div className="solutions-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {solutions.map((s, i) => (
            <div key={i} className="solution-card feature-card">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(201,160,85,0.5), transparent)' }} />
              <div className="flex justify-between items-start mb-7">
                <div className="icon-box">{s.icon}</div>
                <div className="text-right">
                  <div className="counter-val font-display font-bold" data-target={s.stat} data-format={s.format}
                    style={{ fontSize: '36px', color: 'var(--teal)', lineHeight: 1, letterSpacing: '-0.02em' }}>—</div>
                  <div style={{ color: '#374151', fontSize: '11px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>{s.label}</div>
                </div>
              </div>
              <h3 className="font-display font-semibold mb-3" style={{ color: '#F0F2F8', fontSize: '18px', lineHeight: 1.3 }}>{s.title}</h3>
              <p className="mb-5" style={{ color: '#374151', fontSize: '13px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>Problème résolu : <span style={{ color: '#6B7280' }}>{s.problem}</span></p>
              <div className="flex items-start gap-3" style={{ background: 'rgba(0,200,150,0.05)', border: '1px solid rgba(0,200,150,0.12)', borderRadius: '12px', padding: '12px 16px' }}>
                <span style={{ color: 'var(--teal)', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>✓</span>
                <span style={{ color: 'rgba(0,200,150,0.85)', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>{s.result}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-14"><a href="#contact" className="btn-gold font-display">Je veux ces solutions →</a></div>
      </div>
    </section>
  )
}

function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.process-step', { opacity: 0, y: 60, stagger: 0.2, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.process-steps', start: 'top 78%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const steps = [
    { num: '01', icon: '🔍', title: 'Consultation gratuite', desc: "Audit de 45 min de votre clinique. Plan d'action concret. Sans engagement.", color: 'var(--gold)' },
    { num: '02', icon: '⚙️', title: 'Mise en œuvre IA', desc: 'Déploiement des automatisations sur mesure pour votre pratique médicale.', color: 'var(--teal)' },
    { num: '03', icon: '📈', title: 'Résultats mesurables', desc: 'KPIs en temps réel. Des améliorations visibles dès la première semaine.', color: 'var(--gold)' },
  ]
  return (
    <section ref={sectionRef} id="processus" className="py-36 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">Processus</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Trois étapes vers<br /><span className="gradient-gold">la transformation</span>
          </h2>
        </div>
        <div className="process-steps grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={i} className="process-step text-center" style={{ background: 'linear-gradient(145deg, rgba(10,13,20,0.9) 0%, rgba(14,18,25,0.6) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '44px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${step.color}, transparent)`, opacity: 0.6 }} />
              <div className="font-display font-bold mx-auto mb-6 flex items-center justify-center" style={{ width: '56px', height: '56px', borderRadius: '50%', background: `linear-gradient(135deg, ${step.color}22, ${step.color}08)`, border: `1px solid ${step.color}40`, color: step.color, fontSize: '16px' }}>{step.num}</div>
              <div style={{ fontSize: '36px', marginBottom: '20px' }}>{step.icon}</div>
              <h3 className="font-display font-semibold mb-4" style={{ color: '#F0F2F8', fontSize: '20px' }}>{step.title}</h3>
              <p style={{ color: '#4B5563', fontSize: '14px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.testimonial-card', { opacity: 0, y: 60, stagger: 0.18, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.testimonials-grid', start: 'top 78%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const testimonials = [
    { quote: "Grâce à jo.productions, j'ai augmenté mes conversions de 40% en 3 mois. Résultats concrets, zéro bullshit.", name: 'Dr. Sophie Dupont', role: 'Gynécologue — Genève', metric: '+40%', metricLabel: 'conversions', since: 'Cliente depuis 2024' },
    { quote: "J'économise 15 heures chaque semaine grâce à l'automatisation de mes suivis. Du temps pour mes patients, enfin.", name: 'Dr. Claire Martin', role: 'Gynécologue — Lausanne', metric: '15h', metricLabel: 'économisées/sem.', since: 'Cliente depuis 2025' },
  ]
  return (
    <section ref={sectionRef} id="temoignages" className="py-36 px-6" style={{ background: 'rgba(255,255,255,0.008)' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">Témoignages</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Ce que disent<br /><span className="gradient-gold">nos clients</span>
          </h2>
        </div>
        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card feature-card">
              <div style={{ fontSize: '100px', lineHeight: 0.75, color: 'rgba(201,160,85,0.1)', fontFamily: 'Georgia, serif', marginBottom: '20px', userSelect: 'none' }}>"</div>
              <p className="mb-8 leading-relaxed" style={{ color: '#C9CDD8', fontSize: '17px', fontStyle: 'italic', fontFamily: 'Inter, sans-serif', lineHeight: 1.75 }}>{t.quote}</p>
              <div className="flex items-end justify-between">
                <div className="flex items-center gap-4">
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(201,160,85,0.25), rgba(201,160,85,0.08))', border: '1px solid rgba(201,160,85,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👩‍⚕️</div>
                  <div>
                    <div className="font-display font-semibold" style={{ color: '#F0F2F8', fontSize: '15px' }}>{t.name}</div>
                    <div style={{ color: '#4B5563', fontSize: '12px', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{t.role}</div>
                    <div style={{ color: '#374151', fontSize: '11px', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{t.since}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold" style={{ color: 'var(--teal)', fontSize: '28px', letterSpacing: '-0.02em' }}>{t.metric}</div>
                  <div style={{ color: '#374151', fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif' }}>{t.metricLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-14"><a href="#contact" className="btn-gold font-display">Je veux des résultats comme ça →</a></div>
      </div>
    </section>
  )
}

function WhySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.why-item', { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.why-list', start: 'top 78%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const reasons = [
    { icon: '🎯', title: 'Attraction de nouveaux patients', desc: 'Présence optimisée + réponses automatiques 24/7 = plus de conversions.' },
    { icon: '⚡', title: 'Gain de temps immédiat', desc: 'Automatisation des processus répétitifs dès la semaine 1.' },
    { icon: '💬', title: 'Satisfaction client maximale', desc: 'Réponse instantanée à toutes les requêtes, 24h/24, 7j/7.' },
    { icon: '📊', title: 'Résultats mesurables', desc: "Dashboard de suivi avec KPIs clairs. Les chiffres parlent d'eux-mêmes." },
    { icon: '🇨🇭', title: 'Expertise locale suisse', desc: "Lausanne & Fribourg. On connaît le marché romand de l'intérieur." },
    { icon: '🚀', title: 'Déploiement en 6 semaines', desc: "Pas de projets qui traînent. On exécute, on mesure, on livre." },
  ]
  return (
    <section ref={sectionRef} className="py-36 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">Avantages</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Pourquoi choisir<br /><span className="gradient-gold">jo.productions ?</span>
          </h2>
          <p className="mt-5 mx-auto" style={{ color: '#4B5563', maxWidth: '440px', fontFamily: 'Inter, sans-serif', fontSize: '16px', lineHeight: 1.7 }}>
            La plupart des agences te vendent de la visibilité. Nous, on te vend des résultats.
          </p>
        </div>
        <div className="why-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div key={i} className="why-item feature-card flex gap-4" style={{ padding: '28px' }}>
              <div className="icon-box" style={{ width: '44px', height: '44px', fontSize: '20px', borderRadius: '12px' }}>{r.icon}</div>
              <div>
                <h3 className="font-display font-semibold mb-2" style={{ color: '#E8EAF0', fontSize: '15px' }}>{r.title}</h3>
                <p style={{ color: '#4B5563', fontSize: '13px', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)
  const faqs = [
    { q: 'Quelle est la durée de la mise en œuvre ?', a: 'La mise en œuvre complète prend entre 4 et 6 semaines. On commence par un audit de votre clinique, puis on déploie les automatisations progressivement.' },
    { q: "Est-ce que je peux essayer les solutions avant de m'engager ?", a: "Oui. On commence toujours par une consultation gratuite de 45 minutes. Vous repartez avec un plan d'action concret, que vous travailliez avec nous ou non." },
    { q: "Comment l'IA améliore-t-elle la conversion des leads ?", a: "L'IA répond aux demandes en moins de 2 minutes, qualifie les patients potentiels, et planifie automatiquement les rendez-vous. Un lead qui reçoit une réponse rapide convertit 40% plus souvent." },
    { q: 'Suis-je formé pour utiliser les nouvelles solutions ?', a: "Oui. Chaque implémentation inclut une session de formation pour vous et votre équipe. L'objectif est que vous soyez complètement autonomes dès la fin du déploiement." },
    { q: "Y a-t-il un service de support après l'implémentation ?", a: 'Absolument. On reste disponibles pour ajuster, optimiser et faire évoluer les automatisations selon vos besoins. Pas de disparition après livraison.' },
  ]
  return (
    <section id="faq" className="py-36 px-6" style={{ background: 'rgba(255,255,255,0.008)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-20 reveal">
          <div className="section-label mb-6">FAQ</div>
          <h2 className="font-display font-bold" style={{ fontSize: 'clamp(34px, 4vw, 60px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.08 }}>
            Questions<br /><span className="gradient-gold">fréquentes</span>
          </h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="w-full flex items-center justify-between py-7 text-left gap-4" onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-display font-medium" style={{ color: open === i ? 'var(--gold)' : '#C9CDD8', fontSize: '16px', transition: 'color 0.25s', lineHeight: 1.4 }}>{faq.q}</span>
                <span style={{ color: 'var(--gold)', fontSize: '22px', flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)', display: 'inline-block', width: '24px', textAlign: 'center' }}>+</span>
              </button>
              <div style={{ maxHeight: open === i ? '200px' : '0', overflow: 'hidden', transition: 'max-height 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}>
                <p style={{ color: '#6B7280', fontSize: '15px', lineHeight: 1.8, fontFamily: 'Inter, sans-serif', paddingBottom: '28px' }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact-form', { opacity: 0, y: 60, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.contact-form', start: 'top 80%' } })
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px',
    padding: '15px 20px', color: '#F0F2F8', fontSize: '15px', outline: 'none',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.25s, box-shadow 0.25s',
  }
  return (
    <section ref={sectionRef} id="contact" className="py-36 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 reveal">
          <div className="section-label mb-6">Commencer</div>
          <h2 className="font-display font-bold mb-5" style={{ fontSize: 'clamp(34px, 4vw, 64px)', color: '#F0F2F8', letterSpacing: '-0.03em', lineHeight: 1.0 }}>
            Prêt à transformer<br /><span className="gradient-gold">votre clinique ?</span>
          </h2>
          <p style={{ color: '#4B5563', fontSize: '16px', fontFamily: 'Inter, sans-serif', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Rejoignez les gynécologues suisses qui ont déjà automatisé leur pratique.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            { num: '1', title: 'Consultation gratuite', desc: 'Évaluation de 45 min sans engagement.' },
            { num: '2', title: 'Solutions sur mesure', desc: 'IA adaptée à votre pratique médicale.' },
            { num: '3', title: 'Résultats en 6 semaines', desc: 'Améliorations mesurables et rapides.' },
          ].map((s, i) => (
            <div key={i} className="text-center" style={{ background: 'rgba(10,13,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '28px 20px' }}>
              <div className="font-display font-bold mx-auto mb-4 flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(201,160,85,0.1)', border: '1px solid rgba(201,160,85,0.25)', color: 'var(--gold)', fontSize: '15px' }}>{s.num}</div>
              <h3 className="font-display font-semibold mb-2" style={{ color: '#E8EAF0', fontSize: '14px' }}>{s.title}</h3>
              <p style={{ color: '#374151', fontSize: '12px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="contact-form" style={{ background: 'linear-gradient(145deg, rgba(10,13,20,0.95) 0%, rgba(14,18,25,0.8) 100%)', border: '1px solid rgba(201,160,85,0.15)', borderRadius: '28px', padding: 'clamp(32px, 5vw, 60px)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { label: 'Nom complet', placeholder: 'Dr. Votre nom', type: 'text' },
              { label: 'Téléphone', placeholder: '+41 XX XXX XX XX', type: 'tel' },
              { label: 'Email professionnel', placeholder: 'votre@email.ch', type: 'email' },
              { label: 'Nom du cabinet', placeholder: 'Cabinet Dr. ...', type: 'text' },
            ].map((field, i) => (
              <div key={i}>
                <label className="block mb-2 font-display" style={{ color: '#4B5563', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>{field.label}</label>
                <input type={field.type} placeholder={field.placeholder} style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'rgba(201,160,85,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,160,85,0.06)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block mb-2 font-display" style={{ color: '#4B5563', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Décrivez votre situation</label>
              <textarea rows={4} placeholder="Quels sont vos défis actuels ? Combien de patients par semaine ? Vos objectifs ?" style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
                onFocus={e => { e.target.style.borderColor = 'rgba(201,160,85,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,160,85,0.06)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; e.target.style.boxShadow = 'none' }} />
            </div>
            <div className="md:col-span-2 text-center pt-2">
              <button type="submit" className="btn-gold font-display" style={{ fontSize: '16px', padding: '17px 52px' }}>Je veux automatiser mon cabinet →</button>
              <p className="mt-4" style={{ color: '#374151', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}>Réponse sous 24h · Consultation gratuite · Sans engagement</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="py-20 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-display font-bold mb-6" style={{ fontSize: 'clamp(30px, 4vw, 52px)', color: '#F0F2F8', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            Votre histoire mérite<br /><span className="gradient-gold">d'être vue.</span>
          </p>
          <a href="#contact" className="btn-gold font-display">Réserver ma démo gratuite →</a>
        </div>
        <div className="separator mb-10" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-display font-bold text-lg" style={{ letterSpacing: '-0.02em' }}>
            <span style={{ color: '#E8EAF0' }}>jo.</span><span style={{ color: 'var(--gold)' }}>productions</span>
          </div>
          <p style={{ color: '#1F2937', fontSize: '13px', fontFamily: 'Inter, sans-serif', textAlign: 'center' }}>© 2026 jo.productions · Solutions IA pour cliniques gynécologiques · Lausanne & Fribourg</p>
          <div className="flex gap-6">
            {[{ label: 'Défis', href: '#problemes' }, { label: 'Solutions', href: '#solutions' }, { label: 'FAQ', href: '#faq' }].map(item => (
              <a key={item.label} href={item.href} style={{ color: '#1F2937', fontSize: '13px', fontFamily: 'Inter, sans-serif', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = '#1F2937')}>{item.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    gsap.utils.toArray<Element>('.reveal').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.globalTimeline.timeScale(100)
    return () => { lenis.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection />
      <div className="separator" />
      <ProblemsSection />
      <div className="separator" />
      <SolutionsSection />
      <div className="separator" />
      <ProcessSection />
      <div className="separator" />
      <TestimonialsSection />
      <div className="separator" />
      <WhySection />
      <div className="separator" />
      <FAQSection />
      <div className="separator" />
      <ContactSection />
      <Footer />
    </div>
  )
}
