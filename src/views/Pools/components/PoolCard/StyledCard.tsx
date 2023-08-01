import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

export const StyledCard = styled(Card)<{ isFinished?: boolean }>`
  min-width: 425px;
  border: 4px solid ${({ theme }) => theme.colors.text};
  max-width: 100%;
  margin: 0 0 24px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-self: baseline;
  position: relative;
  color: ${({ isFinished, theme }) => theme.colors[isFinished ? 'textDisabled' : 'secondary']};

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 425px;
    margin: 0 12px 0px;
  }
`

export default StyledCard
