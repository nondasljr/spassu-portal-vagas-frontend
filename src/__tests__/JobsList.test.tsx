import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import JobsList from '../pages/JobsList'
import * as jobsApi from '../api/jobs'

vi.mock('../api/jobs', async () => {
  return {
    __esModule: true,
    listJobs: vi.fn().mockResolvedValue({ count: 1, results: [{ id: 1, title: 'Dev Python', company: 1, company_name: 'Spassu', employment_type: 'PJ', work_mode: 'REMOTO', opening_date: '2025-10-02', benefits: [], is_active: true }] }),
    deleteJob: vi.fn().mockResolvedValue(undefined)
  }
})

describe('JobsList', () => {
  it('renderiza lista de vagas', async () => {
    render(<BrowserRouter><JobsList /></BrowserRouter>)
    await waitFor(() => expect(screen.getByText('Dev Python')).toBeInTheDocument())
    expect(screen.getByText('Spassu')).toBeInTheDocument()
  })
})
