import DashboardPage from "./pages/DashboardPage"
import AppLayout from "./components/layout/AppLayout"

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex justify-center">
      <div className="w-full max-w-5xl">
        <AppLayout>
          <DashboardPage />
        </AppLayout>
      </div>
    </div>
  )
}

export default App
