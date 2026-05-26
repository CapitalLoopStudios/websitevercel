import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error | duplicate
  const [message, setMessage] = useState('')

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

      const data = await res.json()

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
        <meta name="description" content="A 3D first-person business sim where bad decisions don't reset. No reloading. No restarting. Join the waitlist." />
        <meta property="og:title" content="SimProfit – Bad decisions don't reset." />
        <meta property="og:description" content="3D business sim. Permanent consequences. No safety net." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap" rel="stylesheet" />
      </Head>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { font-size: 16px; }
        body {
          background: #080808;
          color: #f0ede8;
          font-family: 'Syne', sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 4rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .chart-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 180px;
          pointer-events: none;
        }

        .noise {
          position: fixed;
          inset: 0;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 640px;
          width: 100%;
        }

        .tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: #c0392b;
          border: 0.5px solid #c0392b;
          padding: 5px 14px;
          border-radius: 2px;
          margin-bottom: 2rem;
          display: inline-block;
          animation: fadeUp 0.6s ease both;
        }

        h1 {
          font-size: clamp(2.4rem, 6vw, 4rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 1.25rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        h1 .red { color: #c0392b; }

        .sub {
          font-size: 15px;
          color: #777;
          line-height: 1.75;
          max-width: 400px;
          margin-bottom: 2.5rem;
          font-weight: 400;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .form-wrap {
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .form-row {
          display: flex;
          gap: 8px;
          width: 100%;
        }

        .form-row input[type="email"] {
          flex: 1;
          background: #111;
          border: 0.5px solid #2a2a2a;
          color: #f0ede8;
          padding: 12px 16px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          border-radius: 3px;
          outline: none;
          transition: border-color 0.2s;
          min-width: 0;
        }

        .form-row input[type="email"]::placeholder { color: #444; }
        .form-row input[type="email"]:focus { border-color: #c0392b; }

        .form-row button {
          background: #c0392b;
          color: #fff;
          border: none;
          padding: 12px 22px;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.04em;
          border-radius: 3px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.1s;
          flex-shrink: 0;
        }

        .form-row button:hover { background: #a93226; }
        .form-row button:active { transform: scale(0.98); }
        .form-row button:disabled { opacity: 0.5; cursor: not-allowed; }

        .form-msg {
          margin-top: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          text-align: left;
          min-height: 18px;
        }

        .form-msg.success { color: #27ae60; }
        .form-msg.error   { color: #c0392b; }
        .form-msg.dup     { color: #888; }

        .badges {
          display: flex;
          gap: 1.5rem;
          margin-top: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.6s 0.4s ease both;
        }

        .badge {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #444;
          letter-spacing: 0.05em;
        }

        .badge span { color: #f0ede8; }

        .divider {
          width: 1px;
          height: 14px;
          background: #222;
          align-self: center;
        }

        footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 0.5px solid #161616;
          background: #080808;
          z-index: 10;
        }

        .ft {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #333;
          letter-spacing: 0.1em;
        }

        .ft a {
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
        }

        .ft a:hover { color: #c0392b; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .form-row { flex-direction: column; }
          .form-row button { width: 100%; }
          .badges { gap: 1rem; }
          .divider { display: none; }
          footer { position: static; margin-top: 3rem; }
        }
      `}</style>

      <div className="noise" aria-hidden="true" />

      <main className="hero">
        <svg className="chart-bg" viewBox="0 0 1200 180" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polyline
            points="0,160 120,150 240,130 360,140 480,110 600,145 720,55 840,90 960,35 1080,60 1200,15"
            fill="none"
            stroke="#c0392b"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <polyline
            points="0,160 120,150 240,130 360,140 480,110 600,145 720,55 840,90 960,35 1080,60 1200,15 1200,180 0,180"
            fill="#c0392b"
            fillOpacity="0.05"
            stroke="none"
          />
        </svg>

        <div className="content">
          <div className="tag">EARLY ACCESS</div>

          <h1>
            Bad decisions<br />
            don&apos;t <span className="red">reset.</span>
          </h1>

          <p className="sub">
            SimProfit is a 3D first-person business sim where every wrong
            call has permanent consequences. No reloading. No restarting.
            Built solo, from scratch.
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
                {status === 'success' && "You're in. Updates coming soon."}
                {(status === 'error' || status === 'duplicate') && message}
              </div>
            </form>
          </div>

          <div className="badges">
            <div className="badge">Built by <span>1 person</span></div>
            <div className="divider" />
            <div className="badge">Age <span>16</span></div>
            <div className="divider" />
            <div className="badge">Releasing on <span>Steam</span></div>
            <div className="divider" />
            <div className="badge">No <span>team</span></div>
          </div>
        </div>
      </main>

      <footer>
        <div className="ft">CAPITAL LOOP STUDIOS</div>
        <div className="ft">
          <a href="https://x.com/JakobBuilds" target="_blank" rel="noopener noreferrer">
            @JakobBuilds
          </a>
        </div>
      </footer>
    </>
  )
}
