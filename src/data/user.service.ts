import { Injectable } from '@nestjs/common'
import { type Prisma } from '@prisma/client'

import { UserRepository } from '@/data/protocol/user-repository'
import { Hasher } from '@/data/protocol/hasher'

@Injectable()
export class UserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly hasher: Hasher
  ) {}

  async create ({ email, name, password }: Prisma.UserCreateInput) {
    const hashPasswd = await this.hasher.hash(password)
    await this.userRepository.create({
      name,
      email,
      password: hashPasswd
    })
  }

  async findOne ({ email }: { email: string }) {
    const user = await this.userRepository.findUserByEmail(email)
    return user
  }

  async findById ({ id }: { id: string }) {
    const user = await this.userRepository.findById(id)
    return user
  }
}
