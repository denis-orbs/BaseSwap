import { FeeAmount } from '@baseswapfi/v3-sdk2'
import { Text, Button, promotedGradient } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import { useFeeTierDistribution } from 'hooks/v3/useFeeTierDistribution'
import { PoolState } from 'hooks/v3/usePools'
import React from 'react'
import styled, { css } from 'styled-components'

import { FeeTierPercentageBadge } from './FeeTierPercentageBadge'
import { FEE_AMOUNT_DETAIL } from './shared'
import { useTranslation } from '@pancakeswap/localization'
import { LightTertiaryCard } from 'components/Card'

// const ResponsiveText = styled(Text)`
//   line-height: 16px;
//   font-size: 14px;

//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToSmall`
//     font-size: 12px;
//     line-height: 12px;
//   `};
// `
const ResponsiveText = styled(Text)`
  line-height: 16px;
  font-size: 14px;
`

const FeeOptionContainer = styled.div<{ active: boolean }>`
  cursor: pointer;
  height: 100%;
  animation: ${promotedGradient} 4s ease infinite;
  ${({ active }) =>
    active &&
    css`
      background-image: ${({ theme }) => theme.colors.gradients.basedsex};
    `}
  border-radius: 16px;
  padding: 2px 2px 4px 2px;
  &:hover {
    opacity: 0.7;
  }
`

interface FeeOptionProps {
  feeAmount: FeeAmount
  active: boolean
  distributions: ReturnType<typeof useFeeTierDistribution>['distributions']
  poolState: PoolState
  onClick: () => void
}

export function FeeOption({ feeAmount, active, poolState, distributions, onClick }: FeeOptionProps) {
  const { t } = useTranslation()

  // return (
  //   <Button onClick={onClick}>
  //     <AutoColumn gap="sm" justify="flex-start">
  //       <AutoColumn justify="flex-start" gap="6px">
  //         <ResponsiveText>{t(`${FEE_AMOUNT_DETAIL[feeAmount].label}%`)}</ResponsiveText>
  //         <Text fontWeight={400} fontSize="12px" textAlign="left">
  //           {FEE_AMOUNT_DETAIL[feeAmount].description}
  //         </Text>
  //       </AutoColumn>

  //       {distributions && (
  //         <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
  //       )}
  //     </AutoColumn>
  //   </Button>
  // )

  return (
    <FeeOptionContainer active={active} onClick={onClick}>
      <LightTertiaryCard active={active} height="100%">
        <AutoColumn justify="flex-start" gap="6px">
          <ResponsiveText>{t(`${FEE_AMOUNT_DETAIL[feeAmount].label}%`)}</ResponsiveText>
          <Text fontWeight={400} fontSize="12px" textAlign="left">
            {FEE_AMOUNT_DETAIL[feeAmount].description}
          </Text>

          {distributions && (
            <FeeTierPercentageBadge distributions={distributions} feeAmount={feeAmount} poolState={poolState} />
          )}
        </AutoColumn>
      </LightTertiaryCard>
    </FeeOptionContainer>
  )
}
