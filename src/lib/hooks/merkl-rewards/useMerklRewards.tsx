import { Distributor__factory, MerklAPIData, registry } from '@angleprotocol/sdk'

import { getTokenAddress } from 'config/constants/token-info'
import { PROTOCOL_TOKEN_V3, XPROTOCOL_TOKEN_V3 } from 'config/constants/tokens-v3'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTokenPrices from 'hooks/useTokenPrices'
import { useCallback, useState } from 'react'
import useSWR from 'swr'
import { getSigner } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'

const MERKLE_BASE_URL = 'https://api.angle.money/v1/merkl'
const TEST_API_URL = 'https://api.angle.money/v1/merkl?chainId=8453&AMMs[]=baseswap'

// TODO: Creating distributions
// TODO: Get user claimable rewards
//

export default function useMerklRewards() {
  const [claimsData, setClaimsData] = useState<{ tokens: string[]; proofs: string[][]; claims: string[] }>()

  const { account, chainId, library } = useActiveWeb3React()
  const { getValueForAmount } = useTokenPrices()

  const userURL = `${TEST_API_URL}&user=${account}`
  const { data, error, status } = useSWR(userURL, async () => {
    if (account) {
      const resp = await fetch(userURL)
      const data = await resp.json()

      // console.log(data.merkleRoot)

      const bsxAddy = getTokenAddress('ProtocolToken', chainId)
      const xbsxAddy = getTokenAddress('xProtocolToken', chainId)

      const rewards: any[] = Object.entries(data.transactionData)
        .filter((obj: any) => (obj[0] === bsxAddy || obj[0] === xbsxAddy) && obj[1].proof !== undefined)
        .map((obj: any) => {
          return {
            ...obj[1],
          }
        })

      const bsxCurrency = PROTOCOL_TOKEN_V3[chainId]
      const xbsxCurrency = XPROTOCOL_TOKEN_V3[chainId]

      const pendingBSX = getFullDisplayBalance(rewards.find((r) => r.token === bsxAddy).claim, 18, 4)
      const pendingXBSX = getFullDisplayBalance(rewards.find((r) => r.token === xbsxAddy).claim, 18, 4)
      const total = parseFloat(pendingBSX) + parseFloat(pendingXBSX)
      const pendingValue = getValueForAmount(bsxAddy, total, 4)

      const tokens = rewards.filter((k) => k.token)
      const claims = rewards.map((t) => t.claim)
      const proofs = rewards.map((t) => t.proof)

      setClaimsData({
        tokens,
        claims,
        proofs,
      })

      return {
        rewards,
        bsxCurrency,
        xbsxCurrency,
        pendingBSX,
        pendingXBSX,
        pendingValue,
      }
    }
  })

  const doClaim = useCallback(async () => {
    if (!claimsData?.claims.length) return

    const contractAddress = registry(chainId)?.Merkl?.Distributor
    if (!contractAddress) throw 'Chain not supported'

    const signer = getSigner(library, account)
    const contract = Distributor__factory.connect(contractAddress, signer)
    const tx = await contract.claim(
      claimsData.tokens.map((t) => signer._address),
      claimsData.tokens,
      claimsData.claims,
      claimsData.proofs as string[][],
    )
    await tx.wait()

    setClaimsData({
      tokens: [],
      claims: [],
      proofs: [],
    })

    return tx
  }, [chainId])

  return {
    data,
    error,
    isLoading: status === FetchStatus.Fetching,
    doClaim,
  }
}
