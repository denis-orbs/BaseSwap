import { Distributor__factory, MerklAPIData, registry } from '@angleprotocol/sdk'

import { getTokenAddress } from 'config/constants/token-info'
import { PROTOCOL_TOKEN_V3, XPROTOCOL_TOKEN_V3 } from 'config/constants/tokens-v3'
import { FetchStatus } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useCatchTxError from 'hooks/useCatchTxError'
import useTokenPrices from 'hooks/useTokenPrices'
import { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { updateUserClaimsData } from 'state/user/actions'
import { useUserClaimsDataSelector } from 'state/user/selectors'
import useSWR from 'swr'
import { getSigner } from 'utils'
import { getFullDisplayBalance } from 'utils/formatBalance'

const MERKL_API_URL = 'https://api.angle.money/v1/merkl?chainId=8453&AMMs[]=baseswap'

export default function useMerklRewards() {
  const [claimsData, setClaimsData] = useState<{ tokens: string[]; proofs: string[][]; claims: string[] }>()
  const [isClaiming, setIsClaiming] = useState(false)

  const { account, chainId, library } = useActiveWeb3React()
  const { getValueForAmount } = useTokenPrices()
  const { fetchWithCatchTxError } = useCatchTxError()
  // const {
  //   pendingMerklBSX: previousPendingBSX,
  //   pendingMerklXBSX: previousXBSX,
  //   pendingMerklValue: previousValue,
  // } = useUserClaimsDataSelector()
  const dispatch = useAppDispatch()

  const userURL = `${MERKL_API_URL}&user=${account}`
  const { data, error, status } = useSWR(userURL, async () => {
    if (account) {
      // dispatch(
      //   updateUserClaimsData({
      //     pendingMerklBSX: previousPendingBSX,
      //     pendingMerklXBSX: previousXBSX,
      //     pendingMerklValue: previousValue,
      //     isLoading: true,
      //   }),
      // )

      const resp = await fetch(userURL)
      const merklData = await resp.json()

      const bsxAddy = getTokenAddress('ProtocolToken', chainId)
      const xbsxAddy = getTokenAddress('xProtocolToken', chainId)

      const rewards: any[] = Object.entries(merklData.transactionData)
        .filter((obj: any) => (obj[0] === bsxAddy || obj[0] === xbsxAddy) && obj[1].proof !== undefined)
        .map((obj: any) => {
          return {
            ...obj[1],
          }
        })

      const bsxCurrency = PROTOCOL_TOKEN_V3[chainId]
      const xbsxCurrency = XPROTOCOL_TOKEN_V3[chainId]

      let pendingMerklBSX = 0
      let pendingMerklXBSX = 0

      Object.entries(merklData.pools)
        .filter((obj: any) => {
          return Object.keys(obj[1].rewardsPerToken).includes(bsxAddy)
        })
        .forEach((obj: any) => {
          const pendingBSX = parseFloat(
            getFullDisplayBalance(obj[1].rewardsPerToken[bsxAddy].unclaimedUnformatted, 18, 4),
          )
          const pendingXBSX = parseFloat(
            getFullDisplayBalance(obj[1].rewardsPerToken[xbsxAddy].unclaimedUnformatted, 18, 4),
          )
          pendingMerklBSX += pendingBSX
          pendingMerklXBSX += pendingXBSX
        })

      const total = pendingMerklBSX + pendingMerklXBSX
      const pendingValue = getValueForAmount(bsxAddy, total, 4)
      const hasClaims = total > 0

      const tokens = rewards.map((k) => k.token)
      const claims = rewards.map((t) => t.claim)
      const proofs = rewards.map((t) => t.proof)

      setClaimsData({
        tokens,
        claims,
        proofs,
      })

      dispatch(
        updateUserClaimsData({
          pendingMerklBSX,
          pendingMerklXBSX,
          pendingMerklValue: pendingValue.valueLabel,
          isLoading: false,
        }),
      )

      return {
        rewards,
        bsxCurrency,
        xbsxCurrency,
        pendingBSX: pendingMerklBSX,
        pendingXBSX: pendingMerklXBSX,
        pendingValue,
        hasClaims,
      }
    }
  })

  const doClaim = useCallback(async () => {
    if (!claimsData?.claims.length) return

    const contractAddress = registry(chainId)?.Merkl?.Distributor
    if (!contractAddress) throw 'Chain not supported'

    try {
      setIsClaiming(true)

      const signer = getSigner(library, account)
      const contract = Distributor__factory.connect(contractAddress, signer)

      const receipt = await fetchWithCatchTxError(() => {
        return contract.claim(
          claimsData.tokens.map((t) => account),
          claimsData.tokens,
          claimsData.claims,
          claimsData.proofs as string[][],
        )
      })

      setClaimsData({
        tokens: [],
        claims: [],
        proofs: [],
      })
      setIsClaiming(false)

      return receipt
    } catch (error) {
      console.log(error)
      setIsClaiming(false)
    }
  }, [chainId, fetchWithCatchTxError])

  return {
    data,
    error,
    isLoading: status === FetchStatus.Fetching,
    doClaim,
    isClaiming,
  }
}
