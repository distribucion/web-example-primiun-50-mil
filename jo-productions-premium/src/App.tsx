import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// ─── Asset URLs (Higgsfield CDN) ─────────────────────────────────────────────
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_2yxnC38yyLjxAYEPnOB6Vu0j63H'
const A = {
  heroVideo: `${CDN}/hf_20260625_074744_565bfab7-2cf6-49f1-a34d-ec95953979bd.mp4`,
  heroPoster: `${CDN}/hf_20260625_074437_54ea2063-f9dc-48cb-a53f-232706637938.png`,
  flowVideo: `${CDN}/hf_20260625_074806_e8c8e450-9729-47bf-af53-57228f3131b6.mp4`,
  flowPoster: `${CDN}/hf_20260625_074445_124213bf-0773-4f8f-b54b-da22f6fd73ad.png`,
  silkVideo: `${CDN}/hf_20260625_080122_d47d76e7-f40c-4fa0-a2af-c2128d3e3df1.mp4`,
  silkPoster: `${CDN}/hf_20260625_075637_8df7e872-27b1-4963-969f-491a21f516d1.png`,
  drDupont: `${CDN}/hf_20260625_074451_6c5dad1f-a037-4494-ab82-8e0656ae0eb0.png`,
  drMartin: `${CDN}/hf_20260625_074457_c0b389fa-131f-40a3-882e-155d0c4639fd.png`,
  iconPatient: `${CDN}/hf_20260625_074522_6d2fa808-bda7-4ccb-bcde-7bfbc961f409.png`,
  iconClock: `${CDN}/hf_20260625_074527_3c2832ac-c3d9-4b80-9bc9-e333c4f5febe.png`,
  iconCalendar: `${CDN}/hf_20260625_074532_746dfe08-7a21-4923-89a5-e567d2604b21.png`,
  iconChat: `${CDN}/hf_20260625_074537_808e7304-cef7-45ba-94e8-ecf7bb6c870f.png`,
  iconAI: `${CDN}/hf_20260625_074542_6e8244f4-8576-48e5-9546-e8c364663c65.png`,
  iconDocs: `${CDN}/hf_20260625_074557_bce04648-d5ae-4dcb-ba9a-e994f75e03b4.png`,
  iconSearch: `${CDN}/hf_20260625_074603_5991ed1a-4cf5-4713-af26-abb12954dd5c.png`,
  iconGear: `${CDN}/hf_20260625_074607_a725852a-f34e-4a7a-9a36-338f900b884a.png`,
  iconGrowth: `${CDN}/hf_20260625_074612_56fbe41a-bb28-4ccf-96e1-5a84f4349f8e.png`,
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const nav = [
    { label: 'Défis', href: '#defis' },
    { label: 'Solutions', href: '#solutions' },
    { label: 'Méthode', href: '#methode' },
    { label: 'Témoignages', href: '#temoignages' },
    { label: 'FAQ', href: '#faq' },
  ]
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-700" style={{
      background: scrolled ? 'rgba(8,9,12,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(201,160,85,0.1)' : '1px solid transparent',
    }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="#" className="font-serif text-xl" style={{ letterSpacing: '-0.01em', color: 'var(--ivory)' }}>
          jo<span style={{ color: 'var(--gold)' }}>.</span>productions
        </a>
        <div className="hidden md:flex items-center gap-9">
          {nav.map(n => (
            <a key={n.label} href={n.href} className="text-sm transition-colors duration-300"
              style={{ color: 'var(--muted)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.02em' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--ivory)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}>{n.label}</a>
          ))}
        </div>
        <a href="#contact" className="hidden md:inline-flex btn-gold" style={{ padding: '11px 26px', fontSize: '12px' }}>
          Réserver une démo
        </a>
        <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          {[0,1,2].map(i => (
            <span key={i} className="block w-5 h-px transition-all duration-300" style={{
              background: 'var(--ivory)',
              transform: menuOpen ? (i===0?'rotate(45deg) translateY(7px)':i===2?'rotate(-45deg) translateY(-7px)':'') : '',
              opacity: menuOpen && i===1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-8 flex flex-col gap-5" style={{ background: 'rgba(8,9,12,0.98)', borderTop: '1px solid rgba(244,242,237,0.06)' }}>
          {nav.map(n => <a key={n.label} href={n.href} className="text-sm py-1" style={{ color: 'var(--muted)' }} onClick={() => setMenuOpen(false)}>{n.label}</a>)}
          <a href="#contact" className="btn-gold text-center mt-2" onClick={() => setMenuOpen(false)}>Réserver une démo</a>
        </div>
      )}
    </nav>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const badge = useRef<HTMLDivElement>(null)
  const h1 = useRef<HTMLHeadingElement>(null)
  const sub = useRef<HTMLParagraphElement>(null)
  const cta = useRef<HTMLDivElement>(null)
  const stats = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.3 })
    tl.from(badge.current, { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out' })
      .from(h1.current?.querySelectorAll('.line') ? Array.from(h1.current.querySelectorAll('.line')) : [], { opacity: 0, y: 60, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, '-=0.3')
      .from(sub.current, { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.6')
      .from(cta.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .from(stats.current?.children ? Array.from(stats.current.children) : [], { opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
    // subtle parallax on video
    gsap.to(video.current, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
  }, [])
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video ref={video} className="absolute inset-0 w-full h-full object-cover" style={{ height: '120%' }}
          autoPlay muted loop playsInline poster={A.heroPoster}>
          <source src={A.heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,9,12,0.55), rgba(8,9,12,0.35) 35%, rgba(8,9,12,0.75) 75%, rgba(8,9,12,1))' }} />
        <div className="absolute inset-0 vignette" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div ref={badge} className="inline-flex mb-10">
          <span className="eyebrow">Intelligence artificielle · Gynécologie · Suisse</span>
        </div>
        <h1 ref={h1} className="font-serif mb-8" style={{ fontSize: 'clamp(46px, 8vw, 104px)', lineHeight: 0.98, letterSpacing: '-0.02em', color: 'var(--ivory)', fontWeight: 400 }}>
          <span className="line block">Votre patientèle</span>
          <span className="line block">mérite <span className="accent-italic gold-text">d'être vue.</span></span>
        </h1>
        <p ref={sub} className="font-sans mx-auto mb-12" style={{ maxWidth: '500px', color: 'var(--muted)', fontSize: '18px', lineHeight: 1.75 }}>
          On automatise votre clinique avec l'IA : plus de rendez-vous, moins d'absences, zéro charge administrative.
          <span style={{ color: 'var(--ivory)' }}> Résultats mesurables en 6 semaines.</span>
        </p>
        <div ref={cta} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <a href="#contact" className="btn-gold">Réserver une démo gratuite</a>
          <a href="#solutions" className="btn-ghost">Découvrir la méthode</a>
        </div>
        <div ref={stats} className="flex flex-wrap gap-x-12 gap-y-6 justify-center">
          {[
            { v: '+40%', l: 'de rendez-vous' },
            { v: '< 2 min', l: 'de réponse' },
            { v: '−30%', l: "d'absences" },
            { v: '15h', l: 'économisées / sem.' },
          ].map(s => (
            <div key={s.v} className="text-center">
              <div className="font-serif gold-text" style={{ fontSize: '32px', lineHeight: 1, letterSpacing: '-0.02em' }}>{s.v}</div>
              <div className="font-sans mt-1.5" style={{ color: 'var(--muted-dim)', fontSize: '12px', letterSpacing: '0.04em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        style={{ color: 'var(--muted-dim)', fontSize: '10px', letterSpacing: '0.25em', fontFamily: 'Inter, sans-serif' }}>
        <span>DÉFILER</span>
        <div style={{ width: '1px', height: '46px', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
      </div>
    </section>
  )
}

// ─── Section heading helper ──────────────────────────────────────────────────
function Heading({ eyebrow, children, sub }: { eyebrow: string; children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-20 reveal">
      <div className="mb-7 flex justify-center"><span className="eyebrow">{eyebrow}</span></div>
      <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 4.5vw, 68px)', color: 'var(--ivory)', letterSpacing: '-0.02em', lineHeight: 1.05, fontWeight: 400 }}>
        {children}
      </h2>
      {sub && <p className="font-sans mt-6 mx-auto" style={{ color: 'var(--muted)', maxWidth: '480px', fontSize: '16px', lineHeight: 1.7 }}>{sub}</p>}
    </div>
  )
}

// ─── Problems ────────────────────────────────────────────────────────────────
function Problems() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.p-card', { opacity: 0, y: 60, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.p-grid', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const items = [
    { icon: A.iconPatient, text: 'Des patientes vous contactent mais ne reçoivent pas de réponse à temps ?', sol: 'Notre IA répond automatiquement en moins de 2 minutes, 24h/24.' },
    { icon: A.iconClock, text: 'Vous passez trop de temps en administratif au lieu de soigner ?', sol: "Automatisez les tâches répétitives et gagnez jusqu'à 15 h / semaine." },
    { icon: A.iconCalendar, text: 'Des patientes oublient leurs rendez-vous et ne se présentent pas ?', sol: 'Notre rappel intelligent réduit les absences de 30 %.' },
    { icon: A.iconChat, text: 'Difficile de répondre rapidement à toutes les demandes du cabinet ?', sol: 'Un assistant IA dédié gère les demandes entrantes en temps réel.' },
  ]
  return (
    <section ref={ref} id="defis" className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        <Heading eyebrow="Diagnostic" sub="La plupart des cabinets perdent près d'un tiers de leur potentiel, faute d'automatisation.">
          Reconnaissez-vous <span className="accent-italic gold-text">ces défis</span> ?
        </Heading>
        <div className="p-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((p, i) => (
            <div key={i} className="p-card ed-card flex flex-col">
              <img src={p.icon} alt="" className="gold-icon mb-7" />
              <p className="font-sans mb-6" style={{ color: 'var(--text)', fontSize: '17px', lineHeight: 1.55 }}>{p.text}</p>
              <div className="flex items-start gap-3 mt-auto pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--gold)', fontSize: '14px', marginTop: '2px' }}>✦</span>
                <span className="font-sans" style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: 1.5 }}>{p.sol}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16"><a href="#contact" className="btn-ghost">Résoudre ces défis</a></div>
      </div>
    </section>
  )
}

// ─── Solutions (with counters) ───────────────────────────────────────────────
function Solutions() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.s-card', { opacity: 0, y: 60, stagger: 0.12, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.s-grid', start: 'top 80%' } })
      gsap.utils.toArray<HTMLElement>('.cnt').forEach(el => {
        const t = parseFloat(el.dataset.target || '0'); const f = el.dataset.format
        gsap.from({ v: 0 }, { v: t, duration: 2.2, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: function () { const v = Math.round(this.targets()[0].v)
            el.textContent = f==='percent'?`+${v}%`:f==='min'?`${v} min`:f==='hour'?`${v}h`:f==='minus'?`−${v}%`:String(v) } })
      })
    }, ref)
    return () => ctx.revert()
  }, [])
  const items = [
    { stat:'40', format:'percent', label:'Rendez-vous', icon:A.iconPatient, title:'Suivi automatique des nouvelles patientes', result:'Transformez 40 % de demandes en plus en rendez-vous confirmés.' },
    { stat:'2', format:'min', label:'Réponse IA', icon:A.iconAI, title:'Assistant IA disponible 24h/24', result:'Vos patientes reçoivent une réponse en moins de 2 minutes.' },
    { stat:'30', format:'minus', label:'Absences', icon:A.iconCalendar, title:'Gestion intelligente des rendez-vous', result:'Réduction des absences non signalées de 30 %.' },
    { stat:'15', format:'hour', label:'Par semaine', icon:A.iconDocs, title:'Automatisation administrative complète', result:"Jusqu'à 15 heures de travail administratif économisées." },
  ]
  return (
    <section ref={ref} id="solutions" className="py-32 md:py-40 px-6" style={{ background: 'var(--bg-soft)' }}>
      <div className="max-w-6xl mx-auto">
        <Heading eyebrow="Solutions IA">
          L'automatisation qui <span className="accent-italic gold-text">transforme</span><br />votre pratique
        </Heading>
        <div className="s-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((s, i) => (
            <div key={i} className="s-card ed-card">
              <div className="flex justify-between items-start mb-8">
                <img src={s.icon} alt="" className="gold-icon" />
                <div className="text-right">
                  <div className="cnt font-serif gold-text" data-target={s.stat} data-format={s.format} style={{ fontSize: '40px', lineHeight: 1, letterSpacing: '-0.02em' }}>—</div>
                  <div className="font-sans mt-1" style={{ color: 'var(--muted-dim)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              </div>
              <h3 className="font-serif mb-4" style={{ color: 'var(--ivory)', fontSize: '22px', lineHeight: 1.25, fontWeight: 400 }}>{s.title}</h3>
              <p className="font-sans" style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.6 }}>{s.result}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-16"><a href="#contact" className="btn-gold">Je veux ces solutions</a></div>
      </div>
    </section>
  )
}

