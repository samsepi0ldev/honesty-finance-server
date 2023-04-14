import { Module } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { UserModule } from '@/application/user/user.module'
import { AuthModule } from '@/application/auth/auth.module'
import { WalletModule } from '@/application/wallet/wallet.module'
import { TransactionModule } from '@/application/transaction/transaction.module'

@Module({
  imports: [
    UserModule,
    AuthModule,
    WalletModule,
    TransactionModule,
    DatabaseModule
  ]
})
export class AppModule {}
