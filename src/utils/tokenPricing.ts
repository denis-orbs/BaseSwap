import { millisecondsToSeconds } from 'date-fns'

const cacheTimeSeconds = 30
const storageKey = 'TOKEN_PRICES'
const screenerStorageKey = 'DS_TOKEN_PRICES'

// export async function getDexscreenerPrices(pairAddresses: string[], platform: 'base' = 'base') {
//   try {
//     const cached = localStorage.getItem(screenerStorageKey)
//     if (cached) {
//       const data = JSON.parse(cached)

//       const timeElapsed = millisecondsToSeconds(Date.now()) - millisecondsToSeconds(data.lastTime)
//       if (timeElapsed < cacheTimeSeconds) {
//         // console.log('Returning prices from cache')
//         // console.log('timeElapsed: ' + timeElapsed)
//         return {
//           prices: data.prices,
//           getPrice: (token: string) => data.prices[token.toLowerCase()] || 0,
//         }
//       }
//     }

//     const response = await fetch(`https://api.dexscreener.io/latest/dex/pairs/${platform}/${pairAddresses[0]}`)
//     const prices = await response.json()

//     console.log(prices)
//   } catch (error) {
//     console.log(error)
//   }
// }

export const fetchMultipleCoinGeckoPricesByAddress = async (
  tokenAddresses: string[],
  platform: 'arbitrum-one' | 'ethereum' = 'arbitrum-one',
): Promise<{ prices: { [tokenAddress: string]: number }; getPrice: (token: string) => number }> => {
  const cached = localStorage.getItem(storageKey)
  if (cached) {
    const data = JSON.parse(cached)

    const timeElapsed = millisecondsToSeconds(Date.now()) - millisecondsToSeconds(data.lastTime)
    if (timeElapsed < cacheTimeSeconds) {
      // console.log('Returning prices from cache')
      // console.log('timeElapsed: ' + timeElapsed)
      return {
        prices: data.prices,
        getPrice: (token: string) => data.prices[token.toLowerCase()] || 0,
      }
    }
  }

  //console.log('Token price cache expired. Making API call...')

  const addresses = tokenAddresses.map((t) => t.toLowerCase()).join(',')

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/${platform}?contract_addresses=${addresses}&vs_currencies=usd`,
    )
    const prices = await response.json()

    // for (const address in prices) {
    //   prices[address.toLowerCase()] = prices[address].usd
    // }

    // localStorage.setItem(
    //   storageKey,
    //   JSON.stringify({
    //     lastTime: Date.now(),
    //     prices,
    //   }),
    // )

    //   console.log('Token prices fetched')

    return {
      prices,
      getPrice: (token: string) => {
        return prices[token.toLowerCase()] || 0
      },
    }
  } catch (error) {
    console.log(`fetchMultipleCoinGeckoPrices: fetch coin gecko prices failed: ${new Date().toUTCString()}`)

    const cached2 = localStorage.getItem(storageKey)
    if (cached2) {
      const data = JSON.parse(cached2)

      const prices = data.prices
      return {
        prices,
        getPrice: (token: string) => prices[token.toLowerCase()] || 0,
      }
    }

    //  console.log('fetchMultipleCoinGeckoPrices: nothing to return from cache')

    return {
      prices: {},
      getPrice: (token: string) => 0,
    }
  }
}
