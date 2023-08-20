import { NativeCurrency, Token } from '@baseswapfi/sdk-core'

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}

export function nativeOnChain(chainId: number): NativeCurrency | Token {
  // if (cachedNativeCurrency[chainId]) {
  //   return cachedNativeCurrency[chainId]
  // }

  // let nativeCurrency: NativeCurrency | Token
  // cachedNativeCurrency[chainId] = nativeCurrency
  return cachedNativeCurrency[chainId]
}
