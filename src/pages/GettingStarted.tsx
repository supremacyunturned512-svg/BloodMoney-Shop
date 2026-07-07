export default function GettingStarted() {
  const steps = [
    {
      step: '01',
      title: 'Get Unturned',
      description: 'Download Unturned for free on Steam. The game is available on Windows, macOS, and Linux.',
      action: 'https://store.steampowered.com/app/304930/Unturned/',
      actionText: 'Get Unturned on Steam'
    },
    {
      step: '02',
      title: 'Join Our Discord',
      description: 'Connect with the community, get updates, and find friends to play with. This is where announcements and events are posted.',
      action: 'https://discord.gg/A6a7XcfP9P',
      actionText: 'Join Discord'
    },
    {
      step: '03',
      title: 'Read the Rules',
      description: 'Familiarize yourself with server rules to avoid issues. Knowing the rules helps you have a smooth experience.',
      action: '/rules',
      actionText: 'Read Rules'
    },
    {
      step: '04',
      title: 'Connect to the Server',
      description: 'Once the server is live, connect using the IP and port displayed on the homepage. Add us to your favorites for easy access.',
      action: '/',
      actionText: 'Back to Home'
    },
    {
      step: '05',
      title: 'Create Your Character',
      description: 'Set up your in-game character with a unique name and appearance. Choose your starting faction alignment.',
      action: null,
      actionText: ''
    },
    {
      step: '06',
      title: 'Start Roleplaying',
      description: 'Engage with the community, join a faction, build your story, and make your mark on BloodMoney RP.',
      action: null,
      actionText: ''
    }
  ]

  return (
    <div className="section-sm">
      <div className="sec-title">Getting Started</div>
      <p className="sec-sub">Your journey into BloodMoney RP begins here</p>

      <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.7, marginBottom: '36px' }}>
        New to BloodMoney RP? This guide walks you through everything you need to know to join the server and start your roleplay adventure.
      </p>

      {steps.map((s, idx) => (
        <div key={idx} style={{ display: 'flex', gap: '18px', marginBottom: '28px', paddingBottom: '28px', borderBottom: idx < steps.length - 1 ? '1px solid #141414' : 'none' }}>
          <div style={{ flexShrink: 0, width: '48px', height: '48px', background: '#8B0000', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Oswald, sans-serif', fontSize: '18px', fontWeight: 700, color: '#fff' }}>
            {s.step}
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.title}</h3>
            <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.7, marginBottom: s.action ? '12px' : 0 }}>{s.description}</p>
            {s.action && (
              <a href={s.action} target={s.action.startsWith('http') ? '_blank' : undefined} rel={s.action.startsWith('http') ? 'noopener' : undefined} className="btn btn-primary btn-sm">
                {s.actionText}
              </a>
            )}
          </div>
        </div>
      ))}

      <div className="divider"></div>

      <div className="sec-title">Server Status</div>
      <p className="sec-sub">Expected Launch: June 30, 2026</p>

      <div style={{ background: '#111', border: '1px solid #1f1f1f', borderRadius: '6px', padding: '24px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
        <h3 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '18px', color: '#fff', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '2px' }}>Under Development</h3>
        <p style={{ color: '#555', fontSize: '13px', lineHeight: 1.7, marginBottom: '16px' }}>
          BloodMoney RP is currently in active development. Systems are being built, tested, and refined. Join our Discord to follow progress and be notified when we launch.
        </p>
        <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" className="btn btn-primary">Get Notified on Discord</a>
      </div>
    </div>
  )
}
