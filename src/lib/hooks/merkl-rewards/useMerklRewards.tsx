import { getTokenAddress } from 'config/constants/token-info'
import { PROTOCOL_TOKEN_V3, XPROTOCOL_TOKEN_V3 } from 'config/constants/tokens-v3'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useSWR from 'swr'
import { getFullDisplayBalance } from 'utils/formatBalance'

const MERKLE_BASE_URL = 'https://api.angle.money/v1/merkl'
const TEST_API_URL = 'https://api.angle.money/v1/merkl?chainId=8453&AMMs[]=baseswap'

// TODO: Creating distributions
// TODO: Get user claimable rewards
//

export default function useMerklRewards() {
  const { account, chainId } = useActiveWeb3React()

  // TODO: Claim function

  const userURL = `${TEST_API_URL}&user=${account}`
  const { data, error, status } = useSWR(userURL, async () => {
    if (account) {
      const resp = await fetch(userURL)
      const data = await resp.json()
      // console.log(data)
      // console.log(Object.entries(data.pools))
      // console.log(data.validRewardTokens)
      // console.log(data.merkleRoot)

      const bsxAddy = getTokenAddress('ProtocolToken', chainId)
      const xbsxAddy = getTokenAddress('xProtocolToken', chainId)

      const rewards: any[] = Object.entries(data.transactionData)
        .filter((obj) => obj[0] === bsxAddy || obj[0] === xbsxAddy)
        .map((obj: any) => {
          return {
            ...obj[1],
          }
        })

      const bsxCurrency = PROTOCOL_TOKEN_V3[chainId]
      const xbsxCurrency = XPROTOCOL_TOKEN_V3[chainId]

      const pendingBSX = getFullDisplayBalance(rewards.find((r) => r.token === bsxAddy).claim, 18, 4)
      const pendingXBSX = getFullDisplayBalance(rewards.find((r) => r.token === xbsxAddy).claim, 18, 4)

      const claims = []

      return {
        rewards,
        bsxCurrency,
        xbsxCurrency,
        pendingBSX,
        pendingXBSX,
      }
    }
  })

  return {
    data,
    error,
    isLoading: status === FetchStatus.Fetching,
  }
}
