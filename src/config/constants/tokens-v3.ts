import { Ether, NativeCurrency, Token } from '@baseswapfi/sdk-core'
import { WRAPPED_NATIVE_CURRENCY } from './tokens'

export const NATIVE_CHAIN_ID = 'NATIVE'

class ExtendedEther extends Ether {
  public get wrapped(): Token {
    const wrapped = WRAPPED_NATIVE_CURRENCY[this.chainId]
    if (wrapped) return wrapped
    throw new Error(`Unsupported chain ID: ${this.chainId}`)
  }

  private static _cachedExtendedEther: { [chainId: number]: NativeCurrency } = {}

  public static onChain(chainId: number): ExtendedEther {
    if (this._cachedExtendedEther[chainId]) return this._cachedExtendedEther[chainId]
    this._cachedExtendedEther[chainId] = new ExtendedEther(chainId)
    return this._cachedExtendedEther[chainId]
  }
}

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]

  const nativeCurrency = ExtendedEther.onChain(chainId)
  cachedNativeCurrency[chainId] = nativeCurrency

  return nativeCurrency
}
