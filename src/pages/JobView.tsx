import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getJob, deleteJob, Job } from '../api/jobs'
import useAuthStore from '../store/auth'

export default function JobView() {
  const { id } = useParams<{ id: string }>()
  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    getJob(id!)
      .then((data) => { if (mounted) { setJob(data); setLoading(false) } })
      .catch(() => { if (mounted) { setError('Não foi possível carregar a vaga.'); setLoading(false) } })
    return () => { mounted = false }
  }, [id])

  async function onDelete() {
    if (!job) return
    if (confirm('Deseja realmente excluir esta vaga?')) {
      await deleteJob(job.id)
      navigate('/jobs')
    }
  }

  if (loading) return <div className="text-gray-600">Carregando...</div>
  if (error || !job) return <div className="text-red-600">{error || 'Vaga não encontrada.'}</div>

  return (
    <div className="card max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <p className="text-gray-600">
            <span className="font-medium">{job.company_name}</span>
            {' · '}
            <span className="rounded-full bg-blue-50 text-blue-700 text-xs px-2 py-1 align-middle">{job.employment_type}</span>
            {' '}
            <span className="rounded-full bg-purple-50 text-purple-700 text-xs px-2 py-1 align-middle">{job.work_mode}</span>
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Abertura: {new Date(job.opening_date).toLocaleDateString('pt-BR')}
            {job.is_active ? ' · Ativa' : ' · Inativa'}
          </p>
        </div>

        <div className="flex gap-2">
          <Link to="/jobs" className="btn btn-secondary">Voltar</Link>
          {isAuthenticated && (
            <>
              <Link to={`/jobs/${job.id}/edit`} className="btn">Editar</Link>
              <button onClick={onDelete} className="btn bg-red-600 hover:bg-red-700 active:bg-red-800">Excluir</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        {job.description && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Descrição</h3>
            <p className="leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </section>
        )}

        {!!(job.benefits?.length) && (
          <section>
            <h3 className="text-sm font-semibold text-gray-700 mb-1">Benefícios</h3>
            <ul className="list-disc pl-5 space-y-1">
              {job.benefits.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}