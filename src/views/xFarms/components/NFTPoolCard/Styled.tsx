import { useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { PoolCardActionProps } from '../types'

export const StyledPoolCard = styled(Card)`
  align-self: baseline;
  max-width: 475px;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 450px;
    margin: 0 12px 24px;
  }
`

export const StyledPoolCardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 16px;
`

export const PoolCardAction = styled.div<PoolCardActionProps>`
  ${({ table }) =>
    table
      ? css`
          margin-bottom: 12px;
        `
      : css`
          margin-bottom: 0px;
        `}
  padding-top: 16px;
`
