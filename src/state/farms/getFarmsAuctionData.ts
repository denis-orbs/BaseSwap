import { ChainId } from '@magikswap/sdk'
import { SerializedFarm } from 'state/types'

const getFarmsAuctionData = (farms: SerializedFarm[], winnerFarms: string[], auctionHostingEndDate: string) => {
  return farms.map((farm) => {
    const isAuctionWinnerFarm = winnerFarms.find(
      (winnerFarm) => winnerFarm.toLowerCase() === farm.lpAddresses[ChainId.MAINNET].toLowerCase(),
    )
    return {
      ...farm,
      ...(isAuctionWinnerFarm && { isCommunity: true, auctionHostingEndDate }),
    }
  })
}

export default getFarmsAuctionData
