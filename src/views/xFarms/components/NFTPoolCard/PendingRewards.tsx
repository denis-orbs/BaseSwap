import { Button, Flex, Text, TokenImage } from '@pancakeswap/uikit'
import { IPositionInfo } from 'state/xFarms/types'
import useTokenPrices from 'hooks/useTokenPrices'
import { useTranslation } from '@pancakeswap/localization'
import { getTokenAddress, getTokenImage, getTokenInstance } from 'config/constants/token-info'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

interface PendingRewardProps {
  position: IPositionInfo
  harvestPosition: () => Promise<any>
  title?: string
  nitro?: boolean
  pendingTx?: boolean
}

const PendingRewards: React.FC<PendingRewardProps> = ({
  position,
  harvestPosition,
  title = 'PENDING REWARDS',
  nitro,
  pendingTx,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { getValueForAmount } = useTokenPrices()
  // const { toastSuccess } = useToast()
  // const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  // const { fetchAllData } = useNftPools()

  // const tokenId = position?.tokenIds[0]
  let rewardsList = []
  if (nitro) {
    rewardsList = position?.nitroUserInfo?.pendingNitroRewards || []
  } else {
    rewardsList = position?.pendingRewards || []
  }

  const xTokenAddress = getTokenAddress('xProtocolToken', chainId)
  const arxAddress = getTokenAddress('ProtocolToken', chainId)
  let hasRewards = false

  const mappedRewards = rewardsList.map((rw) => {
    const tokenAddress = rw.token == xTokenAddress ? arxAddress : rw.token
    const { valueLabel } = getValueForAmount(tokenAddress, rw.pendingReward)
    const rewardAmountDisplay = rw.pendingReward.toFixed(4)

    if (parseFloat(rw.pendingReward) > 0) hasRewards = true

    return {
      ...rw,
      imgSrc: getTokenImage(rw.token),
      rewardAmountDisplay,
      valueLabel,
      token: getTokenInstance(rw.token),
    }
  })

  // const handleHarvest = useCallback(async () => {
  //   const receipt = await fetchWithCatchTxError(() => {
  //     return harvestPosition(tokenId)
  //   })

  //   if (receipt?.status) {
  //     toastSuccess(
  //       `${t('Harvest')}!`,
  //       <ToastDescriptionWithTx txHash={receipt.transactionHash}>
  //         {t('Your harvest has been claimed')}
  //       </ToastDescriptionWithTx>,
  //     )
  //   }

  //   fetchAllData()
  // }, [tokenId])

  return (
    <Flex flexDirection="column" width="100%" mt="10px">
      <Text>{title}</Text>

      <Flex flexDirection="row" flexWrap="wrap">
        {mappedRewards.map((rw, i) => (
          <Flex key={i} alignItems="center" alignContent="center" mt="0px" ml="1px" width={['100%', '48%']}>
            <TokenImage src={rw.imgSrc} width={30} height={30} />

            <Flex flexDirection="column" alignItems="flex-start" mt="10px">
              <Text bold textTransform="uppercase" color="white">
                {rw.token.symbol} {t('Earned')}
              </Text>
              <Text fontSize="14px" fontWeight="600" color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>
                {rw.rewardAmountDisplay}
              </Text>
              <Text fontSize="10px" fontWeight="600" color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>
                {rw.valueLabel}
              </Text>

              {/* <Text color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>{rw.rewardAmountDisplay}</Text>
              <Text color={rw.pendingReward === 0 ? 'textDisabled' : 'text'}>{rw.valueLabel}</Text> */}
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Flex justifyContent="center" mt="10px">
        <Button
            variant="primary"
         
          disabled={!hasRewards || pendingTx}
          onClick={harvestPosition}
        >
          Claim
        </Button>
      </Flex>
    </Flex>
  )
}

export default PendingRewards
