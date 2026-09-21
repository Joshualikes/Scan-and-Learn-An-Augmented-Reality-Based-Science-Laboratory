import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { homePathFor, normalizeRole } from './lib/supabase'
import Layout from './components/Layout'
import Home from './pages/Home'
import Student from './pages/Student'
import Inventory from './pages/Inventory'
import EquipmentDetail from './pages/EquipmentDetail'
import Logs from './pages/Logs'
import Scan from './pages/Scan'
import AR from './pages/AR'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Login from './pages/Login'
import Register from './pages/Register'

function Guard({ roles, children }) {
  const { currentUser, authReady } = useApp()
  if (!authReady) return <div className="auth-loading">Loading account…</div>
  if (!currentUser) return <Navigate to="/login" replace />
  if (roles && !roles.includes(normalizeRole(currentUser.role))) {
    return <Navigate to={homePathFor(currentUser)} replace />
  }
  return children
}

function GuestOnly({ children }) {
  const { currentUser, authReady } = useApp()
  if (!authReady) return <div className="auth-loading">Loading account…</div>
  if (currentUser) return <Navigate to={homePathFor(currentUser)} replace />
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              path="/login"
              element={
                <GuestOnly>
                  <Login />
                </GuestOnly>
              }
            />
            <Route
              path="/register"
              element={
                <GuestOnly>
                  <Register />
                </GuestOnly>
              }
            />
            <Route
              path="/"
              element={
                <Guard roles={['Admin']}>
                  <Home />
                </Guard>
              }
            />
            <Route
              path="/student"
              element={
                <Guard roles={['Student']}>
                  <Student />
                </Guard>
              }
            />
            <Route
              path="/inventory"
              element={
                <Guard>
                  <Inventory />
                </Guard>
              }
            />
            <Route
              path="/inventory/:id"
              element={
                <Guard>
                  <EquipmentDetail />
                </Guard>
              }
            />
            <Route
              path="/logs"
              element={
                <Guard>
                  <Logs />
                </Guard>
              }
            />
            <Route
              path="/ar"
              element={
                <Guard>
                  <AR />
                </Guard>
              }
            />
            <Route
              path="/scan"
              element={
                <Guard>
                  <Scan />
                </Guard>
              }
            />
            <Route
              path="/reports"
              element={
                <Guard roles={['Admin']}>
                  <Reports />
                </Guard>
              }
            />
            <Route
              path="/users"
              element={
                <Guard roles={['Admin']}>
                  <Users />
                </Guard>
              }
            />
            <Route
              path="/settings"
              element={
                <Guard>
                  <Settings />
                </Guard>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
