import './App.css'
// import { Toaster } from 'sonner'
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from '@/components/ThemeProvider'
import GymManagementApp from './app/GymManagementApp'



export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <GymManagementApp />
      <Toaster />
    </ThemeProvider>
  )
}
