import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const Card = styled(Box)<{
  width?: string
  padding?: string
  border?: string
  borderRadius?: string
}>`
  width: ${({ width }) => width ?? '100%'};
  padding: ${({ padding }) => padding ?? '1.25rem'};
  border: ${({ border }) => border};
  border-radius: ${({ borderRadius }) => borderRadius ?? '8px'};
  background-color: transparent;
`
export default Card

export const LightCard = styled(Card)`
  border: 3px solid ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  padding: 12px;
`
export const BasedSex = styled(Card)`
  border: 2px solid ${({ theme }) => theme.colors.text};
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  padding: 0rem;
`

export const LightGreyCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: transparent;
  border-radius: 2px;
  padding: 8px 10px;
`

export const GreyCard = styled(Card)`
  background-color: transparent;
`

export const LightTertiaryCard = styled(Card)<{ active: boolean }>`
  border: 1px solid ${({ theme, active }) => (active ? 'none' : theme.colors.cardBorder)};
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 4px 4px 8px;
`
