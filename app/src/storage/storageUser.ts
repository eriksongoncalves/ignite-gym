import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_STORAGE } from './storageConfig'
import { SignInOutputDto } from '@dtos/signIn'

const storageUserSave = async (data: SignInOutputDto) => {
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(data))
}

const storageUserData = async () => {
  const storage = await AsyncStorage.getItem(USER_STORAGE)

  if (storage) {
    return JSON.parse(storage) as SignInOutputDto
  }

  return undefined
}

const storageUserRemove = async () => {
  return await AsyncStorage.removeItem(USER_STORAGE)
}

export { storageUserSave, storageUserData, storageUserRemove }
