import { Injectable } from '@nestjs/common'

import { WalletRepository } from '@/data/protocol/wallet-repository'
import { type CreateWalletDTO } from '@/application/contracts'
import { type Prisma } from '@prisma/client'

@Injectable()
export class WalletService {
  constructor (
    private readonly walletRepository: WalletRepository
  ) {}

  async create (input: CreateWalletDTO) {
    await this.walletRepository.create(input)
  }

  async listAll ({ user_id }: { user_id: string }) {
    const walletsModel = await this.walletRepository.listAll({ user_id })
    return walletsModel
  }

  async update (input: Prisma.WalletUpdateInput) {
    await this.walletRepository.update(input)
  }

  async delete ({ id }: { id: string }) {
    await this.walletRepository.delete({ id })
  }
}