// ─── Scroll-scrub video showcase ─────────────────────────────────────────────
function VideoShowcase({ video: src, poster, eyebrow, title, body }: { video: string; poster: string; eyebrow: string; title: React.ReactNode; body: string }) {
  const section = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const text = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const v = video.current!
    const ctx = gsap.context(() => {
      let st: ScrollTrigger
      const setup = () => {
        const dur = v.duration || 15
        st = ScrollTrigger.create({
          trigger: section.current, start: 'top top', end: '+=200%', pin: true, scrub: 1,
          onUpdate: self => { if (!isNaN(dur)) v.currentTime = dur * self.progress },
        })
      }
      if (v.readyState >= 1) setup()
      else v.addEventListener('loadedmetadata', setup, { once: true })
      gsap.from(text.current, { opacity: 0, y: 40, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: section.current, start: 'top 70%' } })
      return () => { st?.kill() }
    }, section)
    return () => ctx.revert()
  }, [])
  return (
    <section ref={section} className="relative h-screen overflow-hidden flex items-center justify-center">
      <video ref={video} className="absolute inset-0 w-full h-full object-cover" muted playsInline preload="auto" poster={poster}>
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(8,9,12,0.3), rgba(8,9,12,0.8))' }} />
      <div ref={text} className="relative z-10 text-center px-6 max-w-3xl">
        <div className="mb-7 flex justify-center"><span className="eyebrow">{eyebrow}</span></div>
        <h2 className="font-serif" style={{ fontSize: 'clamp(36px, 5.5vw, 80px)', color: 'var(--ivory)', lineHeight: 1.04, letterSpacing: '-0.02em', fontWeight: 400 }}>
          {title}
        </h2>
        <p className="font-sans mx-auto mt-7" style={{ maxWidth: '440px', color: 'var(--text)', fontSize: '17px', lineHeight: 1.7 }}>
          {body}
        </p>
      </div>
    </section>
  )
}

