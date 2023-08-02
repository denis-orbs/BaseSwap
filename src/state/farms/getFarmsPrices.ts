import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { SerializedFarm } from 'state/types'
import { currentTokenMap } from 'config/constants/tokens'
import { DEFAULT_STABLE_SYMBOL, WRAPPED_NATIVE_SYMBOL } from 'config/constants/token-info'
import { Contract } from '@ethersproject/contracts'
import { DEFAULT_CHAIN_ID, defaultRpcProvider } from 'utils/providers'
import { getWethPrice } from 'utils/tokenPricing'
import multicall, { Call } from 'utils/multicall'
import { WBNB } from '@magikswap/sdk'
import { formatUnits } from '@ethersproject/units'

export async function getWethPoolTokenValues(pairAddress: string) {
  const calls: Call[] = [
    {
      address: pairAddress,
      name: 'getReserves',
    },
    {
      address: pairAddress,
      name: 'token0',
    },
    {
      address: pairAddress,
      name: 'token1',
    },
  ]

  const multi = multicall(
    [
      'function getReserves() public view returns (uint res0, uint resB)',
      'function token0() public view returns (address)',
      'function token1() public view returns (address)',
    ],
    calls,
  )

  const [pairInfo, wethPrice] = await Promise.all([multi, getWethPrice()])

  const res0 = pairInfo[0].res0
  const res1 = pairInfo[0].res0
  const token0 = pairInfo[1][0]
  const token1 = pairInfo[2][0]

  console.log(token1)

  // Calculate how many ETH you get for other token
  // ETH / other reserves

  const wethAddress = WBNB[DEFAULT_CHAIN_ID].address
  // const numerator = token0 === wethAddress ? res1 : res0
  // const denominator = token1 === wethAddress ? res0 : res1
  // const spotAmountOut = numerator.div(denominator)
  // console.log(formatUnits(spotAmountOut))

  // console.log(pairInfo)
  // console.log(wethPrice)
}

const getFarmFromTokenSymbol = (
  farms: SerializedFarm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarm => {
  const farmsWithTokenSymbol = farms.filter((farm) => farm.token.symbol === tokenSymbol)
  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === currentTokenMap.busd.symbol) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === currentTokenMap.wbnb.symbol) {
    return hasTokenPriceVsQuote ? bnbPriceBusd.times(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  // We can only calculate profits without a quoteTokenFarm for BUSD/BNB farms
  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  // Possible alternative farm quoteTokens:
  // UST (i.e. MIR-UST), pBTC (i.e. PNT-pBTC), BTCB (i.e. bBADGER-BTCB), ETH (i.e. SUSHI-ETH)
  // If the farm's quote token isn't BUSD or WBNB, we then use the quote token, of the original farm's quote token
  // i.e. for farm PNT - pBTC we use the pBTC farm's quote token - BNB, (pBTC - BNB)
  // from the BNB - pBTC price, we can calculate the PNT - BUSD price
  if (quoteTokenFarm.quoteToken.symbol === currentTokenMap.wbnb.symbol) {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === currentTokenMap.busd.symbol) {
    const quoteTokenInBusd = quoteTokenFarm.tokenPriceVsQuote
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  // Catch in case token does not have immediate or once-removed BUSD/WBNB quoteToken
  return BIG_ZERO
}

const getFarmQuoteTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  if (farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return BIG_ONE
  }

  if (farm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    return bnbPriceBusd
  }

  if (!quoteTokenFarm) {
    return BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    return quoteTokenFarm.tokenPriceVsQuote ? bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return quoteTokenFarm.tokenPriceVsQuote ? new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : BIG_ZERO
  }

  return BIG_ZERO
}

const getFarmsPrices = (farms: SerializedFarm[]) => {
  const bnbBusdFarm = farms.find(
    (farm) => farm.token.symbol === DEFAULT_STABLE_SYMBOL && farm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL,
  )
  const bnbPriceBusd = bnbBusdFarm.tokenPriceVsQuote ? BIG_ONE.div(bnbBusdFarm.tokenPriceVsQuote) : BIG_ZERO
  const farmsWithPrices = farms.map((farm) => {
    const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, quoteTokenFarm, bnbPriceBusd)

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices
