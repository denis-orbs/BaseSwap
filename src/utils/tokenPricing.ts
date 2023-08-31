import { ChainId } from '@magikswap/sdk'
import {
  getCoingeckoTokenInfos,
  getDexscreenerTokenInfos,
  getTokenAddress,
  getTokenAddressesForChain,
} from 'config/constants/token-info'
import { millisecondsToSeconds } from 'date-fns'

const cacheTimeSeconds = 30
const storageKey = 'TOKEN_PRICES'
const screenerStorageKey = 'DS_TOKEN_PRICES'

const wethCacheKey = 'WETH_PRICE'

export const priceDexScreener = async (address: any): Promise<any> => {
  const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`, {
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
    const prices = {}
    for (const address of tokenAddresses) {
      const price = await priceDexScreener(address) // Assuming priceDexScreener() fetches the price for a single address
      prices[address.toLowerCase()] = price
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

// export async function getWethPrice() {
//   try {
//     // const response = await fetch(
//     //   `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2&vs_currencies=usd`,
//     // )
//     // const price = await response.json()
//     const price = await priceDexScreener('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
//     return price
//   } catch (error) {
//     console.log('Fetching WETH price failed')
//     return 0
//   }
// }

// export const fetchMultipleCoinGeckoPricesByAddress = async (
//   tokenAddresses: string[],
//   platform: 'arbitrum-one' | 'ethereum' = 'arbitrum-one',
// ): Promise<{ prices: { [tokenAddress: string]: number }; getPrice: (token: string) => number }> => {
//   const fetchTokenPricesSequentially = async (addresses) => {
//     const tokenPrices = {}
//     const tokenAddresses = addresses.split(',')
//     for (const address of tokenAddresses) {
//       const price = await priceDexScreener(address) // Assuming priceDexScreener() fetches the price for a single address
//       tokenPrices[address] = price
//     }

//     return tokenPrices
//   }

//   const addresses = tokenAddresses.map((t) => t.toLowerCase()).join(',')

//   try {
//     const response = await fetchTokenPricesSequentially(addresses)
//     const prices = response

//     return {
//       prices,
//       getPrice: (token: string) => {
//         return token ? prices[token.toLowerCase()] || 0 : 0
//       },
//     }
//   } catch (error) {
//     console.log('error', error)
//     console.log(`fetchMultipleCoinGeckoPrices: fetch coin gecko prices failed: ${new Date().toUTCString()}`)

//     const cached2 = localStorage.getItem(storageKey)
//     if (cached2) {
//       const data = JSON.parse(cached2)

//       const prices = data.prices
//       return {
//         prices,
//         getPrice: (token: string) => prices[token.toLowerCase()] || 0,
//       }
//     }

//     return {
//       prices: {},
//       getPrice: (token: string) => 0,
//     }
//   }
// }

export async function getDexscreenerPrices(pairAddresses: string[], platform: 'base' = 'base') {
  try {
    if (!pairAddresses.length) return {}

    const response = await fetch(`https://api.dexscreener.io/latest/dex/pairs/base/${pairAddresses.join(',')}`)
    const priceInfo = await response.json()

    const prices: any = {}
    priceInfo.pairs.forEach((pair) => {
      prices[pair.baseToken.address.toLowerCase()] = parseFloat(pair.priceUsd)
    })

    return prices
  } catch (error) {
    console.log('getDexscreenerPrices failed')

    return {}
  }
}
