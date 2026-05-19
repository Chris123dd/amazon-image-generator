import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { SettingsProvider } from './modules/settings/context/SettingsContext'
import { TemplatesProvider } from './modules/templates/context/TemplatesContext'
import { HistoryProvider } from './modules/history/context/HistoryContext'
import { GeneratorProvider } from './modules/generator/context/GeneratorContext'
import { ShoppingBag, History, Settings, FileText } from 'lucide-react'
import Home from './pages/Home'
import HistoryPage from './pages/History'
import TemplatesPage from './pages/Templates'
import SettingsPage from './pages/Settings'

function Navigation() {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: ShoppingBag, label: '首页' },
    { path: '/history', icon: History, label: '历史记录' },
    { path: '/templates', icon: FileText, label: '模板管理' },
    { path: '/settings', icon: Settings, label: '设置' },
  ]
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <span className="font-bold text-gray-900">亚马逊主图生成器</span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition ${
                  location.pathname === item.path
                    ? 'bg-orange-100 text-orange-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <SettingsProvider>
      <TemplatesProvider>
        <HistoryProvider>
          <GeneratorProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <Navigation />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/templates" element={<TemplatesPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </div>
            </BrowserRouter>
          </GeneratorProvider>
        </HistoryProvider>
      </TemplatesProvider>
    </SettingsProvider>
  )
}

export default App
