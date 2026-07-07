import { useState } from 'react'

export default function Rules() {
  const sections = [
    {
      title: 'General Conduct',
      rules: [
        'Treat all players and staff with respect. Harassment, discrimination, and toxicity are not tolerated.',
        'No exploiting, glitching, or abusing game mechanics for unfair advantage.',
        'Impersonating staff members or other players is strictly prohibited.',
        'Keep communication civil in all channels — Discord, in-game chat, and voice.',
        'Do not share personal information of other players without consent.'
      ]
    },
    {
      title: 'Roleplay Guidelines',
      rules: [
        'Stay in character while in roleplay zones. Initiate roleplay before engaging in hostile actions.',
        'No random deathmatching (RDM) — you must have a valid roleplay reason to kill or harm another player.',
        'No vehicle deathmatching (VDM) — vehicles are for transportation, not weapons.',
        'Fear for your life — value your character\'s life realistically in dangerous situations.',
        'No meta-gaming — do not use out-of-character information for in-character advantage.',
        'No power-gaming — do not force actions on other players or roleplay unfair advantages.'
      ]
    },
    {
      title: 'Combat & Conflict',
      rules: [
        'Give clear initiation and reasonable time for response before combat.',
        'Combat logging to avoid death or consequences is prohibited.',
        'KOS zones must be clearly marked and communicated.',
        'Police and criminal roleplay have specific engagement rules — follow faction guidelines.',
        'Revenge killing (returning to kill after death) is not allowed.'
      ]
    },
    {
      title: 'Economy & Property',
      rules: [
        'No real-money trading (RMT) for in-game items or currency outside official channels.',
        'Exploiting the economy through glitches or cheats will result in permanent bans.',
        'Base raiding must follow proper raiding rules and timers.',
        'Starter packs and free items cannot be sold or transferred to other accounts.',
        'Faction territory claims are temporary and require active maintenance.'
      ]
    },
    {
      title: 'Communication',
      rules: [
        'Keep OOC (out of character) chat separate from IC (in character) interactions.',
        'Use appropriate channels for reports, appeals, and general discussion.',
        'No spamming, advertising other servers, or excessive caps lock.',
        'Respect staff decisions — appeals go through proper channels, not arguments.',
        'Report rule violations to staff with evidence (screenshots, video, timestamps).'
      ]
    }
  ]

  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(prev => prev === idx ? null : idx)
  }

  return (
    <div className="section-sm">
      <div className="sec-title">Laws & Rules</div>
      <p className="sec-sub">Know the rules. Play fair. Have fun.</p>

      <div style={{ marginBottom: '24px' }}>
        <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.7 }}>
          These rules apply to all players, staff, and community members. Ignorance of the rules is not an excuse for breaking them. Consequences range from warnings to permanent bans depending on severity.
        </p>
      </div>

      {sections.map((section, idx) => (
        <div key={idx} style={{ marginBottom: '12px' }}>
          <div className={`accordion ${openIdx === idx ? 'open' : ''}`}>
            <button className="acc-btn" onClick={() => toggle(idx)}>
              <span className="acc-title">{section.title}</span>
              <span className="acc-icon">▼</span>
            </button>
            <div className="acc-body">
              <ul className="rules-list">
                {section.rules.map((rule, rIdx) => (
                  <li key={rIdx}>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}

      <div className="divider"></div>

      <div className="cta-strip" style={{ marginTop: '40px' }}>
        <h2>Questions About the Rules?</h2>
        <p>Join our Discord and use the #support channel to get clarification from staff.</p>
        <a href="https://discord.gg/A6a7XcfP9P" target="_blank" rel="noopener" className="btn btn-primary">Join Discord</a>
      </div>
    </div>
  )
}
