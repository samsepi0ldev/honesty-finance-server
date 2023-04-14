import { type Prisma } from '@prisma/client'

import { type CreateTransactionDTO } from '@/application/contracts'
import { type Transaction } from '@/domain/entities/transaction'

export abstract class TransactionRepository {
  abstract create (input: TransactionRepository.Input): Promise<void>
  abstract listAll ({ user_id }: { user_id: string }): Promise<TransactionRepository.Output>
  abstract deleteById ({ id }: { id: string }): Promise<void>
  abstract updateById (input: Prisma.TransactionUncheckedUpdateInput): Promise<void>
  abstract getBilling (input: { user_id: string }): Promise<{
    account_balance: number
    income: number
    expense: number
  }>
  abstract getBillingByCategory (input: { user_id: string, date: Date }): Promise<Array<{
    category: string
    balance_category: number
    percent_billing: number
  }>>
  abstract getDates (input: { user_id: string }): Promise<{
    dates: Array<{
      label: string
      date: string
    }>
  }>
  abstract getByWallet (input: { wallet_id: string, user_id: string }): Promise<{
    wallet_balance: number
    transactions: Transaction[]
  }>
}

export namespace TransactionRepository {
  export type Input = CreateTransactionDTO
  export type Output = {
    transactions: Transaction[]
  }
}
