import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EquipmentArt } from '../components/EquipmentArt'
import {
  IconBox,
  IconBorrow,
  IconCheck,
  IconClipboard,
  IconQr,
  IconReport,
  IconScan,
  IconUser,
} from '../components/Icons'

function formatWhen(value) {
  if (!value) return ''
  const date = new Date(`${value}T09:00:00`)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function Home() {
  const { equipment, logs, stats } = useApp()
  const navigate = useNavigate()
  const recent = logs.slice(0, 4)

  return (
    <div className="home-dash">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Welcome to</p>
          <h2>Scan-and-Learn!</h2>
          <p>Explore all hospital machines in AR, then scan a QR code for AI-powered details and release dates.</p>
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

      <section className="stat-grid">
        <article>
          <span className="stat-ico blue">
            <IconBox />
          </span>
          <div>
            <p>Total Equipment</p>
            <strong>{stats.total}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico green">
            <IconCheck />
          </span>
          <div>
            <p>Available</p>
            <strong>{stats.available}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico orange">
            <IconBorrow />
          </span>
          <div>
            <p>Borrowed</p>
            <strong>{stats.borrowed}</strong>
          </div>
        </article>
        <article>
          <span className="stat-ico cyan">
            <IconQr />
          </span>
          <div>
            <p>QR/AR Scans</p>
            <strong>{stats.scans}</strong>
          </div>
        </article>
      </section>

      <div className="home-bottom">
        <section>
          <h3>Quick Actions</h3>
          <div className="quick-grid">
            <Link to="/inventory">
              <IconBox />
              View Equipment Inventory
            </Link>
            <Link to="/logs">
              <IconClipboard />
              View Logs
            </Link>
            <Link to="/ar">
              <IconScan />
              AR Preview
            </Link>
            <Link to="/scan">
              <IconQr />
              Scan Equipment
            </Link>
            <Link to="/reports">
              <IconReport />
              Generate Report
            </Link>
            <Link to="/users">
              <IconUser />
              Student Users
            </Link>
          </div>
        </section>

        <section>
          <h3>Recent Activity</h3>
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
