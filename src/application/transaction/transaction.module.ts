import { Module } from '@nestjs/common'

import { TransactionController } from '@/application/transaction/transaction.controller'
import { TransactionService } from '@/data/transaction.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { UserModule } from '@/application/user/user.module'

@Module({
  imports: [
    DatabaseModule,
    UserModule
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService]
})
export class TransactionModule {}
