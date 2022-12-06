import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Heading, HStack, VStack, Text, Icon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

import { UserPhoto } from '@components/UserPhoto'
import { useAuth } from '@contexts/AuthContent'
import defaultUserPhotoImg from '@assets/userPhotoDefault.png'
import { api } from '@services/api'

export const HomeHeader = () => {
  const { user, signOut } = useAuth()

  return (
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={
          user.avatar
            ? { uri: `${api.defaults.baseURL}avatar/${user.avatar}` }
            : defaultUserPhotoImg
        }
        alt={user.name}
        size={16}
        mr={4}
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,{' '}
        </Text>
        <Heading color="gray.100" fontSize="md">
          {user.name}
        </Heading>
      </VStack>

      <TouchableOpacity onPress={signOut}>
        <Icon as={MaterialIcons} name="logout" color="gray.200" size={7} />
      </TouchableOpacity>
    </HStack>
  )
}
