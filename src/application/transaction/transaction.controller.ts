import { TransactionService } from '@/data/transaction.service'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common'

import { AuthGuard } from '@/application/auth/auth.guard'
import { type CreateTransactionDTO } from '@/application/contracts'
import { type Transaction } from '@/domain/entities/transaction'

@Controller()
export class TransactionController {
  constructor (
    private readonly transactionService: TransactionService
  ) {}

  @UseGuards(AuthGuard)
  @Post('transactions')
  @HttpCode(HttpStatus.CREATED)
  async create (@Request() req, @Body() body: Omit<CreateTransactionDTO, 'user_id'>) {
    const { user_id } = req.user
    await this.transactionService.create({
      ...body,
      user_id
    })
  }

  @UseGuards(AuthGuard)
  @Get('transactions')
  async getTransactions (@Request() req) {
    const { user_id } = req.user
    const transactions = await this.transactionService.transactions({ user_id })
    return transactions
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('transaction/:id')
  async updateTransaction (@Param() param, @Request() req, @Body() body: Partial<Omit<Transaction, 'id'>>) {
    const id = param.id
    const user_id = req.user.user_id
    await this.transactionService.updateTransaction({
      id,
      user_id,
      ...body
    })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('transaction/:id')
  async deleteTransaction (@Param() param: { id: string }) {
    const id = param.id
    await this.transactionService.deleteTransaction({ id })
  }

  @UseGuards(AuthGuard)
  @Get('transactions/billing-details')
  async billingDetails (@Request() req) {
    const billingModel = await this.transactionService.getBillingAccount({ user_id: req.user.user_id })
    return billingModel
  }

  @UseGuards(AuthGuard)
  @Get('category/transactions')
  async getTransactionsByCategory (@Request() req, @Query() query) {
    const transactions = await this.transactionService.getBillingTransactionsByCategory({
      user_id: req.user.user_id,
      date: query.date
    })
    return transactions
  }

  @UseGuards(AuthGuard)
  @Get('transactions/dates')
  async getTransactionsDates (@Request() req) {
    const dates = await this.transactionService.getTransactionsDates({
      user_id: req.user.user_id
    })
    return dates
  }

  @UseGuards(AuthGuard)
  @Get('wallet/:id/transactions')
  async getTransactionsByWallet (@Request() req, @Param() params) {
    const transactions = await this.transactionService.getTransactionsByWallet({
      user_id: req.user.user_id,
      id: params.id
    })
    return transactions
  }
}
