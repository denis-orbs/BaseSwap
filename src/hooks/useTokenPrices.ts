import { useWeb3React } from '@web3-react/core'
import { getCoingeckoTokenInfos } from 'config/constants/token-info'
import { useCallback, useEffect, useState } from 'react'
import { fetchMultipleCoinGeckoPricesByAddress } from 'utils/tokenPricing'

const useTokenPrices = () => {
  const [prices, setPrices] = useState<{ [tokenAddress: string]: number }>({})
  const { chainId } = useWeb3React()

  // TODO: Can aggregate prices for more than gecko into one prices object

  useEffect(() => {
    const getPrices = async () => {
      const tokenAddresses = getCoingeckoTokenInfos(chainId).map((ti) => ti.tokenAddress)
      const otherPrices = {}

      const { prices: localPrices } = await fetchMultipleCoinGeckoPricesByAddress(tokenAddresses)

      setPrices({
        ...localPrices,
        ...otherPrices,
      })
    }

    getPrices()
    const interval = setInterval(() => {
      getPrices()
    }, 30000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [chainId])

  const getTokenPrice = useCallback(
    (token: string) => {
      return prices[token.toLowerCase()] || 0
    },
    [prices],
  )

  const getValueForAmount = useCallback(
    (token: string, amount: number, decimals = 4) => {
      const valueUSD = getTokenPrice(token) * amount

      return {
        valueUSD,
        valueLabel: `~$${valueUSD.toFixed(decimals)}`,
      }
    },
    [getTokenPrice],
  )

  return {
    prices,
    getTokenPrice,
    getValueForAmount,
  }
}

export default useTokenPrices
