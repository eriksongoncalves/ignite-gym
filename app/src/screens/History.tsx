import { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import {
  Heading,
  VStack,
  SectionList,
  Text,
  useToast,
  Center
} from 'native-base'

import { ScreenHeader, HistoryCard, Loading } from '@components/index'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { HistoryByDayDto } from '@dtos/history'
import { useAuth } from '@contexts/AuthContent'

export const History = () => {
  const toast = useToast()
  const { refreshedToken } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [exercises, setExercises] = useState<HistoryByDayDto[]>([])

  const fetchHistory = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get('/history')
      setExercises(data)
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

  useFocusEffect(
    useCallback(() => {
      fetchHistory()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshedToken])
  )

  return (
    <VStack flex={1} bg="gray.700">
      <ScreenHeader title="Histórico de Exercícios" />

      {isLoading ? (
        <Loading />
      ) : exercises?.length > 0 ? (
        <SectionList
          sections={exercises}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <HistoryCard data={item} />}
          renderSectionHeader={({ section }) => (
            <Heading
              color="gray.200"
              fontFamily="heading"
              fontSize="md"
              mt={10}
              mb={3}
            >
              {section.title}
            </Heading>
          )}
          ListEmptyComponent={() => (
            <Text color="gray.100" textAlign="center">
              Não há exercícios registrados ainda. {'\n'}
              Vamos fazer exercícios hoje?
            </Text>
          )}
          contentContainerStyle={
            exercises.length === 0 && { flex: 1, justifyContent: 'center' }
          }
          px={8}
        />
      ) : (
        <Center flex={1}>
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        </Center>
      )}
    </VStack>
  )
}
