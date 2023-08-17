import nftPoolAbi from '../../config/abi/NFTPool.json'
import { getNftPoolAddresses } from 'config/constants/farms'
import multicall, { Call } from 'utils/multicall'
import ramseyAbi from '../../config/abi/ChefRamsey.json'
import { ethersToBigNumber } from 'utils/bigNumber'
import { getChefRamsey } from 'utils/contractHelpers'

export const getCombinedNftPoolInfos = async (chainId: number) => {
  const nftPoolAddresses = getNftPoolAddresses(chainId)

  const nftPoolInfoCalls: Call[] = []
  const chefPoolInfoCalls: Call[] = []

  nftPoolAddresses.forEach((address) => {
    nftPoolInfoCalls.push({
      address,
      name: 'getPoolInfo',
      params: [],
    })

    chefPoolInfoCalls.push({
      address: getChefRamsey().address,
      name: 'getPoolInfo',
      params: [address],
    })
  })

  const [poolInfos, chefInfos] = await Promise.all([
    multicall(nftPoolAbi, nftPoolInfoCalls),
    multicall(ramseyAbi, chefPoolInfoCalls),
  ])

  return poolInfos.map((info, idx) => {
    return {
      ...info,
      ...chefInfos[idx],
      lpSupply: ethersToBigNumber(info.lpSupply),
    }
  })
}
