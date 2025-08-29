import { Outlet } from 'react-router-dom'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-4 px-4 py-4">
        <Sidebar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}