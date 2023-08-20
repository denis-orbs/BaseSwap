import { ChainId, Currency, CurrencyAmount, Price, Token, WETH9 } from '@baseswapfi/sdk-core'
import { STABLE_COIN, USDBC_BASE } from 'config/constants/tokens-v3'
import useActiveWeb3React from './useActiveWeb3React'
import { useMemo } from 'react'

// Stablecoin amounts used when calculating spot price for a given currency.
// The amount is large enough to filter low liquidity pairs.
const STABLECOIN_AMOUNT_OUT: { [chainId: number]: CurrencyAmount<Token> } = {
  [ChainId.BASE]: CurrencyAmount.fromRawAmount(USDBC_BASE, 10_000e6),
}

/**
 * Returns the price in USDC of the input currency
 * @param currency currency to compute the USDC price of
 */
export default function useStablecoinPrice(currency?: Currency): Price<Currency, Token> | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = currency?.wrapped
  const wnative = WETH9[chainId]
  const stablecoin = STABLE_COIN[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [wrapped?.equals(stablecoin) ? undefined : wrapped, stablecoin],
      [chainId ? wnative : undefined, stablecoin],
    ],
    [wnative, stablecoin, chainId, currency, wrapped],
  )

  return undefined
}
