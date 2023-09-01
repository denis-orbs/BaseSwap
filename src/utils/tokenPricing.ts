import { ChainId } from '@magikswap/sdk'
import { getTokenAddressesForChain } from 'config/constants/token-info'
import { millisecondsToSeconds } from 'date-fns'

const cacheTimeSeconds = 30
const storageKey = 'TOKEN_PRICES'

export const priceDexScreener = async (address: any): Promise<any> => {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, {
    method: 'GET',
  })
  const res = await response.json()
  return res.pairs ? parseFloat(res.pairs[0]?.priceUsd || '0') : 0
}
export const priceDexScreenerPair = async (address: any): Promise<any> => {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/base/${address}`, {
    method: 'GET',
  })
  const res = await response.json()
  return res.pairs ? parseFloat(res.pairs[0]?.priceUsd || '0') : 0
}

export async function getCombinedTokenPrices(chainId: ChainId) {
  try {
    const cached = localStorage.getItem(storageKey)
    if (cached) {
      const data = JSON.parse(cached)

      const timeElapsed = millisecondsToSeconds(Date.now()) - millisecondsToSeconds(data.lastTime)
      if (timeElapsed < cacheTimeSeconds) {
        return {
          prices: data.prices,
          getPrice: (token: string) => data.prices[token.toLowerCase()] || 0,
        }
      }
    }

    const tokenAddresses = getTokenAddressesForChain(chainId)
    const wethPrice = await getWethPrice()

    const prices = {}
    for (let address of tokenAddresses) {
      let price
      // UNIDEX
      if (address === '0x6B4712AE9797C199edd44F897cA09BC57628a1CF') {
        price = await priceDexScreenerPair('0x30dcc8444f8361d5ce119fc25e16af0b583e88fd') // Assuming priceDexScreener() fetches the price for a single address
      } else {
        price = await priceDexScreener(address) // Assuming priceDexScreener() fetches the price for a single address
      }

      if (address == '0x4200000000000000000000000000000000000006') {
        prices[address.toLowerCase()] = wethPrice
      } else {
        prices[address.toLowerCase()] = price
      }
    }

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        prices,
        lastTime: Date.now(),
      }),
    )

    return {
      prices,
      getPrice: (token: string) => prices[token.toLowerCase()] || 0,
    }
  } catch (error) {
    console.log('error', error)
    console.log(`getCombinedTokenPrices: Error get prices: ${new Date().toUTCString()}`)

    const cached2 = localStorage.getItem(storageKey)
    if (cached2) {
      const data = JSON.parse(cached2)

      const prices = data.prices
      return {
        prices,
        getPrice: (token: string) => prices[token.toLowerCase()] || 0,
      }
    }

    return {
      prices: {},
      getPrice: (token: string) => 0,
    }
  }
}

export async function getWethPrice() {
  try {
    // const response = await fetch(
    //   `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&vs_currencies=usd`,
    // )
    // const price = await response.json()
    const price = await priceDexScreener('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
    return price
  } catch (error) {
    console.log('Fetching WETH price failed')
    return 0
  }
}
