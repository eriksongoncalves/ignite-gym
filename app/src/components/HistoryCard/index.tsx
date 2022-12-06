import React from 'react'
import { Text, HStack, VStack, Heading } from 'native-base'

import { HistoryDto } from '@dtos/history'

type HistoryCardProps = {
  data: HistoryDto
}

export const HistoryCard = ({ data }: HistoryCardProps) => {
  return (
    <HStack
      w="full"
      px={5}
      py={4}
      mb={3}
      bg="gray.600"
      rounded="md"
      alignItems="center"
      justifyContent="center"
    >
      <VStack flex={1}>
        <Heading fontSize="sm" color="white" textTransform="capitalize">
          {data.group}
        </Heading>

        <Text fontSize="lg" color="gray.100" numberOfLines={1}>
          {data.name}
        </Text>
      </VStack>

      <Text fontSize="md" color="gray.300">
        {Intl.DateTimeFormat('pt-BR', {
          hour: 'numeric',
          minute: 'numeric'
        }).format(new Date(data.created_at))}
      </Text>
    </HStack>
  )
}
