import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { type Request } from 'express'

import { jwtConstants } from '@/application/auth/constants'
import { UserService } from '@/data/user.service'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async canActivate (context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(
        token,
        {
          secret: jwtConstants.secret
        }
      )
      const user = await this.userService.findById({ id: payload.sub })
      if (user === null) {
        throw new UnauthorizedException()
      }
      request.user = { user_id: user.id }
    } catch {
      throw new UnauthorizedException()
    }
    return true
  }

  private extractTokenFromHeader (request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
