import { ChainId, Currency, Token } from '@baseswapfi/sdk-core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyFromMap } from 'lib/hooks/useCurrency'
import { useMemo } from 'react'
import { useCombinedActiveList } from 'state/lists/hooks'
import { TokenAddressMap } from 'state/types'
import useUserAddedTokens from 'state/user/hooks/useUserAddedTokens'

type Maybe<T> = T | null | undefined

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, chainId: Maybe<ChainId>): { [address: string]: Token } {
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    return Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>((newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    }, {})
  }, [chainId, tokenMap])
}

/** Returns all tokens from the default list + user added tokens */
export function useDefaultActiveTokens(chainId: Maybe<ChainId>): { [address: string]: Token } {
  const defaultListTokens = useCombinedActiveList()
  const tokensFromMap = useTokensFromMap(defaultListTokens, chainId)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: Token }>(
          (tokenMap, token) => {
            tokenMap[token.address] = token
            return tokenMap
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          { ...tokensFromMap },
        )
    )
  }, [tokensFromMap, userAddedTokens])
}

export function useCurrency(currencyId: Maybe<string>, chainId?: ChainId): Currency | null | undefined {
  const { chainId: connectedChainId } = useActiveWeb3React()
  const tokens = useDefaultActiveTokens(chainId ?? connectedChainId)
  return useCurrencyFromMap(tokens, chainId ?? connectedChainId, currencyId)
}
