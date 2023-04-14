import { type Prisma } from '@prisma/client'

import { type User } from '@/domain/entities/user'

export abstract class UserRepository {
  abstract create (input: Prisma.UserCreateInput): Promise<void>
  abstract findUserByEmail (email: string): Promise<User>
  abstract findById (id: string): Promise<User>
}
