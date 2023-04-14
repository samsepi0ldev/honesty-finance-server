import { Body, Controller, Post } from '@nestjs/common'

import { UserService } from '@/data/user.service'
import { SignUpDTO } from '@/application/contracts'

@Controller()
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Post('sign-up')
  async create (@Body() body: SignUpDTO) {
    await this.userService.create({
      name: body.name,
      email: body.email,
      password: body.password
    })
  }
}
