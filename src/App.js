import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import AppRouter from "./router"
import AppLayout from "./components/layout/AppLayout"
import { ChatProvider } from "./contexts/ChatContext"
import { NavProvider } from "./contexts/NavContext"
import { OptimizationProvider } from "./contexts/OptimizationContext"
import { AuthProvider } from "./contexts/AuthContext"
import LoginPage from "./pages/LoginPage"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <NavProvider>
        <ChatProvider>
          <OptimizationProvider>
            <AuthProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/*" element={
                  <ProtectedRoute>
                    <AppLayout>
                      <AppRouter />
                    </AppLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </OptimizationProvider>
        </ChatProvider>
      </NavProvider>
    </BrowserRouter>
  )
}

export default App
