export default function About() {
  return (
    <div className="section">
      <div className="sec-title">About BloodMoney RP</div>
      <p className="sec-sub">The story behind the server</p>

      <div style={{ marginBottom: '28px' }}>
        <p style={{ color: '#D4D4D4', fontSize: '15px', lineHeight: 1.8, marginBottom: '20px' }}>
          BloodMoney RP is an upcoming Unturned roleplay server built from the ground up by experienced developers and community managers who have seen what works — and what destroys communities.
        </p>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8, marginBottom: '20px' }}>
          Our owner has worked on some of the most recognized Unturned servers in the community. After witnessing toxic management, admin abuse, and servers that prioritized profit over players, we decided to build something different.
        </p>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.8 }}>
          Every system in BloodMoney RP is developed in-house. We don't copy-paste plugins. We don't follow trends blindly. We build what makes sense for a sustainable, fair, and engaging roleplay experience.
        </p>
      </div>

      <div className="divider"></div>

      <div className="sec-title">Our Philosophy</div>
      <p className="sec-sub">What drives every decision we make</p>

      <div className="info-grid">
        <div className="info-card">
          <h3>Community First</h3>
          <p>Every feature, every rule, every decision runs through one filter: does this improve the player experience? If not, it doesn't ship.</p>
        </div>
        <div className="info-card">
          <h3>No Pay-to-Win</h3>
          <p>Supporter ranks provide cosmetic perks and convenience — never gameplay advantages. Skill and dedication matter more than wallet size.</p>
        </div>
        <div className="info-card">
          <h3>Transparency</h3>
          <p>We communicate openly about development, changes, and challenges. No hidden agendas, no mystery nerfs, no silent bans.</p>
        </div>
        <div className="info-card">
          <h3>Active Development</h3>
          <p>BloodMoney RP is not a "set it and forget it" server. We constantly iterate, improve, and respond to community feedback.</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="sec-title">What We're Building</div>
      <p className="sec-sub">Core features at launch and beyond</p>

      <div className="info-grid">
        <div className="info-card">
          <h3>Custom Economy</h3>
          <p>A player-driven market where trading, looting, and hustling create real value. Not just inflated numbers.</p>
        </div>
        <div className="info-card">
          <h3>Faction System</h3>
          <p>Form crews, claim territory, wage wars, and build empires. Real stakes, real consequences.</p>
        </div>
        <div className="info-card">
          <h3>Law & Order</h3>
          <p>Police and criminal gameplay with meaningful interactions, arrests, court systems, and more.</p>
        </div>
        <div className="info-card">
          <h3>Original Plugins</h3>
          <p>Every plugin is developed in-house specifically for BMRP. No generic, recycled systems.</p>
        </div>
      </div>

      <div className="cta-strip" style={{ marginTop: '40px' }}>
        <h2>Want to Know More?</h2>
        <p>Join our Discord to chat with the community and get updates on development.</p>
        <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" className="btn btn-primary">Join Discord</a>
      </div>
    </div>
  )
}
