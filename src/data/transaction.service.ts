import { Injectable } from '@nestjs/common'
import { type Prisma } from '@prisma/client'

import { TransactionRepository } from '@/data/protocol/transaction-repository'
import { type CreateTransactionDTO } from '@/application/contracts'

type TransactionByCategory = {
  user_id: string
  date: Date
}

@Injectable()
export class TransactionService {
  constructor (private readonly transactionRepository: TransactionRepository) {}

  async create (input: CreateTransactionDTO) {
    await this.transactionRepository.create(input)
  }

  async transactions ({ user_id }: { user_id: string }) {
    return await this.transactionRepository.listAll({ user_id })
  }

  async deleteTransaction ({ id }: { id: string }) {
    await this.transactionRepository.deleteById({ id })
  }

  async updateTransaction (input: Prisma.TransactionUncheckedUpdateInput) {
    await this.transactionRepository.updateById(input)
  }

  async getBillingAccount ({ user_id }: { user_id: string }) {
    const billingModel = await this.transactionRepository.getBilling({ user_id })
    return billingModel
  }

  async getBillingTransactionsByCategory (input: TransactionByCategory) {
    const transactions = await this.transactionRepository.getBillingByCategory(input)
    return transactions
  }

  async getTransactionsDates (input: { user_id: string }) {
    const dates = await this.transactionRepository.getDates(input)
    return dates
  }

  async getTransactionsByWallet ({ id, user_id }: { user_id: string, id: string }) {
    const transactions = await this.transactionRepository.getByWallet({
      wallet_id: id,
      user_id
    })
    return transactions
  }
}
