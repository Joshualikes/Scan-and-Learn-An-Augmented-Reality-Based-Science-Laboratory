export default function AuthSplit({ children }) {
  return (
    <div className="auth-split">
      <section className="auth-hero">
        <div className="auth-hero-overlay">
          <img src="/logo.jpg" alt="Cabcaben Elementary School" />
          <p className="auth-kicker">CABCABEN ELEMENTARY SCHOOL</p>
          <h1>Scan-and-Learn</h1>
          <p className="auth-tagline">
            An Augmented Reality-Based Science Laboratory Inventory and Information System
          </p>
        </div>
      </section>
      <section className="auth-panel">{children}</section>
    </div>
  )
}
