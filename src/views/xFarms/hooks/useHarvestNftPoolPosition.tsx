import { useWeb3React } from '@web3-react/core'
import { useNftPool } from 'hooks/useContract'
import { useCallback } from 'react'

export const useHarvestPosition = (nftPoolAddress: string) => {
  const { account } = useWeb3React()
  const nftPool = useNftPool(nftPoolAddress)

  const harvestPositionTo = useCallback(
    async (tokenId: number) => {
      try {
        return nftPool.harvestPositionTo(tokenId, account)
      } catch (err) {
        console.log(err)
      }
    },
    [nftPoolAddress, nftPool, account],
  )

  const harvestPosition = useCallback(
    async (tokenId: number) => {
      try {
        return nftPool.harvestPosition(tokenId)
      } catch (err) {
        console.log(err)
      }
    },
    [nftPoolAddress, nftPool],
  )

  return { harvestPositionTo, harvestPosition }
}
