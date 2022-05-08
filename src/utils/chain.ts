import SHA256 from 'crypto-js/sha256'

import { ec as EC } from 'elliptic'
import { v1 as uuidV1 } from 'uuid'

const ec = new EC('secp256k1')

export class ChainUtil {
  static genKeyPair() {
    return ec.genKeyPair()
  }

  static id() {
    return uuidV1()
  }

  static hash(data: unknown) {
    return SHA256(JSON.stringify(data)).toString()
  }

  static verifySignature(publicKey: string, signature: EC.Signature, hash: string) {
    return ec.keyFromPublic(publicKey, 'hex').verify(hash, signature)
  }
}
