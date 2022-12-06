import { UserDTO } from './user'

export type SignInOutputDto = {
  token: string
  user: UserDTO
}
