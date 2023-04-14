import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Param,
  Delete
} from '@nestjs/common'

import { WalletService } from '@/data/wallet.service'
import { type CreateWalletDTO } from '@/application/contracts'
import { AuthGuard } from '@/application/auth/auth.guard'

@Controller('wallets')
export class WalletController {
  constructor (
    private readonly walletService: WalletService
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('create')
  async create (@Request() req, @Body() { name, account_type, value }: Omit<CreateWalletDTO, 'user_id'>) {
    await this.walletService.create({
      name,
      account_type,
      user_id: req.user.user_id,
      value
    })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('list')
  async list (@Request() req) {
    const { user_id } = req.user
    const walletsModel = await this.walletService.listAll({ user_id })
    return walletsModel
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id/edit')
  async edit (@Param() params, @Body() body) {
    const id = params.id
    await this.walletService.update({ id, ...body })
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id/delete')
  async delete (@Param() params) {
    const id = params.id
    await this.walletService.delete({ id })
  }
}
