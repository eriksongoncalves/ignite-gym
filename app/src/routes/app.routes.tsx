import { Platform } from 'react-native'
import { useTheme } from 'native-base'
import {
  createBottomTabNavigator,
  BottomTabNavigationProp
} from '@react-navigation/bottom-tabs'

import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Home } from '@screens/Home'
import { Profile } from '@screens/Profile'

import HomeSvg from '@assets/home.svg'
import HistorySvg from '@assets/history.svg'
import ProfileSvg from '@assets/profile.svg'
import { ExerciseDto } from '@dtos/exercise'

type AppRoutes = {
  Home: undefined
  Exercise: {
    exercise: ExerciseDto
  }
  History: undefined
  Profile: undefined
}

export type AppNavigatorRoutesProps = BottomTabNavigationProp<AppRoutes>

const { Navigator, Screen } = createBottomTabNavigator<AppRoutes>()

export const AppRoutes = () => {
  const { sizes, colors } = useTheme()
  const isPlatformIOS = Platform.OS === 'ios'

  const iconSize = sizes[6]

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.green[500],
        tabBarInactiveTintColor: colors.gray[200],
        tabBarStyle: {
          backgroundColor: colors.gray[600],
          borderTopWidth: 0,
          height: isPlatformIOS ? 96 : 'auto',
          paddingBottom: sizes[10],
          paddingTop: sizes[6]
        }
      }}
    >
      <Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <HomeSvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />

      <Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color }) => (
            <HistorySvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />
      <Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color }) => (
            <ProfileSvg fill={color} width={iconSize} height={iconSize} />
          )
        }}
      />

      <Screen
        name="Exercise"
        component={Exercise}
        options={{
          tabBarButton: () => null
        }}
      />
    </Navigator>
  )
}
