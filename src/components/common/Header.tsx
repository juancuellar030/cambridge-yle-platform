import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Cambridge YLE Platform
          </Link>
          <nav className="space-x-4">
            <Link to="/login" className="hover:text-blue-200">
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header