import { useAuth } from '@contexts/AuthContent'
import { NavigationContainer } from '@react-navigation/native'

import { AppRoutes } from './app.routes'
import { AuthRoutes } from './auth.routes'
import { Loading } from '@components/Loading'

export const Routes = () => {
  const { user, isLoadingUserStorageData } = useAuth()

  return isLoadingUserStorageData ? (
    <Loading />
  ) : (
    <NavigationContainer>
      {user?.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  )
}
