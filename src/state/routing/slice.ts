import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Protocol } from '@baseswapfi/router-sdk'
import { TradeType } from '@baseswapfi/sdk-core'
import { FeeAmount, Pool, Route as V3Route } from '@baseswapfi/v3-sdk2'
import { Pair, Route as V2Route } from '@baseswapfi/v2-sdk'
import { getClientSideQuote } from 'lib/hooks/routing/clientSideSmartOrderRouter'
import ms from 'ms'

import {
  GetQuoteArgs,
  INTERNAL_ROUTER_PREFERENCE_PRICE,
  QuoteMethod,
  QuoteState,
  RouterPreference,
  RoutingConfig,
  SwapRouterNativeAssets,
  TradeResult,
  URAQuoteResponse,
  URAQuoteType,
} from './types'
import { getRouter, isExactInput, shouldUseAPIRouter, transformRoutesToTrade } from './utils'

const CLIENT_PARAMS = {
  protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
}

const protocols: Protocol[] = [Protocol.V2, Protocol.V3, Protocol.MIXED]

// routing API quote query params: https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/schema/quote-schema.ts
const DEFAULT_QUERY_PARAMS = {
  protocols,
}

function getRoutingAPIConfig(args: GetQuoteArgs): RoutingConfig {
  // const {
  //   account,
  //   tradeType,
  //   tokenOutAddress,
  //   tokenInChainId,
  //   // uniswapXForceSyntheticQuotes,
  //   // uniswapXEthOutputEnabled,
  //   routerPreference,
  // } = args

  // const uniswapx = {
  //   useSyntheticQuotes: uniswapXForceSyntheticQuotes,
  //   // Protocol supports swap+send to different destination address, but
  //   // for now recipient === swapper
  //   recipient: account,
  //   swapper: account,
  //   routingType: URAQuoteType.DUTCH_LIMIT,
  // }

  const classic = {
    ...DEFAULT_QUERY_PARAMS,
    routingType: URAQuoteType.CLASSIC,
  }

  // const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(tokenOutAddress as SwapRouterNativeAssets)

  // // UniswapX doesn't support native out, exact-out, or non-mainnet trades (yet),
  // // so even if the user has selected UniswapX as their router preference, force them to receive a Classic quote.
  // if (
  //   !args.uniswapXEnabled ||
  //   (args.userDisabledUniswapX && routerPreference !== RouterPreference.X) ||
  //   (tokenOutIsNative && !uniswapXEthOutputEnabled) ||
  //   tradeType === TradeType.EXACT_OUTPUT ||
  //   !isUniswapXSupportedChain(tokenInChainId)
  // ) {
  //   return [classic]
  // }

  return [classic]
}
