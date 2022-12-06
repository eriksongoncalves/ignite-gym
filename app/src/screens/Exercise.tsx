import { useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons'
import {
  VStack,
  Icon,
  HStack,
  Heading,
  Image,
  Box,
  Text,
  useToast
} from 'native-base'

import BodySvg from '@assets/body.svg'
import SeriesSvg from '@assets/series.svg'
import RepetitionsSvg from '@assets/repetitions.svg'
import { Button } from '@components/index'
import { ExerciseDto } from '@dtos/exercise'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

type RouteParams = {
  exercise: ExerciseDto
}

export const Exercise = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const route = useRoute()
  const { exercise } = route.params as RouteParams
  const [isLoading, setIsLoading] = useState(false)

  const handleGoBack = () => {
    navigation.goBack()
  }

  const handleExerciseHistoryRegister = async () => {
    try {
      setIsLoading(true)
      await api.post('/history', { exercise_id: exercise.id })

      toast.show({
        title: 'Parabéns! Exercício registrado no seu histórico',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigation.navigate('History')
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
      <VStack px={8} bg="gray.600" pt={16}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>

        <HStack
          justifyContent="space-between"
          mt={4}
          mb={8}
          alignItems="center"
        >
          <Heading
            color="gray.100"
            fontSize="lg"
            fontFamily="heading"
            flexShrink={1}
          >
            {exercise.name}
          </Heading>

          <HStack alignItems="center">
            <BodySvg />

            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>

      <VStack p={8}>
        <Box rounded="lg" mb={3} overflow="hidden">
          <Image
            w="full"
            h={80}
            source={{
              uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`
            }}
            alt={exercise.name}
            resizeMode="cover"
          />
        </Box>

        <Box bg="gray.600" rounded="md" pb={4} px={4}>
          <HStack
            alignItems="center"
            justifyContent="space-around"
            mb={6}
            mt={5}
          >
            <HStack>
              <SeriesSvg />
              <Text color="gray.200" ml={2}>
                {exercise.series} séries
              </Text>
            </HStack>
            <HStack>
              <RepetitionsSvg />
              <Text color="gray.200" ml={2}>
                {exercise.repetitions} repetições
              </Text>
            </HStack>
          </HStack>

          <Button
            title="Marcar como realizado"
            isLoading={isLoading}
            disabled={isLoading}
            onPress={handleExerciseHistoryRegister}
          />
        </Box>
      </VStack>
    </VStack>
  )
}
