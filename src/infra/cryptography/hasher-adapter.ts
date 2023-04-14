import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { type Hasher } from '@/data/protocol/hasher'

@Injectable()
export class BcryptService implements Hasher {
  private readonly salt = 12

  async hash (plaintext: string): Promise<string> {
    const hash = await bcrypt.hash(plaintext, this.salt)
    return hash
  }

  async compare (plaintext: string, digest: string): Promise<boolean> {
    return await bcrypt.compare(plaintext, digest)
  }
}
