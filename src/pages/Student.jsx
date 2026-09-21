import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EquipmentArt } from '../components/EquipmentArt'
import { IconBox, IconClipboard, IconQr, IconScan } from '../components/Icons'

function formatWhen(value) {
  if (!value) return ''
  const date = new Date(`${value}T09:00:00`)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Student() {
  const { currentUser, equipment, logs } = useApp()
  const navigate = useNavigate()
  const recent = logs.slice(0, 4)

  return (
    <div className="home-dash">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Student workspace</p>
          <h2>Hello{currentUser?.fullname ? `, ${currentUser.fullname}` : ''}!</h2>
          <p>Preview hospital machines in AR, scan equipment QR codes, check inventory, and review laboratory logs.</p>
          <div className="hero-actions">
            <button type="button" className="cta-btn" onClick={() => navigate('/ar')}>
              <IconScan /> AR Preview
            </button>
            <button type="button" className="cta-btn ghost" onClick={() => navigate('/scan')}>
              <IconQr /> Scan Equipment
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80"
            alt="Microscope and laboratory glassware"
          />
        </div>
      </section>

      <div className="home-bottom">
        <section>
          <h3>Your tools</h3>
          <div className="quick-grid">
            <Link to="/inventory">
              <IconBox />
              Equipment Inventory
            </Link>
            <Link to="/ar">
              <IconScan />
              AR Preview
            </Link>
            <Link to="/scan">
              <IconQr />
              Scan Equipment
            </Link>
            <Link to="/logs">
              <IconClipboard />
              Logs
            </Link>
          </div>
        </section>

        <section>
          <h3>Recent activity</h3>
          <ul className="activity-list">
            {recent.length === 0 && <li className="empty-note">No activity yet.</li>}
            {recent.map((log) => {
              const item = equipment.find((e) => e.id === log.equipmentId)
              return (
                <li key={log.id}>
                  <div className="mini-art">
                    <EquipmentArt type={item?.name || 'Beaker'} />
                  </div>
                  <div>
                    <strong>
                      {item?.name || log.equipmentId} ({log.equipmentId})
                    </strong>
                    <p>
                      {log.status} · {formatWhen(log.date)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
