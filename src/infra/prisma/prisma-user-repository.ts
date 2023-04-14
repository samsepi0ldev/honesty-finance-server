import { Injectable } from '@nestjs/common'
import { type Prisma } from '@prisma/client'

import { PrismaService } from '@/infra/database/prisma.service'
import { type UserRepository } from '@/data/protocol/user-repository'
import { type User } from '@/domain/entities/user'

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor (private readonly prisma: PrismaService) {}
  async findById (id: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id
      }
    })
    return user
  }

  async findUserByEmail (email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email
      }
    })
    return user
  }

  async create ({ name, email, password }: Prisma.UserCreateInput): Promise<void> {
    await this.prisma.user.create({
      data: {
        name,
        email,
        password
      }
    })
  }
}
