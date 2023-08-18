import { getNftPoolConfigs } from 'config/constants/farms'
import { getChefRamsey, getMasterchefContract } from 'utils/contractHelpers'
import multicall, { Call, multicallv2 } from 'utils/multicall'
import ramseyAbi from '../../config/abi/ChefRamsey.json'
import { getAddress } from 'utils/addressHelpers'
import { SerializedFarm } from 'state/types'
import { SerializedFarmConfig } from 'config/constants/types'
import erc20 from 'config/abi/erc20.json'
import chunk from 'lodash/chunk'
import { NftPoolFarmData } from './types'
import BigNumber from 'bignumber.js'
import getFarmsPrices from 'state/farms/getFarmsPrices'
import { getCombinedTokenPrices } from 'utils/tokenPricing'
import { BIG_TWO, ethersToBigNumber } from 'utils/bigNumber'
import { getCombinedNftPoolInfos } from './utils'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'
import { defaultFarmsData } from '.'

const dummyPoolId = 16

export const fetchFarmsLpTokenData = async (farms: SerializedFarmConfig[], chainId): Promise<any[]> => {
  const fetchFarmCalls = (farm: SerializedFarm) => {
    const { lpAddresses, token, quoteToken } = farm
    const lpAddress = getAddress(lpAddresses)

    return [
      // Balance of token in the LP contract
      {
        address: token.address,
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of quote token on LP contract
      {
        address: quoteToken.address,
        name: 'balanceOf',
        params: [lpAddress],
      },
      // Balance of LP tokens in the pool contract
      {
        address: lpAddress,
        name: 'balanceOf',
        params: [farm.nftPoolAddress[chainId]],
      },
      // Total supply of LP tokens
      {
        address: lpAddress,
        name: 'totalSupply',
      },
      // Token decimals
      {
        address: token.address,
        name: 'decimals',
      },
      // Quote token decimals
      {
        address: quoteToken.address,
        name: 'decimals',
      },
    ]
  }

  try {
    const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm))
    const chunkSize = farmCalls.length / farms.length
    const farmMultiCallResult = await multicallv2(erc20, farmCalls)
    return chunk(farmMultiCallResult, chunkSize)
  } catch (error) {
    console.log('ERRORRRRRRRRRR', error)
  }

  return []
}

const getCurrentChefData = async () => {
  const ramsey = getChefRamsey()

  const calls: Call[] = [
    {
      address: ramsey.address,
      name: 'poolsLength',
    },

    {
      address: ramsey.address,
      name: 'totalAllocPoints',
    },

    {
      address: ramsey.address,
      name: 'totalAllocPointsWETH',
    },

    {
      address: ramsey.address,
      name: 'emissionRates',
    },
    // {
    //   address: ramsey.address,
    //   name: 'getMainChefPoolInfo', // TODO: Need to convert this to call the original chef to get dummy pool info
    // },
  ]

  const [[poolsLength], [totalAllocPointsARX], [totalAllocPointsWETH], emissionRates] = await multicall(
    ramseyAbi,
    calls,
  )

  const ogChef = getMasterchefContract()
  const dummyPoolInfo = await ogChef.poolInfo(dummyPoolId)
  const dummyPoolAllocPointsARX = dummyPoolInfo.allocPoint.toNumber()

  const chefData = {
    poolLength: poolsLength.toNumber(),
    chefTotalAllocPointsARX: totalAllocPointsARX.toNumber(),
    chefTotalAllocPointsWETH: totalAllocPointsWETH.toNumber(),
    emissionRates: {
      mainRate: ethersToBigNumber(emissionRates.mainRate).div(1e18).toNumber(),
      wethRate: ethersToBigNumber(emissionRates.wethRate).div(1e18).toNumber(),
    },
    dummyPoolAllocPointsARX,
    dummyPoolAllocPointsWETH: 0,
  }

  return chefData
}

