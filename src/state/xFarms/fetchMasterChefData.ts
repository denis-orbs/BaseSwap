import { getNftPoolConfigs } from 'config/constants/farms'
import { getChefRamsey } from 'utils/contractHelpers'
import multicall, { Call, multicallv2 } from 'utils/multicall'
import ramseyAbi from '../../config/abi/ChefRamsey.json'
import { getAddress } from 'utils/addressHelpers'
import { SerializedFarm } from 'state/types'
import { SerializedFarmConfig } from 'config/constants/types'
import erc20 from 'config/abi/erc20.json'
import chunk from 'lodash/chunk'
import { NftPoolFarmData } from './types'
import getFarmsPrices from 'state/farms/getFarmsPrices'
import { fetchMultipleCoinGeckoPricesByAddress } from 'utils/tokenPricing'
import { getCoingeckoTokenInfos } from 'config/constants/token-info'
import { ethersToBigNumber } from 'utils/bigNumber'
import { getCombinedNftPoolInfos } from './utils'

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

  // , [dummyPoolInfo]
  // const dummyPoolAllocPointsARX = dummyPoolInfo[1].toNumber()
  // const dummyPoolAllocPointsWETH = dummyPoolInfo[2].toNumber()

  const chefData = {
    poolLength: poolsLength.toNumber(),
    chefTotalAllocPointsARX: totalAllocPointsARX.toNumber(),
    chefTotalAllocPointsWETH: totalAllocPointsWETH.toNumber(),
    emissionRates: {
      mainRate: ethersToBigNumber(emissionRates.mainRate).div(1e18).toNumber(),
      wethRate: ethersToBigNumber(emissionRates.wethRate).div(1e18).toNumber(),
    },
    // dummyPoolAllocPointsARX: dummyPoolInfo[1].toNumber(),
    // dummyPoolAllocPointsWETH: dummyPoolInfo[2].toNumber(),
  }

  return chefData
}

export const fetchMasterChefData = async (chainId: number): Promise<NftPoolFarmData> => {
  // console.time('[fetchMasterChefData]')

  const farms = await fetchFarms(chainId)
  const farmsWithPrices = getFarmsPrices(farms.farms)

  // console.timeEnd('[fetchMasterChefData]')
  return {
    ...farms,
    farms: farmsWithPrices,
  }
}

const fetchFarms = async (chainId: number): Promise<NftPoolFarmData> => {
  const farmConfigs = getNftPoolConfigs(chainId)
  const tokenInfo = getCoingeckoTokenInfos(chainId)

  const [chefInfo, farmResult, nftPoolInfos, tokenPrices] = await Promise.all([
    getCurrentChefData(),
    fetchFarmsLpTokenData(farmConfigs, chainId),
    getCombinedNftPoolInfos(chainId),
    fetchMultipleCoinGeckoPricesByAddress(tokenInfo.map((t) => t.tokenAddress)),
  ])

  const poolLength = 0
  const farmsData = []
  const arxPerSec = 0
  const WETHPerSec = 0
  const TVL = 0

  return {
    poolLength,
    arxPerSec,
    WETHPerSec,
    userDataLoaded: true,
    farms: farmsData,
    totalTVL: TVL,
  }
}
