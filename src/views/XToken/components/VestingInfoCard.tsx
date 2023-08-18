import { Button, Card, Flex, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import React from 'react'
import { BsArrowRightCircle } from 'react-icons/bs'
import { useAppDispatch } from 'state'
import { VestingInfo } from 'state/xToken/types'
import styled from 'styled-components'
import { ToastDescriptionWithTx } from 'components/Toast'
import { fetchUserXTokenDataAsync } from 'state/xToken'
import useXTokenActions from '../hooks/useXTokenActions'

export const TopHalf = styled(Flex)`
  justify-content: space-between;
  align-items: center;
  border-image: linear-gradient(225deg, #7303c0, #ec38bc, #f86c0d, #fee383) 1;
  border-bottom: 8px;
  border-style: solid;
  padding-bottom: 1rem;
`
export const VestingCard = styled(Card)`
  margin: 15px;
  min-width: 300px;
  margin-bottom: 12px;
  max-width: 100%;
  border: 2px solid white; 
  border-radius: 1px; 
  box-shadow: 8px 0 1px #000; 
  display: flex;
  flex-direction column;
  padding: 1rem;
`

interface VestingCardProps {
  vesting: VestingInfo
}

const VestingInfoCard: React.FC<VestingCardProps> = ({ vesting }) => {
  const { account, chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { toastSuccess } = useToast()

  const { cancelVesting, finalizeVesting, pendingTx } = useXTokenActions()

  async function handleAction(action: 'cancel' | 'finalize') {
    const call = action === 'cancel' ? cancelVesting : finalizeVesting
    const message = action === 'cancel' ? 'Vesting cancelation complete' : 'Vesting finaized'

    const receipt = await call(vesting.redeemIndex)

    if (receipt?.status) {
      toastSuccess(``, <ToastDescriptionWithTx txHash={receipt.transactionHash}>{message}!</ToastDescriptionWithTx>)

      dispatch(fetchUserXTokenDataAsync({ account, chainId }))
    }
  }

  return (
    <VestingCard>
      <TopHalf>
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.xArxAmount} xBSX
        </Text>
        <BsArrowRightCircle size={25} />
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.endTime}
        </Text>
        <BsArrowRightCircle size={25} />
        <Text
          textAlign="center"
          textTransform="uppercase"
          fontSize={['12px', null, null, '0.9rem']}
          letterSpacing="1px"
          fontWeight="600"
        >
          {vesting.arxAmount} BSX
        </Text>
      </TopHalf>

      <Flex justifyContent={['center', null, null, 'center']} mt="15px" mb="0.5rem">
        <Button
          variant="secondary"
          className="glow2small"
          marginX="1rem"
          disabled={!vesting.canFinalize || pendingTx}
          onClick={() => handleAction('finalize')}
        >
          Claim
        </Button>

        <Button
          variant="secondary"
          marginX="1rem"
          className="glow2small"
          disabled={vesting.canFinalize || pendingTx}
          onClick={() => handleAction('cancel')}
        >
          Cancel
        </Button>
      </Flex>
    </VestingCard>
  )
}

export default VestingInfoCard
