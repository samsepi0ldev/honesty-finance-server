import { Module } from '@nestjs/common'

import { UserRepository } from '@/data/protocol/user-repository'
import { PrismaUserRepository } from '@/infra/prisma/prisma-user-repository'
import { PrismaService } from '@/infra/database/prisma.service'
import { WalletRepository } from '@/data/protocol/wallet-repository'
import { PrismaWalletRepository } from '@/infra/prisma/prisma-wallet-repository'
import { TransactionRepository } from '@/data/protocol/transaction-repository'
import { PrismaTransactionRepository } from '@/infra/prisma/prisma-transaction-repository'

@Module({
  providers: [PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository
    },
    {
      provide: WalletRepository,
      useClass: PrismaWalletRepository
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository
    }
  ],
  exports: [
    UserRepository,
    WalletRepository,
    TransactionRepository
  ]
})
export class DatabaseModule {}
