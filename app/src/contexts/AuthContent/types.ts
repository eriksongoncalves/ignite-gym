import React from 'react'
import { UserDTO } from '@dtos/user'

export type Credentials = {
  email: string
  password: string
}

export type AuthContextProps = {
  isLoadingUserStorageData: boolean
  user: UserDTO
  refreshedToken: string
  signIn: (credentials: Credentials) => Promise<void>
  signOut: () => void
  updateUserProfile: (data: UpdateUserProfileProps) => Promise<void>
}

export type AuthProviderProps = {
  children: React.ReactNode
}

export type UpdateUserProfileProps = {
  name?: string
  avatar?: string
}
