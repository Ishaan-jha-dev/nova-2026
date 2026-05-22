'use client'

export default function ComingSoonClient() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'radial-gradient(ellipse at 50% 55%, #2d0a1a 0%, #1c0505 45%, #0A0105 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '35vh',
          background: 'radial-gradient(ellipse at bottom, rgba(232,61,138,0.22) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      <div className="text-center max-w-2xl mx-auto relative" style={{ zIndex: 10 }}>

        {/* Label */}
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 400,
          fontSize: 'clamp(0.6rem, 1.3vw, 0.8rem)',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: 'rgba(251,191,36,0.65)',
          marginBottom: '1.5rem',
        }}>
          Annual Campus Immersion Programme · IIM Bangalore
        </p>

        {/* NOVA UNPLUGGED */}
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
          color: '#fff',
          lineHeight: 1.05,
          letterSpacing: '-0.01em',
        }}>
          NOVA <span style={{ color: '#FF3366' }}>&apos;26</span>
        </h1>

        {/* Divider */}
        <div style={{
          width: '60px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #FF3366, transparent)',
          margin: '1.5rem auto',
        }} />

        {/* Main message */}
        <p style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          fontSize: 'clamp(1.1rem, 3vw, 1.8rem)',
          color: 'rgba(255,255,255,0.92)',
          letterSpacing: '0.04em',
          marginBottom: '0.6rem',
        }}>
          Registration opens <span style={{ color: '#FBBF24' }}>26th May</span>
        </p>

        <p style={{
          color: 'rgba(255,228,230,0.5)',
          fontSize: 'clamp(0.8rem, 1.5vw, 0.95rem)',
          letterSpacing: '0.05em',
          marginBottom: '2.8rem',
        }}>
          We&apos;re putting the finishing touches. Stay tuned!
        </p>

        {/* WhatsApp CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem' }}>
          <a
            href="https://chat.whatsapp.com/Kc5eCJjVk5gCGDbP7xDaWM?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn"
          >
            {/* WhatsApp Icon */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.656 1.438 5.168L2 22l4.954-1.418A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.077-1.118l-.292-.174-3.038.869.882-3.152-.19-.306A7.96 7.96 0 014 12c0-4.418 3.582-8 8-8s8 3.582 8 8-3.582 8-8 8z" fill="#25D366"/>
            </svg>
            Join WhatsApp Group
          </a>

          <p style={{
            color: 'rgba(255,228,230,0.35)',
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            For queries &amp; updates
          </p>
        </div>

        {/* Back link */}
        <div style={{ marginTop: '3rem' }}>
          <a href="/" className="back-link">
            ← Back to Home
          </a>
        </div>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;600;700&display=swap');

        .whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.9rem 2.4rem;
          border-radius: 9999px;
          background: linear-gradient(135deg, rgba(37,211,102,0.18) 0%, rgba(37,211,102,0.08) 100%);
          border: 1px solid rgba(37,211,102,0.5);
          color: #fff;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: clamp(0.78rem, 1.5vw, 0.92rem);
          letter-spacing: 0.15em;
          text-transform: uppercase;
          text-decoration: none;
          backdrop-filter: blur(16px);
          box-shadow: 0 0 30px rgba(37,211,102,0.2), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: all 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .whatsapp-btn:hover {
          background: linear-gradient(135deg, rgba(37,211,102,0.32) 0%, rgba(37,211,102,0.18) 100%);
          border-color: rgba(37,211,102,0.9);
          box-shadow: 0 0 55px rgba(37,211,102,0.5), 0 8px 24px rgba(37,211,102,0.25), inset 0 1px 0 rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .back-link {
          color: rgba(255,228,230,0.35);
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .back-link:hover {
          color: rgba(255,51,102,0.8);
        }
      `}</style>
    </div>
  )
}