export const fetchMasterChefData = async (chainId: number): Promise<NftPoolFarmData> => {
  try {
    // console.time('[fetchMasterChefData]')

    const farms = await fetchXFarmsData(chainId)
    // Need native farm added in
    const farmsWithPrices = await getFarmsPrices(farms.farms)

    // console.timeEnd('[fetchMasterChefData]')
    return {
      ...farms,
      farms: farmsWithPrices,
    }
  } catch (error) {
    console.log(error)
    return defaultFarmsData
  }
}

const fetchXFarmsData = async (chainId: number): Promise<NftPoolFarmData> => {
  const farmConfigs = getNftPoolConfigs(chainId)

  // need to add native/stable farm into this without calling nft stuff on it

  const [chefInfo, farmResult, nftPoolInfos, tokenPrices] = await Promise.all([
    getCurrentChefData(),
    fetchFarmsLpTokenData(farmConfigs, chainId),
    getCombinedNftPoolInfos(chainId),
    getCombinedTokenPrices(chainId),
  ])

  console.log(nftPoolInfos)

  const { getPrice } = tokenPrices // TODO: Need the combined screener/gecko prices

  const {
    poolLength,
    emissionRates,
    chefTotalAllocPointsARX,
    chefTotalAllocPointsWETH,
    dummyPoolAllocPointsARX,
    dummyPoolAllocPointsWETH,
  } = chefInfo

  const arxPerSec = emissionRates.mainRate
  const WETHPerSec = emissionRates.wethRate
  let TVL = 0

  const farmsData = nftPoolInfos.map((pool, idx) => {
    const configMatch = farmConfigs.find(
      (p) => p.nftPoolAddress[chainId].toLowerCase() === pool.poolAddress.toLowerCase(),
    )

    const nftPoolAddress = configMatch.nftPoolAddress[chainId]
    // const nitroPoolAddress = configMatch.nitroPoolAddressMap ? configMatch.nitroPoolAddressMap[chainId] : null
    // const stratAddress = configMatch.lpAddresses[chainId]
    const farm: any = configMatch

    const [
      mainTokenBalanceInLP,
      quoteTokenBalanceInLP,
      lpTokenBalancePool,
      lpTotalSupply,
      [tokenDecimals],
      [quoteTokenDecimals],
    ] = farmResult[idx]

    const lpTokensPool = ethersToBigNumber(lpTokenBalancePool.balance).div(1e18)

    const lpAmountInPool = pool.lpSupply
    const lpTotalSupplyBN = new BigNumber(lpTotalSupply).div(1e18)
    // Ratio in % of LP tokens that are staked in the pool, vs the total number in circulation
    const lpTokenRatio = lpTokensPool.div(lpTotalSupplyBN)

    // Raw amount of each token in the LP, including those not staked
    const mainAmountInLpTotal = new BigNumber(mainTokenBalanceInLP).div(getFullDecimalMultiplier(tokenDecimals))
    const quoteTokenAmountInLpTotal = new BigNumber(quoteTokenBalanceInLP).div(
      getFullDecimalMultiplier(quoteTokenDecimals),
    )

    // So now the allocPointARX is the BSX, and BSWAP is the WETH
    // So the logic here does not really apply except for the WETH part

    // Amount of quoteToken in the LP that are staked in the pool
    const mainTokenAmountInPool = mainAmountInLpTotal.times(lpTokenRatio)
    const quoteTokenAmountInPool = quoteTokenAmountInLpTotal.times(lpTokenRatio)

    const lpTotalInQuoteToken = farm.quantum
      ? lpAmountInPool.div(getFullDecimalMultiplier(18))
      : quoteTokenAmountInPool.times(BIG_TWO)

    //const poolsAllocPointsARX = new BigNumber(pool.allocPointsARX.toNumber())
    const poolsAllocPointsARX = new BigNumber(0)
    //const poolsAllocPointsWETH = new BigNumber(pool.allocPointsWETH.toNumber())
    const poolsAllocPointsWETH = new BigNumber(0)

    const dummyPoolArxAllocBN = new BigNumber(dummyPoolAllocPointsARX)
    const dummyPoolTotalWETHAllocBN = new BigNumber(dummyPoolAllocPointsWETH)

    const poolsPercentOfAllocARX = poolsAllocPointsARX.toNumber() / chefTotalAllocPointsARX
    const poolsPercentOfAllocWETH = poolsAllocPointsWETH.toNumber() / chefTotalAllocPointsWETH

    const poolsPercentOfAllocationArxBN = new BigNumber(poolsPercentOfAllocARX)
    const poolsPercentOfAllocationWethBN = new BigNumber(poolsPercentOfAllocWETH)

    const poolsAdjustedArxAllocPoint = poolsPercentOfAllocationArxBN.times(dummyPoolArxAllocBN)
    const poolsAdjustedArxPoolWeight = poolsAdjustedArxAllocPoint.div(dummyPoolArxAllocBN)

    const poolAdjustedsWETHAllocPoint = poolsPercentOfAllocationWethBN.times(dummyPoolTotalWETHAllocBN)
    const poolsAdjustedWETHPoolWeight = poolAdjustedsWETHAllocPoint.div(dummyPoolTotalWETHAllocBN)

    farm.lpTotalInQuoteToken = lpTotalInQuoteToken.toString()

    const mainTokenPrice = getPrice(farm.token.address)
    const quoteTokenPrice = getPrice(farm.quoteToken.address)

    if (farm.classic) {
      if (mainTokenPrice && quoteTokenPrice) {
        const poolMainValue = mainTokenAmountInPool.times(mainTokenPrice).toNumber()
        const poolQuoteValue = quoteTokenAmountInPool.times(quoteTokenPrice).toNumber()
        const tvl = poolMainValue + poolQuoteValue
        TVL += tvl
        farm.TVL = tvl
      } else {
        console.log('Classic farm is missing prices')
        farm.TVL = 0
      }
    } else if (farm.quantum) {
      // if (farmStrat) {
      //   const totalLiquidity = lpTotalInQuoteToken.times(farmStrat.sharePrice)
      //   const tvl = totalLiquidity.toNumber()
      //   farm.TVL = tvl
      //   TVL += tvl
      // } else {
      //   farm.TVL = 0
      // }
    } else {
      farm.TVL = 0
    }

    const result = {
      nftPoolAddress,
      // nitroPoolAddress,
      ...farm,
      ...pool,
      token: farm.token,
      quoteToken: farm.quoteToken,
      tokenAmountTotal: mainAmountInLpTotal.toJSON(),
      quoteTokenAmountTotal: quoteTokenAmountInLpTotal.toJSON(),
      quoteTokenAmountInPool,
      lpTotalSupply: lpTotalSupplyBN.toJSON(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      tokenPriceVsQuote: quoteTokenAmountInLpTotal.div(mainAmountInLpTotal).toJSON(),
      arxPoolWeight: poolsAdjustedArxPoolWeight.toJSON(),
      WETHPoolWeight: poolsAdjustedWETHPoolWeight.toJSON(),
      multiplier: `${poolsAdjustedArxAllocPoint.plus(poolAdjustedsWETHAllocPoint).div(100).toString()}X`,
      arxMultiplier: `${poolsAdjustedArxAllocPoint.div(100).toString()}X`,
      WETHMultiplier: `${poolAdjustedsWETHAllocPoint.div(100).toString()}X`,
      quantumStrategy: farm.quantumStrategy || null,
      quantumStrategies: farm.quantumStrategies || null,
      lpAmountInPool,
      liquidity: farm.TVL,
      // sharePrice: farmStrat?.sharePrice,
      sharePrice: 0,
    }

    Object.entries(result).forEach((res) => {
      const prop = res[0]
      if (result[prop]?._isBigNumber) result[prop] = result[prop].toString()
    })

    // for (const prop in result) {
    //   if (result[prop]?._isBigNumber) result[prop] = result[prop].toString()
    // }

    return result
  })

  return {
    poolLength,
    arxPerSec,
    WETHPerSec,
    userDataLoaded: true,
    farms: farmsData,
    totalTVL: TVL,
  }
}
