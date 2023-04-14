import { Injectable } from '@nestjs/common'
import { type Prisma } from '@prisma/client'
import * as dayjs from 'dayjs'
import 'dayjs/locale/pt-br'

import { type CreateTransactionDTO } from '@/application/contracts'
import { type TransactionRepository } from '@/data/protocol/transaction-repository'
import { PrismaService } from '@/infra/database/prisma.service'
import { type Transaction } from '@/domain/entities/transaction'

dayjs.locale('pt-br')

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor (private readonly prisma: PrismaService) { }
  async getByWallet ({ user_id, wallet_id }: { wallet_id: string, user_id: string }): Promise<{ wallet_balance: number, transactions: Transaction[] }> {
    const walletBallanceModel = await this.prisma.transaction.aggregate({
      where: { wallet_id, user_id },
      _sum: {
        value: true
      }
    })
    const transactions = await this.prisma.transaction.findMany({
      where: { wallet_id, user_id },
      select: {
        id: true,
        category: true,
        description: true,
        type: true,
        value: true,
        attachment: true,
        wallet: {
          select: {
            name: true
          }
        },
        created_at: true
      }
    })
    const wallet_balance = walletBallanceModel._sum.value ?? 0
    return {
      wallet_balance,
      transactions
    }
  }

  async getDates ({ user_id }: { user_id: string }): Promise<{ dates: Array<{ label: string, date: string }> }> {
    const dates = await this.prisma.transaction.groupBy({
      by: ['created_at'],
      where: { user_id }
    })
    const datesModel = dates.length
      ? dates.map(date => ({
        label: dayjs(date.created_at).format('YYYY-MMM'),
        date: dayjs(date.created_at).startOf('month').format('YYYY-MM-DD')
      }))
      : [{
          label: dayjs().format('YYYY-MMM'),
          date: dayjs().format('YYYY-MM-DD')
        }]
    const uniqueDates = datesModel.filter((date, index, self) =>
      index === self.findIndex((d) => (
        d.label === date.label && d.date === date.date
      ))
    )
    return {
      dates: uniqueDates
    }
  }

  async getBillingByCategory ({ date, user_id }: { user_id: string, date: Date }): Promise<Array<{ category: string, balance_category: number, percent_billing: number }>> {
    const parseDate = dayjs(Number(date))
    const firstDayOfMonth = parseDate.startOf('month').toDate()
    const lastDayOfMonth = parseDate.endOf('month').toDate()

    const totalAmount = await this.prisma.transaction.aggregate({
      where: {
        user_id,
        created_at: {
          lt: lastDayOfMonth,
          gte: firstDayOfMonth
        }
      },
      _sum: {
        value: true
      }
    })

    const transactions = await this.prisma.transaction.groupBy({
      by: ['category'],
      where: {
        user_id,
        created_at: {
          lt: lastDayOfMonth,
          gte: firstDayOfMonth
        }
      },
      _sum: {
        value: true
      }
    })

    const data = transactions.map(transaction => {
      return {
        category: transaction.category,
        balance_category: transaction._sum.value,
        percent_billing: Number(((transaction._sum.value * 100) / totalAmount._sum.value).toFixed(1))
      }
    })

    return data
  }

  async getBilling ({ user_id }: { user_id: string }): Promise<{ account_balance: number, income: number, expense: number }> {
    const income = await this.prisma.transaction.aggregate({
      where: { user_id, type: 'income' },
      _sum: {
        value: true
      }
    })
    const expense = await this.prisma.transaction.aggregate({
      where: { user_id, type: 'expense' },
      _sum: {
        value: true
      }
    })
    const billing = {
      income: income._sum.value ?? 0,
      expense: expense._sum.value ?? 0,
      account_balance: (income._sum.value ?? 0) + (expense._sum.value ?? 0)
    }
    return billing
  }

  async updateById ({ id, user_id, ...data }: Prisma.TransactionUncheckedUpdateInput): Promise<void> {
    const transactionId = id as string
    await this.prisma.transaction.update({
      where: { id: transactionId },
      data
    })
  }

  async deleteById ({ id }: { id: string }): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } })
  }

  async listAll ({ user_id }: { user_id: string }): Promise<TransactionRepository.Output> {
    const transactions = await this.prisma.transaction.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        category: true,
        description: true,
        attachment: true,
        created_at: true,
        value: true,
        type: true,
        wallet: {
          select: {
            name: true
          }
        }
      }
    })
    return { transactions }
  }

  async create (data: CreateTransactionDTO): Promise<void> {
    await this.prisma.transaction.create({ data })
  }
}
