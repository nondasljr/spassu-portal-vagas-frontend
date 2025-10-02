import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import JobsList from './pages/JobsList'
import JobView from './pages/JobView'
import JobCreate from './pages/JobCreate'
import JobEdit from './pages/JobEdit'
import PrivateRoute from './components/PrivateRoute'
import AppLayout from './components/layout/AppLayout'
import AuthLayout from './components/layout/AuthLayout'
import './index.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/jobs" />} />

      <Route
        path="/jobs"
        element={
          <AppLayout>
            <JobsList />
          </AppLayout>
        }
      />

      <Route
        path="/jobs/:id"
        element={
          <AppLayout>
            <JobView />
          </AppLayout>
        }
      />

      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route element={<PrivateRoute />}>
        <Route
          path="/jobs/new"
          element={
            <AppLayout>
              <JobCreate />
            </AppLayout>
          }
        />
        <Route
          path="/jobs/:id/edit"
          element={
            <AppLayout>
              <JobEdit />
            </AppLayout>
          }
        />
      </Route>

      <Route
        path="*"
        element={
          <AppLayout>
            <div className="text-center text-gray-500">Página não encontrada</div>
          </AppLayout>
        }
      />
    </Routes>
  )
}