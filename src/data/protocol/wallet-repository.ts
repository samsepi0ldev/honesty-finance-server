import { type CreateWalletDTO } from '@/application/contracts'
import { type Wallet } from '@/domain/entities/wallet'
import { type Prisma } from '@prisma/client'

export abstract class WalletRepository {
  abstract create (input: WalletRepository.Input): Promise<void>
  abstract listAll (input: { user_id: string }): Promise<WalletRepository.Output>
  abstract update (input: Prisma.WalletUpdateInput): Promise<void>
  abstract delete (input: { id: string }): Promise<void>
}

export namespace WalletRepository {
  export type Input = CreateWalletDTO
  export type Output = {
    account_balance: number
    wallets: Array<Wallet & { wallet_balance: number }>
  }
}
