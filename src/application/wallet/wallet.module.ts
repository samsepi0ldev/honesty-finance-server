import { Module } from '@nestjs/common'

import { WalletController } from '@/application/wallet/wallet.controller'
import { WalletService } from '@/data/wallet.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [
    DatabaseModule,
    UserModule
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService]
})
export class WalletModule {}
