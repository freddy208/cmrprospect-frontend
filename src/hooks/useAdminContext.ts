"use client"

import React, { createContext, useContext, useState, type ReactNode } from "react"
import type { Role } from "@/types/role"
import type { Permission } from "@/types/permission"
import type { User } from "@/types/user"

interface AdminContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  selectedRole: Role | null
  setSelectedRole: (role: Role | null) => void
  selectedPermissions: Permission[]
  setSelectedPermissions: (permissions: Permission[]) => void
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  isCreateRoleDialogOpen: boolean
  setIsCreateRoleDialogOpen: (open: boolean) => void
  isEditRoleDialogOpen: boolean
  setIsEditRoleDialogOpen: (open: boolean) => void
  isCreateUserDialogOpen: boolean
  setIsCreateUserDialogOpen: (open: boolean) => void
  isEditUserDialogOpen: boolean
  setIsEditUserDialogOpen: (open: boolean) => void
  roleFilter: string
  setRoleFilter: (filter: string) => void
  userFilter: string
  setUserFilter: (filter: string) => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [activeSection, setActiveSection] = useState<string>("dashboard")
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState<boolean>(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState<boolean>(false)
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState<boolean>(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState<boolean>(false)
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [userFilter, setUserFilter] = useState<string>("")

  const value: AdminContextType = {
    activeSection,
    setActiveSection,
    selectedRole,
    setSelectedRole,
    selectedPermissions,
    setSelectedPermissions,
    selectedUser,
    setSelectedUser,
    isCreateRoleDialogOpen,
    setIsCreateRoleDialogOpen,
    isEditRoleDialogOpen,
    setIsEditRoleDialogOpen,
    isCreateUserDialogOpen,
    setIsCreateUserDialogOpen,
    isEditUserDialogOpen,
    setIsEditUserDialogOpen,
    roleFilter,
    setRoleFilter,
    userFilter,
    setUserFilter,
  }

  return React.createElement(AdminContext.Provider, { value }, children)
}

export function useAdminContext() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error("useAdminContext must be used within an AdminProvider")
  }
  return context
}
