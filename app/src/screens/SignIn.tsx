import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  VStack,
  Image,
  Text,
  Center,
  Heading,
  ScrollView,
  useToast
} from 'native-base'

import bgImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Input, Button } from '@components/index'
import { AuthNavigatorRoutesProps } from '@routes/auth.routes'
import { useAuth } from '@contexts/AuthContent'
import { AppError } from '@utils/AppError'

type SignInFormData = {
  email: string
  password: string
}

const signInSchemaValidation = yup.object().shape({
  email: yup
    .string()
    .required('Insira o e-mail e tente novamente')
    .email('E-mail inválido'),
  password: yup
    .string()
    .required('Insira a senha e tente novamente')
    .min(6, 'A senha deve ter pelo menos 6 digitos')
})

export const SignIn = () => {
  const toast = useToast()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const navigation = useNavigation<AuthNavigatorRoutesProps>()
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<SignInFormData>({ resolver: yupResolver(signInSchemaValidation) })

  const handleNavigateToNewAccount = () => {
    navigation.navigate('SignUp')
  }

  const handleSignIn = async (data: SignInFormData) => {
    try {
      setIsLoading(true)
      await signIn(data)
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
          alt=""
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
            Treine sua mente e o seu corpo
          </Heading>

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
                onSubmitEditing={handleSubmit(handleSignIn)}
                returnKeyType="send"
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            disabled={isLoading}
            isLoading={isLoading}
          />
        </Center>

        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>

          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleNavigateToNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}
