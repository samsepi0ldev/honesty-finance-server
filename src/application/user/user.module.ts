import { Module } from '@nestjs/common'

import { UserController } from '@/application/user/user.controller'
import { UserService } from '@/data/user.service'
import { DatabaseModule } from '@/infra/database/database.module'
import { Hasher } from '@/data/protocol/hasher'
import { BcryptService } from '@/infra/cryptography/hasher-adapter'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../auth/constants'

@Module({
  imports: [DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })],
  controllers: [UserController],
  providers: [UserService,
    {
      provide: Hasher,
      useClass: BcryptService
    }
  ],
  exports: [UserService]
})
export class UserModule {}
