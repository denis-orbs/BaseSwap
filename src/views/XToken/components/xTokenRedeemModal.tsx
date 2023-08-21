import React, { useCallback, useState } from 'react'
import { Button, Modal, Text, Flex, Box, BalanceInput, Skeleton, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useXToken } from 'hooks/useContract'
import { formatEther, parseUnits } from '@ethersproject/units'
import { ONE_DAY_UNIX } from 'config/constants/info'
import styled from 'styled-components'
import useXTokenActions from '../hooks/useXTokenActions'

interface TextProps {
  isMobile: boolean
}

const RedeemText = styled.div<TextProps>`
  color: #fff;
  font-size: ${(props) => (props.isMobile ? '0.9rem' : '0.9rem')};
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  line-height: ${(props) => (props.isMobile ? '1rem' : '1rem')};
  margin-bottom: ${(props) => (props.isMobile ? '1rem' : '1rem')};
  background: -webkit-linear-gradient(#fff, #8797a9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

interface xTokenRedeemModalProps {
  userXTokenBalance: BigNumber
  onDismiss?: () => void
}

// TODO: Get settings from contract instead of hard code
const minRedeemDuration = 15 // days, 1296000 seconds
const maxRedeemDuration = 30 // days, 2592000  seconds

const minRedeemRatio = 50 // 50%
const maxRedeemRatio = 100 // 100%

const XTokenRedeemModal: React.FC<xTokenRedeemModalProps> = ({ userXTokenBalance, onDismiss }) => {
  const [convertAmount, setConvertAmount] = useState<number>()
  const [amountReceiving, setAmountReceiving] = useState('0')
  const [redeemRatio, setRedeemRatio] = useState(50) // % of original BSX to receive given the chosen vesting time
  const [vestingDays, setVestingDays] = useState(minRedeemDuration)
  const [loadingOutput, setLoadingOutput] = useState(false)
  const { isMobile } = useMatchBreakpoints()

  const { doXTokenRedemption, pendingTx } = useXTokenActions()

  const { toastSuccess } = useToast()

  const xToken = useXToken()

  // async function getBSXOut(amount: number, days: number) {
  //   if (amount) {
  //     setLoadingOutput(true)

  //     const back = await xToken.getAmountByVestingDuration(parseUnits(String(amount)), days * ONE_DAY_UNIX)
  //     const receiving = formatEther(back)

  //     setAmountReceiving(receiving)
  //     setLoadingOutput(false)
  //   }
  // }

  const getBSXOut = useCallback(
    async (amount: number, days: number) => {
      if (amount) {
        setLoadingOutput(true)

        const back = await xToken.getAmountByVestingDuration(parseUnits(String(amount)), days * ONE_DAY_UNIX)
        const receiving = formatEther(back)

        setAmountReceiving(receiving)
        setLoadingOutput(false)
      }
    },
    [xToken],
  )

  // Converted from contract
  function getRatio(days: number) {
    const ratio =
      minRedeemRatio +
      ((days - minRedeemDuration) * (maxRedeemRatio - minRedeemRatio)) / (maxRedeemDuration - minRedeemDuration)

    return ratio
  }

  function updateDurationAndRatio(days: number, amount?: number) {
    let daysCount = days
    if (daysCount < minRedeemDuration) {
      daysCount = minRedeemDuration
    }

    if (daysCount > maxRedeemDuration) {
      daysCount = maxRedeemDuration
    }

    // Update for amount or duration
    if (amount > 0 || daysCount !== vestingDays) {
      getBSXOut(amount || convertAmount, daysCount)
    }

    setVestingDays(daysCount)
    const ratio = getRatio(daysCount)
    setRedeemRatio(ratio)

    // set amounts if applicable
    if (amount || amount === 0) {
      setConvertAmount(amount)
    }
  }

  function incrementVesting() {
    updateDurationAndRatio(vestingDays + 1)
  }

  function decrementVesting() {
    updateDurationAndRatio(vestingDays - 1)
  }

  function handleInputChange(amount: string) {
    if (amount) {
      updateDurationAndRatio(vestingDays, parseFloat(amount))
    }
  }

  function handleMaxInput() {
    updateDurationAndRatio(vestingDays, userXTokenBalance.div(1e18).toNumber())
  }

  function handleMaxRedeemTime() {
    updateDurationAndRatio(maxRedeemDuration, convertAmount)
  }

  function resetRedeemTime() {
    updateDurationAndRatio(minRedeemDuration, 0)
  }

  function getDurationMonths() {
    const scaled = vestingDays * (vestingDays > 30 ? 2 : 1)
    const months = scaled / 30
    return Math.floor(months)
  }

  function getDurationDays() {
    return vestingDays % 30
  }

  const handleRedeem = async () => {
    const receipt = await doXTokenRedemption(convertAmount.toString(), vestingDays * ONE_DAY_UNIX)

    if (receipt?.status) {
      toastSuccess(
        ``,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>Your vesting has started!</ToastDescriptionWithTx>,
      )

      onDismiss?.()
    }
  }

  const RedemptionTime = () => {
    return (
      <Box mt="10px">
        <Box mt="2rem">
          <RedeemText isMobile={isMobile}>Redemption duration</RedeemText>
        </Box>

        <Flex justifyContent="space-around" mt="15px">
          <Button variant="secondary" className="glow2small" onClick={resetRedeemTime}>
            Reset
          </Button>

          <Button variant="menuconnect" className="glow2small" onClick={decrementVesting}>
            -
          </Button>

          <Flex flexDirection="column">
            <Text letterSpacing="2px" fontSize="12px" textAlign="center">
              MONTHS
            </Text>
            <Text fontSize="12px" color="text" textAlign="center">
              {getDurationMonths()}
            </Text>
          </Flex>

          <Flex flexDirection="column">
            <Text fontSize="12px" letterSpacing="2px" textAlign="center">
              DAYS
            </Text>
            <Text fontSize="12px" color="text" textAlign="center">
              {getDurationDays()}
            </Text>
          </Flex>

          <Button variant="menuconnect" className="glow2small" onClick={incrementVesting}>
            +
          </Button>

          <Button variant="secondary" className="glow2small" mr="15px" onClick={handleMaxRedeemTime}>
            MAX
          </Button>
        </Flex>
      </Box>
    )
  }

  return (
    <Modal title="Redeem xBSX" onDismiss={onDismiss}>
      <Box maxWidth="500px" mb="30px">
        <Text color="text" fontSize="0.8rem" letterSpacing="1px" textAlign="center" mb="15px">
          Redeem xBSX into BSX over a vesting period. The longer the vesting period selected, the greater return you
          will receive in BSX.
        </Text>
        <Text color="text" fontSize="0.8rem" letterSpacing="1px" textAlign="center" mb="15px">
          Vesting can be as brief as fifteen days (1 xBSX : 0.5 BSX ratio), up to thirty days (1:1 ratio). If you change
          your mind, you can cancel your redemption and receive your xBSX back.
        </Text>

        <Box
          m="15px"
          style={{ boxShadow: '0 0 4px #fff', borderRadius: '12px', padding: '0.5rem', paddingTop: '1rem' }}
        >
          <Flex>
            <BalanceInput width="80%" value={convertAmount} onUserInput={handleInputChange} decimals={18} />

            <Button width="20%" mt="8px" variant="secondary" className="connectglow" onClick={handleMaxInput}>
              Max
            </Button>
          </Flex>

          <Flex justifyContent="flex-end">
            <Text fontWeight="500" color="text" textTransform="uppercase" fontSize="0.8rem" textAlign="right">
              xBSX Balance: {getFullDisplayBalance(userXTokenBalance, 18, 6)}
            </Text>
          </Flex>
        </Box>

        <RedemptionTime />

        <Flex justifyContent="space-between" mt="15px">
          <RedeemText isMobile={isMobile}>redemption ratio</RedeemText>
          <RedeemText isMobile={isMobile}>{redeemRatio.toFixed(2)}%</RedeemText>
        </Flex>
        <Flex justifyContent="space-between">
          <RedeemText isMobile={isMobile}>BSX received</RedeemText>
          <Flex flexDirection="row">
            <RedeemText isMobile={isMobile}>{loadingOutput ? <Skeleton /> : amountReceiving}</RedeemText>
          </Flex>
        </Flex>
      </Box>

      <Button
        width="100%"
        mt="8px"
        variant="secondary"
        className="connectglow"
        disabled={!convertAmount || pendingTx}
        onClick={handleRedeem}
      >
        Redeem
      </Button>
    </Modal>
  )
}

export default XTokenRedeemModal
