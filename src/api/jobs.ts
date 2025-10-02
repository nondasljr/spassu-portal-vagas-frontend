import http from './http'

export type Job = {
  id: number
  company: number
  company_name?: string
  title: string
  employment_type: 'CLT' | 'PJ'
  work_mode: 'PRESENCIAL' | 'REMOTO' | 'HIBRIDO'
  opening_date: string
  description?: string
  benefits: string[]
  is_active: boolean
}

export type Company = {
  id: number
  name: string
  website?: string
}

type Paginated<T> = { count: number; results: T[] }

export async function listJobs(params?: Record<string, string>) {
  const res = await http.get<Paginated<Job>>('/api/jobs/', { params })
  return res.data
}

export async function getJob(id: string | number) {
  const res = await http.get<Job>(`/api/jobs/${id}/`)
  return res.data
}

export async function createJob(payload: Partial<Job>) {
  const res = await http.post<Job>('/api/jobs/', payload)
  return res.data
}

export async function updateJob(id: string | number, payload: Partial<Job>) {
  const res = await http.put<Job>(`/api/jobs/${id}/`, payload)
  return res.data
}

export async function deleteJob(id: string | number) {
  await http.delete(`/api/jobs/${id}/`)
}

export async function listCompanies() {
  const res = await http.get<Paginated<Company>>('/api/companies/')
  return res.data
}
