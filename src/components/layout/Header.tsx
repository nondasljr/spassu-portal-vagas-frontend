import { Link } from 'react-router-dom'
import useAuthStore from '../../store/auth'

export default function Header() {
  const { isAuthenticated, logout } = useAuthStore()
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto flex items-center gap-4 py-4 px-4">
        <h1 className="text-xl font-semibold">
          <Link to="/" className="hover:text-blue-600">Spassu • Portal de Vagas</Link>
        </h1>
        <nav className="ml-auto flex items-center gap-4">
          <Link to="/jobs" className="text-sm text-gray-700 hover:text-blue-600">Vagas</Link>
          {isAuthenticated ? (
            <button className="btn btn-secondary" onClick={logout}>Sair</button>
          ) : (
            <Link className="btn" to="/login">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  )
}