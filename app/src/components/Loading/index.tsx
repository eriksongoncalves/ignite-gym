import React from 'react'
import { Spinner, Center } from 'native-base'

export const Loading = () => {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color="green.700" />
    </Center>
  )
}
