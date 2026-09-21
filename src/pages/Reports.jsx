import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { IconBox, IconCalendar, IconClipboard, IconWrench } from '../components/Icons'

export default function Reports() {
  const { equipment, logs, stats } = useApp()
  const [from, setFrom] = useState('2026-04-01')
  const [to, setTo] = useState('2026-04-30')

  const generate = (type) => {
    const popup = window.open('', '_blank', 'width=720,height=900')
    const rows =
      type === 'inventory'
        ? equipment.map((e) => `<tr><td>${e.id}</td><td>${e.name}</td><td>${e.status}</td><td>${e.quantity}</td></tr>`).join('')
        : logs
            .filter((l) => (!from || l.date >= from) && (!to || l.date <= to))
            .map(
              (l) =>
                `<tr><td>${l.date}</td><td>${l.user}</td><td>${l.equipmentId}</td><td>${l.action}</td><td>${l.status}</td></tr>`,
            )
            .join('')
    popup.document.write(`
      <html>
        <head>
          <title>${type} report</title>
          <style>
            body { font-family: Poppins, sans-serif; padding: 24px; color: #16332a; }
            h1 { color: #0b5d36; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #d9e6de; padding: 8px; text-align: left; }
            th { background: #e8f6ee; }
          </style>
        </head>
        <body>
          <h1>Cabcaben Elementary School</h1>
          <h2>${type} report (${from} to ${to})</h2>
          <p>Total equipment units: ${stats.total} · Logs: ${stats.logTotal}</p>
          <table>
            <thead>
              ${
                type === 'inventory'
                  ? '<tr><th>ID</th><th>Name</th><th>Status</th><th>Qty</th></tr>'
                  : '<tr><th>Date</th><th>User</th><th>Equipment</th><th>Action</th><th>Status</th></tr>'
              }
            </thead>
            <tbody>${rows || '<tr><td colspan="5">No records</td></tr>'}</tbody>
          </table>
        </body>
      </html>
    `)
    popup.document.close()
    popup.focus()
    popup.print()
  }

  const cards = [
    { title: 'Inventory Report', text: 'View and download equipment list', icon: IconBox, type: 'inventory' },
    { title: 'Usage Report', text: 'View equipment usage logs', icon: IconClipboard, type: 'usage' },
    { title: 'Borrowing Report', text: 'View borrowed items', icon: IconCalendar, type: 'usage' },
    { title: 'Maintenance Report', text: 'View maintenance schedule', icon: IconWrench, type: 'inventory' },
  ]

  return (
    <div className="panel-page">
      <div className="panel-head">
        <h2>Reports</h2>
        <div className="toolbar-controls">
          <label className="date-range">
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            <span>–</span>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </label>
          <button type="button" className="cta-btn compact" onClick={() => generate('usage')}>
            Generate Report
          </button>
        </div>
      </div>

      <div className="report-grid">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <button key={card.title} type="button" className="report-card" onClick={() => generate(card.type)}>
              <span className="report-ico">
                <Icon />
              </span>
              <div>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
