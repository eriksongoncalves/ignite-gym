import React from 'react'
import { Heading, Center } from 'native-base'

type ScreenHeaderProps = {
  title: string
}

export const ScreenHeader = ({ title }: ScreenHeaderProps) => {
  return (
    <Center bg="gray.600" pb={6} pt={16}>
      <Heading color="gray.100" fontSize="xl">
        {title}
      </Heading>
    </Center>
  )
}
