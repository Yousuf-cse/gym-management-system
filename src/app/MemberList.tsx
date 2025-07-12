import { useState } from "react"
import { Archive } from "lucide-react"
import type { Member } from "@/interfaces/Member.interface"
import MemberCard from "./MemberCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format, isAfter, isBefore, addDays, startOfMonth, endOfMonth } from "date-fns"

export default function MembersList({ members, onArchiveMember }: { members: Member[]; onArchiveMember: (id: string) => void }) {
  const [filter, setFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")
  const today = new Date()
  const twoDaysFromNow = addDays(today, 2)
  const currentMonthStart = startOfMonth(today)
  const currentMonthEnd = endOfMonth(today)

  const getFilteredMembers = () => {
    switch (filter) {
      case "active":
        return members.filter((m) => m.status === "Active" && !m.archived)
      case "inactive":
        return members.filter((m) => m.status === "Inactive" && !m.archived)
      case "archived":
        return members.filter((m) => m.archived)
      case "expiring":
        return members.filter(
          (m) => !m.archived && isAfter(m.expiryDate, today) && isBefore(m.expiryDate, twoDaysFromNow),
        )
      case "monthly":
        return members.filter(
          (m) => !m.archived && isAfter(m.joinDate, currentMonthStart) && isBefore(m.joinDate, currentMonthEnd),
        )
      default:
        return members.filter((m) => !m.archived)
    }
  }

  const filteredMembers = getFilteredMembers()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const isExpiringSoon = (expiryDate: Date) => {
    return isAfter(expiryDate, today) && isBefore(expiryDate, twoDaysFromNow)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Fit Culture Members List</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">
            View and manage all gym members with filtering options.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="hidden sm:inline-flex"
          >
            Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="hidden sm:inline-flex"
          >
            Cards
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Members</CardTitle>
          <CardDescription>
            Filter and view member information, manage their status and archive when needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={filter} onValueChange={setFilter} className="space-y-4">
            <div className="overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 min-w-[600px] lg:min-w-0">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
                <TabsTrigger value="expiring">Expiring</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={filter} className="space-y-4">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No members found for the selected filter.</div>
              ) : (
                <>
                  {/* Mobile Card View */}
                  <div className="grid gap-4 sm:hidden px-2 overflow-x-hidden">
                    {filteredMembers.map((member) => (
                      <MemberCard
                        key={member.id}
                        member={member}
                        onArchiveMember={onArchiveMember}
                        isExpiringSoon={isExpiringSoon(member.expiryDate)}
                      />
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block">
                    {viewMode === "cards" ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredMembers.map((member) => (
                          <MemberCard
                            key={member.id}
                            member={member}
                            onArchiveMember={onArchiveMember}
                            isExpiringSoon={isExpiringSoon(member.expiryDate)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="min-w-[200px]">Member</TableHead>
                              <TableHead className="min-w-[120px]">Phone</TableHead>
                              <TableHead className="min-w-[80px]">Status</TableHead>
                              <TableHead className="min-w-[120px]">Join Date</TableHead>
                              <TableHead className="min-w-[120px]">Expiry Date</TableHead>
                              <TableHead className="min-w-[100px]">Membership</TableHead>
                              <TableHead className="min-w-[120px]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredMembers.map((member) => (
                              <TableRow
                                key={member.id}
                                className={isExpiringSoon(member.expiryDate) ? "bg-red-50 dark:bg-red-950/20" : ""}
                              >
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <Avatar>
                                      <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0">
                                      <div className="font-medium truncate">{member.fullName}</div>
                                      <div className="text-sm text-muted-foreground truncate">{member.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>{member.phoneNumber}</TableCell>
                                <TableCell>
                                  <Badge variant={member.status === "Active" ? "default" : "secondary"}>
                                    {member.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{format(member.joinDate, "MMM dd, yyyy")}</TableCell>
                                <TableCell>
                                  <div className={isExpiringSoon(member.expiryDate) ? "text-red-600 font-medium" : ""}>
                                    {format(member.expiryDate, "MMM dd, yyyy")}
                                    {isExpiringSoon(member.expiryDate) && (
                                      <div className="text-xs text-red-500">Expiring Soon!</div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">{member.membershipType}</Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex space-x-2">
                                    <Button variant="outline" size="sm">
                                      Edit
                                    </Button>
                                    {!member.archived && (
                                      <Button variant="outline" size="sm" onClick={() => onArchiveMember(member.id)}>
                                        <Archive className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}