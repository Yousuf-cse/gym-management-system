import { Archive } from "lucide-react"
import type { Member } from "@/interfaces/Member.interface"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export default function MemberCard({
  member,
  onArchiveMember,
  isExpiringSoon,
}: {
  member: Member
  onArchiveMember: (id: string) => void
  isExpiringSoon: boolean
}) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className={cn("w-full", isExpiringSoon && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20")}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium truncate">{member.fullName}</div>
              <div className="text-sm text-muted-foreground truncate">{member.email}</div>
              <div className="text-sm text-muted-foreground">{member.phoneNumber}</div>
            </div>
          </div>
          <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Join Date:</span>
            <span>{format(member.joinDate, "MMM dd, yyyy")}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expiry Date:</span>
            <span className={isExpiringSoon ? "text-red-600 font-medium" : ""}>
              {format(member.expiryDate, "MMM dd, yyyy")}
              {isExpiringSoon && <div className="text-xs text-red-500">Expiring Soon!</div>}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Membership:</span>
            <Badge variant="outline">{member.membershipType}</Badge>
          </div>
        </div>

        <div className="flex space-x-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            Edit
          </Button>
          {!member.archived && (
            <Button variant="outline" size="sm" onClick={() => onArchiveMember(member.id)}>
              <Archive className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}