import { FormEvent, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/auth'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const location = useLocation() as any

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(username, password)
      const redirectTo = location.state?.from?.pathname || '/jobs'
      navigate(redirectTo, { replace: true })
    } catch (err: any) {
      setError('Usuário ou senha inválidos.')
    }
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Entrar</h2>
        <form onSubmit={onSubmit} className="grid gap-3">
          <label className="label">Usuário
            <input className="input mt-1" aria-label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label className="label">Senha
            <input className="input mt-1" aria-label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button type="submit" className="btn mt-2">Entrar</button>
          {error && <div role="alert" className="text-sm text-red-600">{error}</div>}
        </form>
      </div>
    </div>
  )
}
