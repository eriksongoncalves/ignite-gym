import React from 'react'
import { TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { Text, HStack, VStack, Image, Heading, Icon } from 'native-base'

import { Entypo } from '@expo/vector-icons'
import { ExerciseDto } from '@dtos/exercise'
import { api } from '@services/api'

type ExerciseCardProps = TouchableOpacityProps & {
  data: ExerciseDto
}

export const ExerciseCard = ({ data, ...rest }: ExerciseCardProps) => {
  return (
    <TouchableOpacity {...rest}>
      <HStack
        bg="gray.500"
        alignItems="center"
        p={2}
        pr={4}
        rounded="md"
        mb={3}
      >
        <Image
          source={{
            uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`
          }}
          alt={data.name}
          w={16}
          h={16}
          rounded="md"
          mr={4}
          resizeMode="center"
        />

        <VStack flex={1}>
          <Heading fontSize="lg" color="white">
            {data.name}
          </Heading>

          <Text fontSize="sm" color="gray.200" mt={1} numberOfLines={2}>
            {data.series} séries x {data.repetitions} repetições
          </Text>
        </VStack>

        <Icon as={Entypo} name="chevron-thin-right" color="gray.300" />
      </HStack>
    </TouchableOpacity>
  )
}
