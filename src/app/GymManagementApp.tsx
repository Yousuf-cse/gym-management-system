import { useState } from "react"
import { List, LayoutDashboard,Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Member } from "@/interfaces/Member.interface"
import { initialMembers } from "@/data/MemberData"
import ThemeToggle from "@/components/ThemeToogle"
import MobileNav from "./MobileNav"
import Dashboard from "./Dashboard"
import AddMemberForm from "./AddMemberForm"
import MembersList from "./MemberList"

export default function GymManagementApp() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [members, setMembers] = useState<Member[]>(initialMembers)

  const addMember = (memberData: Omit<Member, "id">) => {
    const newMember: Member = {
      ...memberData,
      id: Date.now().toString(),
    }
    setMembers((prev) => [...prev, newMember])
  }

  const archiveMember = (id: string) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, archived: true } : member)))
  }

  const navigation = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "add-member", label: "Add Member", icon: Plus },
    { id: "members-list", label: "Members List", icon: List },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:w-64 md:bg-card md:border-r md:block">
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h2 className="text-lg font-semibold">Fit Culture</h2>
          <ThemeToggle />
        </div>
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentPage(item.id)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden flex h-16 items-center justify-between px-4 border-b bg-card">
        <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} navigation={navigation} />
        <h2 className="text-lg font-semibold">FitFlex Pro</h2>
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="md:pl-64">
        <main className="p-4 md:p-8">
          {currentPage === "dashboard" && <Dashboard members={members} />}
          {currentPage === "add-member" && <AddMemberForm onAddMember={addMember} />}
          {currentPage === "members-list" && <MembersList members={members} onArchiveMember={archiveMember} />}
        </main>
      </div>
    </div>
  )
}