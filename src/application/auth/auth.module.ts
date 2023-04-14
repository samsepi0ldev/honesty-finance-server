import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

import { UserModule } from '@/application/user/user.module'
import { jwtConstants } from '@/application/auth/constants'
import { AuthService } from '@/application/auth/auth.service'
import { AuthController } from '@/application/auth/auth.controller'
import { Hasher } from '@/data/protocol/hasher'
import { BcryptService } from '@/infra/cryptography/hasher-adapter'

@Module({
  imports: [UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30d' }
    })
  ],
  providers: [AuthService,
    {
      provide: Hasher,
      useClass: BcryptService
    }],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
