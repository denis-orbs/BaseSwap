import BigNumber from 'bignumber.js'
import { BIG_ONE, BIG_ZERO } from 'utils/bigNumber'
import { filterFarmsByQuoteToken } from 'utils/farmsPriceHelpers'
import { SerializedFarm } from 'state/types'
import { DEFAULT_STABLE_SYMBOL, WRAPPED_NATIVE_SYMBOL } from 'config/constants/token-info'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { getWethPrice } from 'utils/tokenPricing'
import multicall, { Call } from 'utils/multicall'
import { WBNB } from '@magikswap/sdk'

export async function getWethPoolTokenValues(pairAddress: string): Promise<number> {
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
      'function getReserves() public view returns (uint res0, uint res1)',
      'function token0() public view returns (address)',
      'function token1() public view returns (address)',
    ],
    calls,
  )

  const [pairInfo, wethPrice] = await Promise.all([multi, getWethPrice()])

  const res0 = pairInfo[0].res0
  const res1 = pairInfo[0].res1
  const token0 = pairInfo[1][0]
  const token1 = pairInfo[2][0]

  const wethAddress = WBNB[DEFAULT_CHAIN_ID].address
  let wethTokenRef: string
  let wethReserves: string
  let reservesIn: string

  if (token0 === wethAddress) {
    wethTokenRef = token0
    wethReserves = res0.toString()
    reservesIn = res1.toString()
  }
  if (token1 === wethAddress) {
    wethTokenRef = token1
    wethReserves = res1.toString()
    reservesIn = res0.toString()
  }
  if (!wethTokenRef) throw new Error('None WETH pool')

  const amtOut = quote('1', reservesIn, wethReserves)
  console.log(amtOut.toNumber())
  const outInWethUSD = amtOut.toNumber() * wethPrice
  console.log(`outInWethUSD: ${outInWethUSD}`)

  return outInWethUSD
}

function quote(amountIn: string, resIn: string, resOut: string) {
  const inBn = new BigNumber(amountIn)
  const num = inBn.times(new BigNumber(resOut))
  const denom = new BigNumber(resIn).plus(inBn)
  return num.div(denom)
}

const getFarmFromTokenSymbol = (
  farms: SerializedFarm[],
  tokenSymbol: string,
  preferredQuoteTokens?: string[],
): SerializedFarm => {
  const farmsWithTokenSymbol = farms.filter((farm) => {
    // console.log(farm.token.symbol)
    // console.log(tokenSymbol)

    return farm.token.symbol === tokenSymbol
  })

  const filteredFarm = filterFarmsByQuoteToken(farmsWithTokenSymbol, preferredQuoteTokens)
  console.log(filteredFarm)

  return filteredFarm
}

const getFarmBaseTokenPrice = (
  farm: SerializedFarm,
  quoteTokenFarm: SerializedFarm,
  bnbPriceBusd: BigNumber,
): BigNumber => {
  const hasTokenPriceVsQuote = Boolean(farm.tokenPriceVsQuote)

  if (farm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
    return hasTokenPriceVsQuote ? new BigNumber(farm.tokenPriceVsQuote) : BIG_ZERO
  }

  if (farm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
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
  if (quoteTokenFarm.quoteToken.symbol === WRAPPED_NATIVE_SYMBOL) {
    const quoteTokenInBusd = bnbPriceBusd.times(quoteTokenFarm.tokenPriceVsQuote)
    return hasTokenPriceVsQuote && quoteTokenInBusd
      ? new BigNumber(farm.tokenPriceVsQuote).times(quoteTokenInBusd)
      : BIG_ZERO
  }

  if (quoteTokenFarm.quoteToken.symbol === DEFAULT_STABLE_SYMBOL) {
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

  // console.log(bnbBusdFarm)
  // console.log(bnbPriceBusd.toNumber())

  const farmsWithPrices = farms.map((farm) => {
    // const quoteTokenFarm = getFarmFromTokenSymbol(farms, farm.quoteToken.symbol)
    // console.log(farm)
    const tokenPriceBusd = getFarmBaseTokenPrice(farm, bnbBusdFarm, bnbPriceBusd)
    const quoteTokenPriceBusd = getFarmQuoteTokenPrice(farm, bnbBusdFarm, bnbPriceBusd)

    // console.log('pool id: ' + farm.pid)
    // console.log('tokenPriceBusd: ' + tokenPriceBusd.toNumber())
    // console.log('quoteTokenPriceBusd: ' + quoteTokenPriceBusd.toNumber())

    return {
      ...farm,
      tokenPriceBusd: tokenPriceBusd.toJSON(),
      quoteTokenPriceBusd: quoteTokenPriceBusd.toJSON(),
    }
  })

  return farmsWithPrices
}

export default getFarmsPrices
