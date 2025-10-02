import { FormEvent, useEffect, useState } from 'react'
import { createJob, getJob, listCompanies, updateJob, Job, Company } from '../api/jobs'
import { useNavigate, useParams } from 'react-router-dom'

const empty: Partial<Job> = {
  title: '',
  employment_type: 'CLT',
  work_mode: 'PRESENCIAL',
  opening_date: new Date().toISOString().slice(0,10),
  description: '',
  benefits: [],
  is_active: true,
}

export default function JobForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payload, setPayload] = useState<Partial<Job>>(empty)
  const [companies, setCompanies] = useState<Company[]>([])
  const editing = !!id

  useEffect(() => {
    (async () => {
      const c = await listCompanies()
      setCompanies(c.results)
      if (editing) {
        const data = await getJob(id!)
        setPayload(data)
      }
    })()
  }, [id])

  function updateField(field: keyof Job, value: any) {
    setPayload((p) => ({ ...p, [field]: value }))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (editing) {
      await updateJob(id!, payload)
    } else {
      await createJob(payload)
    }
    navigate('/jobs')
  }

  const benefitsText = (payload.benefits || []).join('\n')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="card grid gap-4  w-full max-w-3xl">
        <div>
          <label className="label">Empresa</label>
          <select className="input" value={payload.company ?? ''} onChange={(e) => updateField('company', Number(e.target.value))} required>
            <option value="" disabled>Selecione...</option>
            {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Título</label>
          <input className="input" value={payload.title ?? ''} onChange={(e) => updateField('title', e.target.value)} required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label">Tipo de emprego</label>
            <select className="input" value={payload.employment_type ?? 'CLT'} onChange={(e) => updateField('employment_type', e.target.value)}>
              <option value="CLT">Efetivo (CLT)</option>
              <option value="PJ">Pessoa Jurídica (PJ)</option>
            </select>
          </div>

          <div>
            <label className="label">Tipo de trabalho</label>
            <select className="input" value={payload.work_mode ?? 'PRESENCIAL'} onChange={(e) => updateField('work_mode', e.target.value)}>
              <option value="PRESENCIAL">Presencial</option>
              <option value="REMOTO">Remoto</option>
              <option value="HIBRIDO">Híbrido</option>
            </select>
          </div>

          <div>
            <label className="label">Data de abertura</label>
            <input className="input" type="date" value={payload.opening_date ?? ''} onChange={(e) => updateField('opening_date', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Descrição</label>
          <textarea className="input min-h-32" value={payload.description ?? ''} onChange={(e) => updateField('description', e.target.value)} rows={4} />
        </div>

        <div>
          <label className="label">Benefícios (um por linha)</label>
          <textarea
            className="input min-h-28"
            value={benefitsText}
            onChange={(e) => updateField('benefits', e.target.value.split('\n').map(s => s).filter(Boolean))}
            rows={4}
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={payload.is_active ?? true} onChange={(e) => updateField('is_active', e.target.checked)} />
          <span>Ativa</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" className="btn">{editing ? 'Salvar' : 'Criar'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/jobs')}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
