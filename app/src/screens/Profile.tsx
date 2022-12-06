import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import {
  ScrollView,
  VStack,
  Center,
  Skeleton,
  Text,
  Heading,
  useToast
} from 'native-base'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { ScreenHeader, UserPhoto, Input, Button } from '@components/index'
import { useAuth } from '@contexts/AuthContent'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'

import defaultUserPhotoImg from '@assets/userPhotoDefault.png'

const PHOTO_SIZE = 33

type ProfileFormData = {
  name: string
  email: string
  old_password?: string
  password?: string
  passwordConfirm?: string
}

const profileSchemaValidation = yup.object().shape({
  name: yup.string().required('Insira o nome e tente novamente'),
  old_password: yup.string(),
  password: yup.string().when('old_password', {
    is: (old_password: string) => !!old_password,
    then: yup
      .string()
      .required('Insira a nova senha e tente novamente')
      .min(6, 'A senha deve ter pelo menos 6 digitos')
  }),
  passwordConfirm: yup.string().when('old_password', {
    is: (old_password: string) => !!old_password,
    then: yup
      .string()
      .required('Confirme a senha e tente novamente')
      .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere')
  })
})

export const Profile = () => {
  const toast = useToast()
  const { user, updateUserProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [photoIsLoading, setPhotoIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchemaValidation),
    defaultValues: {
      name: user.name,
      email: user.email
    }
  })

  const handleUserPhotoSelect = async () => {
    try {
      setPhotoIsLoading(true)
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true
      })

      if (!photoSelected.canceled && photoSelected.assets.length > 0) {
        const photoUri = photoSelected.assets[0].uri
        const photoInfo = await FileSystem.getInfoAsync(photoUri)

        if (!photoInfo.exists || photoInfo.size / 1024 / 1024 > 5) {
          toast.show({
            title: 'Essa imagem é muito grande. Escolha uma imagem de até 5MB',
            placement: 'top',
            bgColor: 'red.500'
          })
        }

        const fileExtension = photoUri.split('.').pop()

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoUri,
          type: `image/${fileExtension}`
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any

        const userPhotoUploadForm = new FormData()
        userPhotoUploadForm.append('avatar', photoFile)

        const { data } = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.500'
        })

        updateUserProfile({ avatar: data.avatar })
      }
    } catch (e) {
      toast.show({
        title: 'Ocorreu um erro ao carregar a imagem, tente novamente',
        placement: 'top',
        bgColor: 'red.500'
      })

      // eslint-disable-next-line no-console
      console.log(e)
    } finally {
      setPhotoIsLoading(false)
    }
  }

  const handleProfileSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      await api.put('/users', { data })
      updateUserProfile({ name: data.name })

      toast.show({
        title: 'Dados atualizados com sucesso!',
        placement: 'top',
        bgColor: 'green.500'
      })
    } catch (error) {
      toast.show({
        title: (error as AppError).message,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bg="gray.700">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 36
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ScreenHeader title="Perfil" />

        <Center mt={6} px={10}>
          {photoIsLoading ? (
            <Skeleton
              w={PHOTO_SIZE}
              h={PHOTO_SIZE}
              rounded="full"
              startColor="gray.500"
              endColor="gray.400"
            />
          ) : (
            <UserPhoto
              source={
                user.avatar
                  ? { uri: `${api.defaults.baseURL}avatar/${user.avatar}` }
                  : defaultUserPhotoImg
              }
              alt="Erikson"
              size={PHOTO_SIZE}
            />
          )}

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text
              color="green.500"
              fontSize="md"
              fontFamily="heading"
              mt={2}
              mb={8}
            >
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nome"
                autoCorrect={false}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <Input
                isDisabled
                bg="gray.600"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />

          <Heading
            color="gray.200"
            fontSize="md"
            mb={2}
            alignSelf="flex-start"
            mt={10}
          >
            Alterar senha
          </Heading>

          <Controller
            control={control}
            name="old_password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova antiga"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.old_password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="passwordConfirm"
            render={({ field: { onChange, value } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirmar senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={onChange}
                value={value}
                // onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            title="Atualizar"
            mt={4}
            isLoading={isLoading}
            disabled={isLoading}
            onPress={handleSubmit(handleProfileSubmit)}
          />
        </Center>
      </ScrollView>
    </VStack>
  )
}
