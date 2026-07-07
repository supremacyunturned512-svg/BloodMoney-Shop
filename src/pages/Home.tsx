import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Home() {
  const [visitorCount, setVisitorCount] = useState(0)

  useEffect(() => {
    const trackVisitor = async () => {
      const { data } = await supabase
        .from('visitor_count')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (data) {
        setVisitorCount(data.count + 1)
        await supabase
          .from('visitor_count')
          .update({ count: data.count + 1 })
          .eq('id', 1)
      }
    }
    trackVisitor()
  }, [])

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <img src="/images/bmrp-logo.jpg" alt="BloodMoney RP" className="hero-logo" />
          <p className="hero-tag">Unturned Roleplay · Survive. Grind. Dominate.</p>
          <div className="hero-btns">
            <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" className="btn btn-primary">Join Discord</a>
            <a href="/shop" className="btn btn-outline">View Shop</a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-val">{visitorCount.toLocaleString()}</span>
          <span className="stat-lbl">Website Visitors</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">5</span>
          <span className="stat-lbl">Players</span>
        </div>
        <div className="stat-item">
          <span className="stat-dev">Under Dev</span>
          <span className="stat-lbl">Server Status</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">06/30/2026</span>
          <span className="stat-lbl">Launch Date</span>
        </div>
        <div className="stat-item">
          <span className="stat-val">Unturned</span>
          <span className="stat-lbl">Game</span>
        </div>
      </div>

      {/* Why Section */}
      <div className="why-sec">
        <div className="why-inner">
          <h2>We've Seen <span>What Doesn't Work.</span><br />Now We're Fixing It.</h2>
          <p>BloodMoney RP was built by people with real experience — and real frustration. We've seen bad management, admin abuse, and communities that never came first. We're doing it differently.</p>
          <div className="story-grid">
            <div className="story-card">
              <div className="story-card-icon">🩸</div>
              <h3>Built From Experience</h3>
              <p>Our owner has worked on recognized Unturned servers. We know what works and what destroys a community.</p>
            </div>
            <div className="story-card">
              <div className="story-card-icon">🤝</div>
              <h3>Community First</h3>
              <p>Every decision runs through one question: does this make the player experience better?</p>
            </div>
            <div className="story-card">
              <div className="story-card-icon">⚙️</div>
              <h3>Custom Everything</h3>
              <p>Original plugins, custom systems, constant improvements. Not a copy-paste server.</p>
            </div>
            <div className="story-card">
              <div className="story-card-icon">🛡️</div>
              <h3>Fair Staff. Always.</h3>
              <p>Our staff culture is built on accountability, transparency, and player trust.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="section">
        <div className="sec-title">What We're Building</div>
        <p className="sec-sub">Features coming at launch and beyond</p>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🗺️</div>
            <div>
              <h4>Open World RP</h4>
              <p>Full map immersion with faction territory, economy zones, and dynamic events.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div>
              <h4>Custom Economy</h4>
              <p>Trade, loot, hustle. A player-driven market where every transaction matters.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔫</div>
            <div>
              <h4>Faction Wars</h4>
              <p>Form or join factions, claim turf, wage war, and build your empire.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚖️</div>
            <div>
              <h4>Law & Order</h4>
              <p>Police and criminal factions with real consequences.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🔧</div>
            <div>
              <h4>Original Plugins</h4>
              <p>Developed in-house. Every system made specifically for BMRP.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📢</div>
            <div>
              <h4>Active Staff</h4>
              <p>A team that's actually online, responsive, and genuinely cares.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="cta-strip">
        <h2>Ready to Be Part of Something Different?</h2>
        <p>Join the Discord and help shape BloodMoney RP before launch.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" className="btn btn-primary">Join Our Discord</a>
          <a href="/about" className="btn btn-outline">Learn More</a>
        </div>
      </div>
    </>
  )
}
