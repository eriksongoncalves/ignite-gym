import React from 'react'
import { Text, Pressable, IPressableProps } from 'native-base'

type GroupProps = IPressableProps & {
  name: string
  onPress: () => void
  isActive?: boolean
}

export const Group = ({ name, isActive, onPress, ...rest }: GroupProps) => {
  return (
    <Pressable
      mr={3}
      w={24}
      h={10}
      bg="gray.600"
      rounded="md"
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
      isPressed={isActive}
      _pressed={{
        borderColor: 'green.500',
        borderWidth: 1
      }}
      onPress={onPress}
      {...rest}
    >
      <Text
        color={isActive ? 'green.500' : 'gray.200'}
        fontFamily="body"
        fontSize="xs"
        fontWeight="bold"
        textTransform="uppercase"
      >
        {name}
      </Text>
    </Pressable>
  )
}
