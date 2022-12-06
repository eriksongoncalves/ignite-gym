import React, { useState, useEffect, useCallback } from 'react'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { VStack, FlatList, HStack, Heading, Text, useToast } from 'native-base'

import { HomeHeader, Group, ExerciseCard, Loading } from '@components/index'
import { AppNavigatorRoutesProps } from '@routes/app.routes'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDto } from '@dtos/exercise'

export const Home = () => {
  const navigation = useNavigation<AppNavigatorRoutesProps>()
  const toast = useToast()
  const [groups, setGroups] = useState<string[]>([])
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [groupSelected, setGroupSelected] = useState<string>('Costas')
  const [isLoading, setIsLoading] = useState(true)

  const handleGroupSelected = (group: string) => {
    setGroupSelected(group)
  }

  const handleOpenExerciseDetails = (exercise: ExerciseDto) => {
    navigation.navigate('Exercise', { exercise })
  }

  const fetchGroups = async () => {
    try {
      const { data } = await api.get<string[]>('/groups')
      setGroups(data)
      setGroupSelected(data[0])
    } catch (error) {
      toast.show({
        title: (error as AppError).message,
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  const fetchExerciseByGroup = async () => {
    try {
      setIsLoading(true)
      const { data } = await api.get<ExerciseDto[]>(
        `/exercises/bygroup/${groupSelected}`
      )
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

  useEffect(() => {
    fetchGroups()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useFocusEffect(
    useCallback(() => {
      fetchExerciseByGroup()
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [groupSelected])
  )

  return (
    <VStack flex={1} bg="gray.700">
      <HomeHeader />

      {isLoading ? (
        <Loading />
      ) : (
        <VStack flex={1} px={8}>
          <FlatList
            data={groups}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <Group
                name={item}
                onPress={() => handleGroupSelected(item)}
                isActive={groupSelected === item}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            my={10}
            maxH={10}
          />

          <HStack justifyContent="space-between" mb={5}>
            <Heading color="gray.200" fontSize="md">
              Exercícios
            </Heading>

            <Text color="gray.200" fontSize="sm">
              {exercises.length}
            </Text>
          </HStack>

          <FlatList
            data={exercises}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ExerciseCard
                data={item}
                onPress={() => handleOpenExerciseDetails(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ paddingBottom: 20 }}
          />
        </VStack>
      )}
    </VStack>
  )
}
