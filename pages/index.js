import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [tick, setTick] = useState(0)
  const canvasRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 40)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    const basePoints = [0.88, 0.82, 0.86, 0.75, 0.80, 0.65, 0.72, 0.55, 0.60, 0.42, 0.50, 0.35, 0.45, 0.28, 0.38, 0.20, 0.30, 0.15, 0.22, 0.10]
    const n = basePoints.length

    ctx.clearRect(0, 0, W, H)

    const pts = basePoints.map((y, i) => ({
      x: (i / (n - 1)) * W,
      y: y * H + Math.sin(tick * 0.04 + i * 0.7) * 3
    }))

    // Fill
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i-1].x + pts[i].x) / 2
      ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y)
    }
    ctx.lineTo(W, H)
    ctx.lineTo(0, H)
    ctx.closePath()
    const grad = ctx.createLinearGradient(0, 0, 0, H)
    grad.addColorStop(0, 'rgba(192,57,43,0.18)')
    grad.addColorStop(1, 'rgba(192,57,43,0)')
    ctx.fillStyle = grad
    ctx.fill()

    // Line
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      const cpx = (pts[i-1].x + pts[i].x) / 2
      ctx.bezierCurveTo(cpx, pts[i-1].y, cpx, pts[i].y, pts[i].x, pts[i].y)
    }
    ctx.strokeStyle = 'rgba(192,57,43,0.7)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Dot at end
    const last = pts[pts.length - 1]
    ctx.beginPath()
    ctx.arc(last.x, last.y, 4, 0, Math.PI * 2)
    ctx.fillStyle = '#c0392b'
    ctx.fill()

    // Pulse ring
    const pulse = (Math.sin(tick * 0.08) + 1) / 2
    ctx.beginPath()
    ctx.arc(last.x, last.y, 4 + pulse * 10, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(192,57,43,${0.4 - pulse * 0.4})`
    ctx.lineWidth = 1
    ctx.stroke()

  }, [tick])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email || status === 'loading') return
    setStatus('loading')
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else if (res.status === 409) {
        setStatus('duplicate')
        setMessage("You're already on the list.")
      } else {
        setStatus('error')
        setMessage('Something went wrong. Try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <>
      <Head>
        <title>SimProfit – Early Access</title>
        <meta name="description" content="A 3D first-person business sim where bad decisions don't reset." />
        <meta property="og:title" content="SimProfit – Bad decisions don't reset." />
        <meta property="og:description" content="3D business sim. Permanent consequences. No safety net." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow-x: hidden; }

        body {
          background: #060606;
          color: #f0ede8;
          font-family: 'Space Mono', 'Courier New', monospace;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        /* Scanline overlay */
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 100;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* TOP BAR */
        .topbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          padding: 1.25rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 50;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          background: rgba(6,6,6,0.85);
          backdrop-filter: blur(12px);
        }

        .logo {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 1.1rem;
          letter-spacing: 0.2em;
          color: #f0ede8;
        }

        .logo span { color: #c0392b; }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .topbar-link {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #444;
          text-decoration: none;
          text-transform: uppercase;
          transition: color 0.2s;
        }

        .topbar-link:hover { color: #c0392b; }

        .status-dot {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          letter-spacing: 0.15em;
          color: #444;
          text-transform: uppercase;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c0392b;
          animation: pulse-dot 2s ease-in-out infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        /* HERO */
        .hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 10rem 2rem 6rem;
          position: relative;
        }

        /* Grid lines bg */
        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none;
        }

        /* Vignette */
        .vignette {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at center, transparent 40%, #060606 100%);
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 780px;
          width: 100%;
        }

        .tag {
          font-size: 9px;
          letter-spacing: 0.25em;
          color: #c0392b;
          border: 1px solid rgba(192,57,43,0.4);
          padding: 7px 18px;
          margin-bottom: 3rem;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          animation: fadeUp 0.6s ease both;
          background: rgba(192,57,43,0.05);
        }

        .tag::before {
          content: '';
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #c0392b;
          animation: pulse-dot 1.5s infinite;
        }

        h1 {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: clamp(5.5rem, 16vw, 11rem);
          font-weight: 400;
          line-height: 0.88;
          letter-spacing: 0.03em;
          margin-bottom: 2.5rem;
          animation: fadeUp 0.6s 0.08s ease both;
        }

        h1 .red { color: #c0392b; }

        .sub {
          font-size: 11px;
          color: #555;
          line-height: 2;
          max-width: 380px;
          margin-bottom: 3.5rem;
          letter-spacing: 0.06em;
          animation: fadeUp 0.6s 0.16s ease both;
        }

        /* FORM */
        .form-wrap {
          width: 100%;
          max-width: 460px;
          animation: fadeUp 0.6s 0.24s ease both;
        }

        .form-row {
          display: flex;
          width: 100%;
          border: 1px solid #1e1e1e;
          background: #0c0c0c;
          transition: border-color 0.2s;
        }

        .form-row:focus-within {
          border-color: rgba(192,57,43,0.5);
        }

        .form-row input[type="email"] {
          flex: 1;
          background: transparent;
          border: none;
          color: #f0ede8;
          padding: 15px 18px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          outline: none;
          min-width: 0;
          letter-spacing: 0.04em;
        }

        .form-row input[type="email"]::placeholder { color: #2a2a2a; }

        .form-row button {
          background: #c0392b;
          color: #fff;
          border: none;
          padding: 15px 26px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s, letter-spacing 0.2s;
          text-transform: uppercase;
          position: relative;
          overflow: hidden;
        }

        .form-row button::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0);
          transition: background 0.15s;
        }

        .form-row button:hover { background: #a93226; letter-spacing: 0.18em; }
        .form-row button:active { background: #922b21; }
        .form-row button:disabled { opacity: 0.4; cursor: not-allowed; letter-spacing: 0.14em; }

        .form-msg {
          padding-top: 10px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-align: left;
          min-height: 22px;
          padding-left: 1px;
        }

        .form-msg.success { color: #27ae60; }
        .form-msg.error   { color: #c0392b; }
        .form-msg.dup     { color: #555; }

        /* STATS */
        .stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 4rem;
          border: 1px solid #141414;
          width: 100%;
          max-width: 520px;
          animation: fadeUp 0.6s 0.32s ease both;
        }

        .stat {
          padding: 14px 0;
          border-right: 1px solid #141414;
          text-align: center;
        }

        .stat:last-child { border-right: none; }

        .stat-label {
          font-size: 8px;
          color: #333;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .stat-value {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.05em;
          color: #888;
        }

        /* CHART SECTION */
        .chart-section {
          width: 100%;
          padding: 0 2rem;
          position: relative;
          margin-top: auto;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 0 0.75rem 0;
          border-bottom: 1px solid #111;
          margin-bottom: 0;
        }

        .chart-label {
          font-size: 9px;
          letter-spacing: 0.18em;
          color: #2a2a2a;
          text-transform: uppercase;
        }

        .chart-value {
          font-family: 'Bebas Neue', Impact, sans-serif;
          font-size: 1rem;
          color: #c0392b;
          letter-spacing: 0.1em;
        }

        canvas {
          display: block;
          width: 100%;
          height: 140px;
        }

        /* FOOTER */
        footer {
          padding: 1rem 2.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #0e0e0e;
        }

        .ft {
          font-size: 9px;
          color: #222;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .ft a {
          color: #2a2a2a;
          text-decoration: none;
          transition: color 0.2s;
        }

        .ft a:hover { color: #c0392b; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 560px) {
          .topbar { padding: 1rem 1.5rem; }
          .topbar-right { gap: 1rem; }
          h1 { font-size: 5rem; }
          .stats { grid-template-columns: repeat(2, 1fr); }
          .stat:nth-child(2) { border-right: none; }
          .stat:nth-child(3) { border-top: 1px solid #141414; }
          .stat:nth-child(4) { border-top: 1px solid #141414; }
          .form-row { flex-direction: column; }
          .form-row button { padding: 14px; }
          .chart-section { padding: 0 1rem; }
          footer { padding: 1rem 1.5rem; }
        }
      `}</style>

      <div className="page">
        <nav className="topbar">
          <div className="logo">SIM<span>PROFIT</span></div>
          <div className="topbar-right">
            <div className="status-dot">
              <div className="dot" />
              In Development
            </div>
            <a className="topbar-link" href="https://x.com/JakobBuilds" target="_blank" rel="noopener noreferrer">
              @JakobBuilds
            </a>
          </div>
        </nav>

        <main className="hero">
          <div className="grid-bg" aria-hidden="true" />
          <div className="vignette" aria-hidden="true" />

          <div className="content">
            <div className="tag">Early Access — Waitlist Open</div>

            <h1>
              BAD<br />
              DECISIONS<br />
              DON&apos;T <span className="red">RESET.</span>
            </h1>

            <p className="sub">
              SimProfit is a 3D first-person business sim where every
              wrong call has permanent consequences. No reloading.
              No restarting. Built solo. From scratch.
            </p>

            <div className="form-wrap">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={status === 'loading' || status === 'success'}
                    required
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                  >
                    {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined ✓' : 'Join Waitlist'}
                  </button>
                </div>
                <div className={`form-msg ${status === 'success' ? 'success' : status === 'error' ? 'error' : 'dup'}`}>
                  {status === 'success' && '→ You\'re in. Updates incoming.'}
                  {(status === 'error' || status === 'duplicate') && message}
                </div>
              </form>
            </div>

            <div className="stats">
              <div className="stat">
                <div className="stat-label">Team size</div>
                <div className="stat-value">1</div>
              </div>
              <div className="stat">
                <div className="stat-label">Dev age</div>
                <div className="stat-value">16</div>
              </div>
              <div className="stat">
                <div className="stat-label">Platform</div>
                <div className="stat-value">Steam</div>
              </div>
              <div className="stat">
                <div className="stat-label">Resets</div>
                <div className="stat-value" style={{color:'#c0392b'}}>0</div>
              </div>
            </div>
          </div>
        </main>

        <div className="chart-section">
          <div className="chart-header">
            <span className="chart-label">Cashflow / Business Health</span>
            <span className="chart-value">LIVE</span>
          </div>
          <canvas ref={canvasRef} width={1400} height={140} aria-hidden="true" />
        </div>

        <footer>
          <div className="ft">Capital Loop Studios © 2025</div>
          <div className="ft">
            <a href="https://capitalloopstudios.framer.website" target="_blank" rel="noopener noreferrer">
              capitalloopstudios.com
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
