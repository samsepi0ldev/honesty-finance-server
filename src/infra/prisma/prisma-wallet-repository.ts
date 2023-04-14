import { Injectable } from '@nestjs/common'

import { type WalletRepository } from '@/data/protocol/wallet-repository'
import { type CreateWalletDTO } from '@/application/contracts'
import { PrismaService } from '@/infra/database/prisma.service'
import { type Wallet } from '@/domain/entities/wallet'

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor (private readonly prisma: PrismaService) {}

  async delete ({ id }: { id: string }): Promise<void> {
    await this.prisma.transaction.deleteMany({
      where: {
        wallet_id: id
      }
    })
    await this.prisma.wallet.delete({ where: { id } })
  }

  async update ({ id, ...data }: Partial<Wallet>): Promise<void> {
    await this.prisma.wallet.update({
      where: { id },
      data
    })
  }

  async listAll ({ user_id }: { user_id: string }): Promise<WalletRepository.Output> {
    const transactionsValue = await this.prisma.transaction.findMany({
      where: { user_id },
      select: {
        value: true
      }
    })

    const walletsData = await this.prisma.wallet.findMany({
      where: { user_id },
      select: {
        id: true,
        name: true,
        account_type: true,
        transactions: true
      }
    })
    const account_balance = transactionsValue.reduce((acc, cur) => {
      acc += cur.value
      return acc
    }, 0)

    const wallets = walletsData.map(({ transactions, ...wallet }) => {
      return {
        ...wallet,
        wallet_balance: transactions.reduce((acc, cur) => {
          acc += cur.value
          return acc
        }, 0)
      }
    })

    return {
      account_balance,
      wallets
    }
  }

  async create ({ name, account_type, user_id, value }: CreateWalletDTO): Promise<void> {
    await this.prisma.wallet.create({
      data: {
        name,
        account_type,
        user_id,
        transactions: {
          create: value > 0
            ? {
                category: 'Deposito',
                description: 'Deposito inicial',
                type: 'income',
                value,
                user: {
                  connect: {
                    id: user_id
                  }
                }
              }
            : undefined
        }
      }
    })
  }
}
