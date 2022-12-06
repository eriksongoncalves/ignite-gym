import React, { useState } from 'react'
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast
} from 'native-base'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import bgImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input, Button } from '@components/index'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { useAuth } from '@contexts/AuthContent'

type SignUpFormData = {
  name: string
  email: string
  password: string
  passwordConfirm: string
}

const signUpSchemaValidation = yup.object().shape({
  name: yup.string().required('Insira o nome e tente novamente'),
  email: yup
    .string()
    .required('Insira o e-mail e tente novamente')
    .email('E-mail inválido'),
  password: yup
    .string()
    .required('Insira a senha e tente novamente')
    .min(6, 'A senha deve ter pelo menos 6 digitos'),
  passwordConfirm: yup
    .string()
    .required('Confirme a senha e tente novamente')
    .oneOf([yup.ref('password'), null], 'A confirmação da senha não confere')
})

export const SignUp = () => {
  const navigation = useNavigation()
  const toast = useToast()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignUpFormData>({ resolver: yupResolver(signUpSchemaValidation) })

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleSignUp = async (formData: SignUpFormData) => {
    try {
      setIsLoading(true)
      await api.post('/users', formData)
      await signIn({ email: formData.email, password: formData.password })

      toast.show({
        title: 'Conta criada com sucesso!',
        placement: 'top',
        bgColor: 'greem.500'
      })
    } catch (error) {
      const isAppError = error instanceof AppError
      const title = isAppError
        ? error.message
        : 'Não foi possível criar a conta. Tente novamente mais tarde'

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1
      }}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} bg="gray.700" px={10} pb={16}>
        <Image
          source={bgImg}
          defaultSource={bgImg}
          alt="Ignite Gym"
          resizeMode="contain"
          position="absolute"
        />

        <Center my={24}>
          <LogoSvg />

          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
            Crie a sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value } }) => (
              <Input
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

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Senha"
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
                placeholder="Confirme a senha"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
                onChangeText={onChange}
                value={value}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.passwordConfirm?.message}
              />
            )}
          />

          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            disabled={isLoading}
            isLoading={isLoading}
          />

          <Button
            mt={24}
            title="Voltar para o login"
            variant="outline"
            onPress={handleGoBack}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
