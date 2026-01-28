import Header from './Header'
import ArrivalBoard from './ArrivalBoard'
import ThemeToggle from './ThemeToggle'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text transition-colors duration-300">
      <ThemeToggle />
      <Header />
      <ArrivalBoard />
      {children}
    </div>
  )
}
