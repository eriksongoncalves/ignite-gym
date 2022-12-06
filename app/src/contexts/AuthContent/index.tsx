import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import {
  AuthContextProps,
  AuthProviderProps,
  Credentials,
  UpdateUserProfileProps
} from './types'
import { UserDTO } from '@dtos/user'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { SignInOutputDto } from '@dtos/signIn'
import {
  storageUserSave,
  storageUserData,
  storageUserRemove
} from '@storage/storageUser'

const AuthContext = createContext({} as AuthContextProps)

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserDTO>({} as UserDTO)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)
  const [refreshedToken, setRefreshedToken] = useState('')

  const signIn = async (credentials: Credentials) => {
    try {
      const { data } = await api.post<SignInOutputDto>('/sessions', credentials)

      await storageUserSave(data)
      setUser(data.user)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    } catch (error) {
      const isAppError = error instanceof AppError
      const message = isAppError
        ? error.message
        : 'Não foi possível entrar. Tente novamente mais tarde'

      throw new AppError(message)
    }
  }

  const signOut = useCallback(async () => {
    setIsLoadingUserStorageData(true)
    setUser({} as UserDTO)
    await storageUserRemove()
    setIsLoadingUserStorageData(false)
  }, [])

  const loadingUserData = async () => {
    const data = await storageUserData()

    if (data) {
      setUser(data.user)
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    }

    setIsLoadingUserStorageData(false)
  }

  const updateUserProfile = async ({
    name,
    avatar
  }: UpdateUserProfileProps) => {
    const storageData = await storageUserData()

    if (storageData) {
      if (name) {
        storageData.user.name = name
      }

      if (avatar) {
        storageData.user.avatar = avatar
      }

      setUser(storageData.user)
      await storageUserSave(storageData)
    }
  }

  function refreshTokenUpdated(newToken: string) {
    setRefreshedToken(newToken)
  }

  useEffect(() => {
    loadingUserData()
  }, [])

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
      refreshTokenUpdated
    })

    return () => {
      subscribe()
    }
  }, [signOut])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserStorageData,
        refreshedToken,
        signIn,
        signOut,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)

  return context
}

export { AuthProvider, useAuth }
