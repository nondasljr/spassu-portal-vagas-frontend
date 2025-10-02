import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listJobs, deleteJob, Job } from '../api/jobs'
import useAuthStore from '../store/auth'

export default function JobsList() {
  const [items, setItems] = useState<Job[]>([])
  const [count, setCount] = useState(0)
  const [search, setSearch] = useState('')
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  async function load() {
    const data = await listJobs(search ? { search } : undefined)
    setItems(data.results)
    setCount(data.count)
  }

  useEffect(() => { load() }, [])

  return (
    <div className="grid gap-4">
      <div className="flex gap-2 items-center">
        <input className="input max-w-xs" placeholder="Buscar por título..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn" onClick={load}>Buscar</button>
        <div className="ml-auto">
          {isAuthenticated && <button className="btn" onClick={() => navigate('/jobs/new')}>Nova vaga</button>}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600"><strong>Total:</strong> {count}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Título</th>
                <th>Empresa</th>
                <th>Tipo</th>
                <th>Trabalho</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map((j) => (
                <tr key={j.id}>
                  <td className="font-medium">
                    <Link className="hover:underline" to={`/jobs/${j.id}`}>{j.title}</Link>
                  </td>
                  <td>{j.company_name}</td>
                  <td><span className="rounded-full bg-blue-50 text-blue-700 text-xs px-2 py-1">{j.employment_type}</span></td>
                  <td><span className="rounded-full bg-purple-50 text-purple-700 text-xs px-2 py-1">{j.work_mode}</span></td>
                  <td className="space-x-2">
                    {isAuthenticated ? (
                      <>
                        <Link className="text-blue-600 hover:underline" to={`/jobs/${j.id}/edit`}>Editar</Link>
                        <button className="text-red-600 hover:underline" onClick={async () => {
                          if (confirm('Excluir vaga?')) { await deleteJob(j.id); await load() }
                        }}>Excluir</button>
                      </>
                    ) : (
                      <em className="text-gray-500">Somente leitura</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
