import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import useAuthStore from '../store/auth'

vi.mock('../store/auth', () => {
  return {
    __esModule: true,
    default: vi.fn(() => ({
      login: vi.fn().mockResolvedValue(undefined),
    }))
  }
})

describe('Login', () => {
  it('deve exibir erro quando credenciais inválidas', async () => {
    const mocked = { login: vi.fn().mockRejectedValue(new Error('invalid')) }
    ;(useAuthStore as any).mockReturnValue(mocked)

    render(<BrowserRouter><Login /></BrowserRouter>)
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'foo' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'bar' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Usuário ou senha inválidos.')
    })
  })
})