// ─── Method ──────────────────────────────────────────────────────────────────
function Method() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.m-step', { opacity: 0, y: 50, stagger: 0.2, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.m-steps', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const steps = [
    { num:'01', icon:A.iconSearch, title:'Consultation gratuite', desc:"Audit de 45 minutes de votre clinique. Plan d'action concret. Sans engagement." },
    { num:'02', icon:A.iconGear, title:'Mise en œuvre', desc:'Déploiement des automatisations IA, sur mesure pour votre pratique médicale.' },
    { num:'03', icon:A.iconGrowth, title:'Résultats mesurables', desc:'Tableau de bord en temps réel. Des améliorations visibles dès la première semaine.' },
  ]
  return (
    <section ref={ref} id="methode" className="py-32 md:py-40 px-6">
      <div className="max-w-5xl mx-auto">
        <Heading eyebrow="La méthode">
          Trois étapes vers<br /><span className="accent-italic gold-text">la transformation</span>
        </Heading>
        <div className="m-steps grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={i} className="m-step ed-card text-center" style={{ padding: '48px 32px' }}>
              <div className="font-serif mb-7" style={{ color: 'var(--muted-dim)', fontSize: '13px', letterSpacing: '0.2em' }}>{s.num}</div>
              <img src={s.icon} alt="" className="gold-icon mx-auto mb-7" style={{ width: '64px', height: '64px' }} />
              <h3 className="font-serif mb-4" style={{ color: 'var(--ivory)', fontSize: '23px', fontWeight: 400 }}>{s.title}</h3>
              <p className="font-sans" style={{ color: 'var(--muted)', fontSize: '15px', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.t-card', { opacity: 0, y: 50, stagger: 0.18, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.t-grid', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const items = [
    { quote: "Grâce à jo.productions, j'ai augmenté mes conversions de 40 % en trois mois. Des résultats concrets, sans bullshit.", name:'Dr. Sophie Dupont', role:'Gynécologue — Genève', photo:A.drDupont, metric:'+40%', metricLabel:'conversions' },
    { quote: "J'économise quinze heures chaque semaine grâce à l'automatisation de mes suivis. Enfin du temps pour mes patientes.", name:'Dr. Claire Martin', role:'Gynécologue — Lausanne', photo:A.drMartin, metric:'15h', metricLabel:'par semaine' },
  ]
  return (
    <section ref={ref} id="temoignages" className="py-32 md:py-40 px-6" style={{ background: 'var(--bg-soft)' }}>
      <div className="max-w-5xl mx-auto">
        <Heading eyebrow="Témoignages">Ce que disent <span className="accent-italic gold-text">nos clientes</span></Heading>
        <div className="t-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((t, i) => (
            <div key={i} className="t-card ed-card flex flex-col" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="relative" style={{ aspectRatio: '4/3', overflow: 'hidden' }}>
                <img src={t.photo} alt={t.name} className="w-full h-full object-cover" style={{ objectPosition: 'center 25%' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(14,17,23,1), rgba(14,17,23,0.1) 60%)' }} />
                <div className="absolute bottom-4 right-5 text-right">
                  <div className="font-serif gold-text" style={{ fontSize: '30px', lineHeight: 1 }}>{t.metric}</div>
                  <div className="font-sans" style={{ color: 'var(--muted)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.metricLabel}</div>
                </div>
              </div>
              <div style={{ padding: '32px 40px 40px' }}>
                <p className="font-serif accent-italic mb-7" style={{ color: 'var(--text)', fontSize: '20px', lineHeight: 1.5 }}>"{t.quote}"</p>
                <div>
                  <div className="font-sans" style={{ color: 'var(--ivory)', fontSize: '15px', fontWeight: 500 }}>{t.name}</div>
                  <div className="font-sans mt-0.5" style={{ color: 'var(--muted-dim)', fontSize: '13px' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16"><a href="#contact" className="btn-gold">Je veux ces résultats</a></div>
      </div>
    </section>
  )
}

// ─── Why ─────────────────────────────────────────────────────────────────────
function Why() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.w-item', { opacity: 0, y: 40, stagger: 0.1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.w-list', start: 'top 80%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const reasons = [
    { icon:A.iconPatient, title:'Attraction de nouvelles patientes', desc:'Présence optimisée et réponses automatiques 24/7.' },
    { icon:A.iconClock, title:'Gain de temps immédiat', desc:'Automatisation des processus répétitifs dès la semaine 1.' },
    { icon:A.iconChat, title:'Satisfaction maximale', desc:'Réponse instantanée à chaque requête, 24h/24, 7j/7.' },
    { icon:A.iconGrowth, title:'Résultats mesurables', desc:"Des KPIs clairs. Les chiffres parlent d'eux-mêmes." },
    { icon:A.iconAI, title:'Technologie de pointe', desc:'Les meilleurs modèles IA, au service de votre clinique.' },
    { icon:A.iconGear, title:'Déploiement en 6 semaines', desc:'On exécute, on mesure, on livre. Pas de projets qui traînent.' },
  ]
  return (
    <section ref={ref} className="py-32 md:py-40 px-6">
      <div className="max-w-6xl mx-auto">
        <Heading eyebrow="Pourquoi nous" sub="La plupart des agences vendent de la visibilité. Nous, on vend des résultats.">
          Pourquoi <span className="accent-italic gold-text">jo.productions</span> ?
        </Heading>
        <div className="w-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r, i) => (
            <div key={i} className="w-item ed-card flex gap-5" style={{ padding: '28px' }}>
              <img src={r.icon} alt="" style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0, filter: 'drop-shadow(0 3px 10px rgba(201,160,85,0.2))' }} />
              <div>
                <h3 className="font-serif mb-2" style={{ color: 'var(--ivory)', fontSize: '17px', fontWeight: 400 }}>{r.title}</h3>
                <p className="font-sans" style={{ color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.6 }}>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const faqs = [
    { q: 'Quelle est la durée de la mise en œuvre ?', a: "La mise en œuvre complète prend entre 4 et 6 semaines. On commence par un audit de votre clinique, puis on déploie les automatisations progressivement." },
    { q: "Puis-je essayer avant de m'engager ?", a: "Oui. On commence toujours par une consultation gratuite de 45 minutes. Vous repartez avec un plan d'action concret, que vous travailliez avec nous ou non." },
    { q: "Comment l'IA améliore-t-elle la conversion ?", a: "L'IA répond en moins de 2 minutes, qualifie les patientes et planifie automatiquement les rendez-vous. Une réponse rapide convertit 40 % plus souvent." },
    { q: 'Suis-je formé pour utiliser les solutions ?', a: "Oui. Chaque implémentation inclut une formation pour vous et votre équipe, afin que vous soyez complètement autonomes." },
    { q: "Y a-t-il un support après l'implémentation ?", a: 'Absolument. On reste disponibles pour ajuster et faire évoluer les automatisations. Pas de disparition après livraison.' },
  ]
  return (
    <section id="faq" className="py-32 md:py-40 px-6" style={{ background: 'var(--bg-soft)' }}>
      <div className="max-w-3xl mx-auto">
        <Heading eyebrow="Questions">Questions <span className="accent-italic gold-text">fréquentes</span></Heading>
        <div>
          {faqs.map((f, i) => (
            <div key={i} className="faq-item">
              <button className="w-full flex items-center justify-between py-7 text-left gap-6" onClick={() => setOpen(open===i?null:i)}>
                <span className="font-serif" style={{ color: open===i?'var(--gold)':'var(--ivory)', fontSize: '20px', transition: 'color 0.3s', lineHeight: 1.3, fontWeight: 400 }}>{f.q}</span>
                <span style={{ color: 'var(--gold)', fontSize: '22px', flexShrink: 0, transform: open===i?'rotate(45deg)':'rotate(0)', transition: 'transform 0.4s cubic-bezier(0.23,1,0.32,1)', display: 'inline-block' }}>+</span>
              </button>
              <div style={{ maxHeight: open===i?'220px':'0', overflow: 'hidden', transition: 'max-height 0.5s cubic-bezier(0.23,1,0.32,1)' }}>
                <p className="font-sans" style={{ color: 'var(--muted)', fontSize: '15.5px', lineHeight: 1.8, paddingBottom: '30px' }}>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Contact ─────────────────────────────────────────────────────────────────
function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.c-form', { opacity: 0, y: 50, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.c-form', start: 'top 82%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  const inp: React.CSSProperties = { width: '100%', background: 'rgba(244,242,237,0.03)', border: '1px solid rgba(244,242,237,0.08)', borderRadius: '2px', padding: '16px 20px', color: 'var(--ivory)', fontSize: '15px', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.3s' }
  const fields = [
    { l:'Nom complet', p:'Dr. Votre nom', t:'text' },
    { l:'Téléphone', p:'+41 XX XXX XX XX', t:'tel' },
    { l:'Email professionnel', p:'votre@email.ch', t:'email' },
    { l:'Nom du cabinet', p:'Cabinet Dr. ...', t:'text' },
  ]
  return (
    <section ref={ref} id="contact" className="py-32 md:py-40 px-6">
      <div className="max-w-3xl mx-auto">
        <Heading eyebrow="Commencer" sub="Rejoignez les gynécologues suisses qui ont déjà automatisé leur pratique.">
          Prêt à transformer<br /><span className="accent-italic gold-text">votre clinique ?</span>
        </Heading>
        <div className="c-form ed-card" style={{ padding: 'clamp(32px, 5vw, 56px)' }}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fields.map((f, i) => (
              <div key={i}>
                <label className="font-sans block mb-2.5" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{f.l}</label>
                <input type={f.t} placeholder={f.p} style={inp}
                  onFocus={e => (e.target.style.borderColor = 'rgba(201,160,85,0.45)')}
                  onBlur={e => (e.target.style.borderColor = 'rgba(244,242,237,0.08)')} />
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="font-sans block mb-2.5" style={{ color: 'var(--muted)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Votre situation</label>
              <textarea rows={4} placeholder="Vos défis actuels, le volume de patientes, vos objectifs..." style={{ ...inp, resize: 'vertical' } as React.CSSProperties}
                onFocus={e => (e.target.style.borderColor = 'rgba(201,160,85,0.45)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(244,242,237,0.08)')} />
            </div>
            <div className="md:col-span-2 text-center pt-3">
              <button type="submit" className="btn-gold" style={{ padding: '17px 50px' }}>Automatiser mon cabinet</button>
              <p className="font-sans mt-5" style={{ color: 'var(--muted-dim)', fontSize: '12px' }}>Réponse sous 24 h · Consultation gratuite · Sans engagement</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="pt-28 pb-16 px-6" style={{ borderTop: '1px solid rgba(244,242,237,0.05)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <p className="font-serif mb-8" style={{ fontSize: 'clamp(32px, 4.5vw, 60px)', color: 'var(--ivory)', letterSpacing: '-0.02em', lineHeight: 1.1, fontWeight: 400 }}>
            Votre histoire mérite<br /><span className="accent-italic gold-text">d'être vue.</span>
          </p>
          <a href="#contact" className="btn-gold">Réserver ma démo gratuite</a>
        </div>
        <div className="hairline mb-12" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="font-serif text-lg" style={{ color: 'var(--ivory)' }}>jo<span style={{ color: 'var(--gold)' }}>.</span>productions</div>
          <p className="font-sans text-center" style={{ color: 'var(--muted-dim)', fontSize: '12.5px' }}>© 2026 jo.productions · Solutions IA pour cliniques gynécologiques · Lausanne &amp; Fribourg</p>
          <div className="flex gap-7">
            {[{l:'Défis',h:'#defis'},{l:'Solutions',h:'#solutions'},{l:'FAQ',h:'#faq'}].map(x => (
              <a key={x.l} href={x.h} className="font-sans" style={{ color: 'var(--muted-dim)', fontSize: '13px', transition: 'color 0.3s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted-dim)')}>{x.l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time: number) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    gsap.utils.toArray<Element>('.reveal').forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
    })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.globalTimeline.timeScale(100)
    return () => { lenis.destroy(); ScrollTrigger.getAll().forEach(t => t.kill()) }
  }, [])
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Navbar />
      <Hero />
      <Problems />
      <Solutions />
      <VideoShowcase
        video={A.flowVideo}
        poster={A.flowPoster}
        eyebrow="L'intelligence en mouvement"
        title={<>Chaque interaction,<br /><span className="accent-italic gold-text">orchestrée par l'IA.</span></>}
        body="De la première prise de contact au suivi post-consultation, votre clinique fonctionne en silence — et sans relâche."
      />
      <Method />
      <Testimonials />
      <Why />
      <VideoShowcase
        video={A.silkVideo}
        poster={A.silkPoster}
        eyebrow="Le temps retrouvé"
        title={<>Reprenez le temps<br /><span className="accent-italic gold-text">qui vous appartient.</span></>}
        body="Pendant que l'IA gère l'administratif, vous vous consacrez à l'essentiel : vos patientes."
      />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  )
}
