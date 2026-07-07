import { useState } from 'react'

interface StaffMember {
  key: string
  name: string
  initial: string
  role: string
  bio: string
  responsibilities: string
  contact: string
}

const staffMembers: StaffMember[] = [
  {
    key: 'mellow',
    name: 'Mellow',
    initial: 'M',
    role: 'Owner',
    bio: "Hello! I'm Mellow, the owner of BloodMoney RP. I'm a young Unturned developer and code editor who has had the opportunity to work on some of the most recognized servers in the Unturned community. Through that experience, I've gained knowledge in custom development, optimization, and server management.",
    responsibilities: 'The Owner is responsible for the overall vision, development, and management of BloodMoney RP. They oversee server operations, lead the staff team, develop and maintain custom systems, and make final decisions on all major changes.',
    contact: 'Reach Mellow through the Discord server for serious matters.'
  },
  {
    key: 'opz',
    name: 'Opz Winston',
    initial: 'O',
    role: 'Co-Owner',
    bio: 'Opz Winston is the Co-Owner of BloodMoney RP, working hand-in-hand with Mellow to bring the server vision to life.',
    responsibilities: 'The Co-Owner assists the Owner in managing the server, overseeing major decisions, daily operations, and steps in whenever the Owner is unavailable.',
    contact: 'Available through Discord for community matters.'
  },
  {
    key: 'shark',
    name: 'Shark',
    initial: 'S',
    role: 'Server Director',
    bio: 'Shark serves as the Server Director of BloodMoney RP, responsible for the overall direction of in-game systems.',
    responsibilities: 'Oversees the staff team, enforces standards, manages administrative operations, and coordinates updates and events.',
    contact: 'Contact Shark through official Discord support channels.'
  },
  {
    key: 'harry',
    name: 'Harry',
    initial: 'H',
    role: 'Assistant Director',
    bio: 'Harry supports the leadership team in keeping BloodMoney RP running smoothly day to day.',
    responsibilities: 'Works alongside the Server Director assisting with staff management, handling reports, and ensuring policies are followed.',
    contact: 'Contact Harry through official Discord support channels.'
  },
  {
    key: 'jj',
    name: 'JJ',
    initial: 'J',
    role: 'Head Admin',
    bio: 'JJ is the Head Admin on BloodMoney RP — responsive, fair, and dedicated to the community.',
    responsibilities: 'Moderating in-game behavior, handling player reports, enforcing server rules, and leading the admin team.',
    contact: 'Reach JJ through #support in the Discord server.'
  }
]

export default function Staff() {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  return (
    <div className="section">
      {selectedStaff ? (
        <>
          <button
            className="btn btn-outline"
            style={{ marginBottom: '26px' }}
            onClick={() => setSelectedStaff(null)}
          >
            ← Back to Team
          </button>

          <div className="profile-card">
            <div className="profile-head">
              <div className="profile-avatar-lg">{selectedStaff.initial}</div>
              <div>
                <h1 style={{ fontFamily: 'Oswald, sans-serif', fontSize: '24px', fontWeight: 700, color: '#fff', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '5px' }}>
                  {selectedStaff.name}
                </h1>
                <span style={{ display: 'inline-block', background: '#8B0000', color: '#fff', fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', padding: '3px 9px', borderRadius: '2px' }}>
                  {selectedStaff.role}
                </span>
              </div>
            </div>
            <div className="profile-body">
              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px', marginBottom: '10px' }}>About</div>
              <p style={{ color: '#D4D4D4', lineHeight: 1.75, fontSize: '14px', marginBottom: '22px' }}>{selectedStaff.bio}</p>

              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px', marginBottom: '10px' }}>Responsibilities</div>
              <p style={{ color: '#D4D4D4', lineHeight: 1.75, fontSize: '14px', marginBottom: '22px' }}>{selectedStaff.responsibilities}</p>

              <div style={{ fontFamily: 'Oswald, sans-serif', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#444', borderBottom: '1px solid #1a1a1a', paddingBottom: '6px', marginBottom: '10px' }}>Contact</div>
              <p style={{ color: '#D4D4D4', lineHeight: 1.75, fontSize: '14px' }}>{selectedStaff.contact}</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="sec-title">Meet the Team</div>
          <p className="sec-sub">The people behind BloodMoney RP</p>

          <div className="featured-grid" style={{ marginBottom: '32px' }}>
            {staffMembers.slice(0, 2).map(member => (
              <div key={member.key} className="featured-card" onClick={() => setSelectedStaff(member)}>
                <div className="featured-avatar">{member.initial}</div>
                <div className="featured-name">{member.name}</div>
                <div className="featured-role">{member.role}</div>
                <div style={{ fontSize: '9px', color: '#2a2a2a', marginTop: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>Click to view profile</div>
              </div>
            ))}
          </div>

          <div className="staff-grid">
            {staffMembers.slice(2).map(member => (
              <div key={member.key} className="staff-card" onClick={() => setSelectedStaff(member)}>
                <div className="staff-avatar">{member.initial}</div>
                <div className="staff-name">{member.name}</div>
                <div className="staff-role">{member.role}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
