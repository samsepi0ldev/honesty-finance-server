export abstract class Hasher {
  abstract hash (plaintext: string): Promise<string>
  abstract compare (plaintext: string, digest: string): Promise<boolean>
}
