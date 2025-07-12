export interface Member {
  id: string
  fullName: string
  age: number
  phoneNumber: string
  email: string
  gender: string
  joinDate: Date
  expiryDate: Date
  membershipType: string
  status: "Active" | "Inactive"
  archived: boolean
}