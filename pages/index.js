import { useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
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
      </Head>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body {
          background: #080808;
          color: #f0ede8;
          font-family: 'Space Mono', 'Courier New', monospace;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .page {
          min-height: 100vh;
          display: grid;
          grid-template-rows: 1fr auto;
        }

        .hero {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 5rem 2rem 8rem;
          position: relative;
          overflow: hidden;
        }

        .chart-bg {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          pointer-events: none;
        }

        .content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-width: 680px;
          width: 100%;
          gap: 0;
        }

        .tag {
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #c0392b;
          border: 1px solid #c0392b;
          padding: 6px 16px;
          margin-bottom: 2.5rem;
          display: inline-block;
          animation: fadeUp 0.5s ease both;
        }

        h1 {
          font-family: 'Bebas Neue', 'Impact', sans-serif;
          font-size: clamp(5rem, 14vw, 9rem);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: 0.02em;
          margin-bottom: 2rem;
          animation: fadeUp 0.5s 0.1s ease both;
        }

        h1 .red { color: #c0392b; }

        .sub {
          font-size: 12px;
          color: #666;
          line-height: 1.9;
          max-width: 420px;
          margin-bottom: 3rem;
          letter-spacing: 0.05em;
          animation: fadeUp 0.5s 0.2s ease both;
        }

        .form-wrap {
          width: 100%;
          max-width: 440px;
          animation: fadeUp 0.5s 0.3s ease both;
          margin-bottom: 0.75rem;
        }

        .form-row {
          display: flex;
          gap: 0;
          width: 100%;
          border: 1px solid #2a2a2a;
        }

        .form-row input[type="email"] {
          flex: 1;
          background: #0e0e0e;
          border: none;
          border-right: 1px solid #2a2a2a;
          color: #f0ede8;
          padding: 14px 16px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          outline: none;
          min-width: 0;
          letter-spacing: 0.03em;
        }

        .form-row input[type="email"]::placeholder { color: #383838; }
        .form-row input[type="email"]:focus { background: #111; }

        .form-row button {
          background: #c0392b;
          color: #fff;
          border: none;
          padding: 14px 24px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.15s;
          text-transform: uppercase;
        }

        .form-row button:hover { background: #a93226; }
        .form-row button:disabled { opacity: 0.45; cursor: not-allowed; }

        .form-msg {
          padding-top: 8px;
          font-size: 10px;
          letter-spacing: 0.08em;
          text-align: left;
          min-height: 20px;
          padding-left: 2px;
        }

        .form-msg.success { color: #27ae60; }
        .form-msg.error   { color: #c0392b; }
        .form-msg.dup     { color: #666; }

        .badges {
          display: flex;
          gap: 0;
          margin-top: 3rem;
          animation: fadeUp 0.5s 0.4s ease both;
          border: 1px solid #1a1a1a;
        }

        .badge {
          font-size: 10px;
          color: #444;
          letter-spacing: 0.1em;
          padding: 10px 20px;
          border-right: 1px solid #1a1a1a;
          text-transform: uppercase;
        }

        .badge:last-child { border-right: none; }
        .badge span { color: #888; display: block; font-size: 12px; margin-top: 2px; }

        footer {
          padding: 1.25rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid #111;
        }

        .ft {
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .ft a {
          color: #333;
          text-decoration: none;
          transition: color 0.2s;
        }

        .ft a:hover { color: #c0392b; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 520px) {
          h1 { font-size: 5rem; }
          .form-row { flex-direction: column; border: none; gap: 8px; }
          .form-row input[type="email"] { border: 1px solid #2a2a2a; }
          .form-row button { border: 1px solid #c0392b; }
          .badges { flex-wrap: wrap; border: none; gap: 1px; }
          .badge { border: 1px solid #1a1a1a; flex: 1 1 40%; }
        }
      `}</style>

      <div className="page">
        <main className="hero">
          <svg className="chart-bg" viewBox="0 0 1400 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c0392b" stopOpacity="0.12"/>
                <stop offset="100%" stopColor="#c0392b" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <polyline
              points="0,180 140,170 280,155 420,162 560,130 700,158 840,70 980,105 1120,42 1260,65 1400,18"
              fill="none"
              stroke="#c0392b"
              strokeWidth="1.5"
              strokeOpacity="0.5"
            />
            <polygon
              points="0,180 140,170 280,155 420,162 560,130 700,158 840,70 980,105 1120,42 1260,65 1400,18 1400,200 0,200"
              fill="url(#fade)"
            />
          </svg>

          <div className="content">
            <div className="tag">EARLY ACCESS</div>

            <h1>
              BAD<br/>
              DECISIONS<br/>
              DON&apos;T <span className="red">RESET.</span>
            </h1>

            <p className="sub">
              SimProfit is a 3D first-person business sim where every wrong
              call has permanent consequences. No reloading. No restarting.
              Built solo. From scratch.
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
              <div className="badge">Solo dev<span>1 person</span></div>
              <div className="badge">Age<span>16</span></div>
              <div className="badge">Platform<span>Steam</span></div>
              <div className="badge">Team<span>None</span></div>
            </div>
          </div>
        </main>

        <footer>
          <div className="ft">Capital Loop Studios</div>
          <div className="ft">
            <a href="https://x.com/JakobBuilds" target="_blank" rel="noopener noreferrer">
              @JakobBuilds
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
