import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common'

import { LoginDTO } from '@/application/contracts'
import { AuthService } from '@/application/auth/auth.service'
import { AuthGuard } from './auth.guard'

@Controller('auth')
export class AuthController {
  constructor (private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn (@Body() { email, password }: LoginDTO) {
    const token = await this.authService.signIn({ email, password })
    return token
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('profile')
  async profile (@Request() req) {}
}
