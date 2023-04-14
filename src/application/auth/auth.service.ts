import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@/data/user.service'
import { type LoginDTO } from '@/application/contracts'
import { Hasher } from '@/data/protocol/hasher'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor (
    private readonly userService: UserService,
    private readonly hasher: Hasher,
    private readonly jwtService: JwtService
  ) {}

  async signIn ({ email, password }: LoginDTO): Promise<any> {
    const user = await this.userService.findOne({ email })
    const isValid = await this.hasher.compare(password, user.password)
    if (!isValid) {
      throw new UnauthorizedException()
    }
    const payload = { email: user.email, sub: user.id }
    const access_token = await this.jwtService.signAsync(payload)
    return { access_token }
  }
}
