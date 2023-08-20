import { ChainId, Ether, NativeCurrency, Token } from '@baseswapfi/sdk-core'
import { WRAPPED_NATIVE_CURRENCY } from './tokens'

export const NATIVE_CHAIN_ID = 'NATIVE'

export const USDBC_BASE = new Token(
  ChainId.BASE,
  '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
  6,
  'USDbC',
  'USD Base Coin',
)

export const STABLE_COIN: { [chainId: number]: Token } = {
  [ChainId.BASE]: USDBC_BASE,
}

export const WRAPPED_NATIVE: { [chainId: number]: Token } = {
  [ChainId.BASE]: USDBC_BASE,
}

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
