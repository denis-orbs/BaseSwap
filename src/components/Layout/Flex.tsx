import { Flex, FlexProps } from '@pancakeswap/uikit'
import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  flex-direction: row; 
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 340px;
    max-width: 35%;
    width: 100%;
    margin: 0 8px;
    margin-bottom: 32px;
  }
`

export interface FlexGapProps extends FlexProps {
  gap?: string
  rowGap?: string
  columnGap?: string
}

export const FlexGap = styled(Flex)<FlexGapProps>`
  gap: ${({ gap }) => gap};
  row-gap: ${({ rowGap }) => rowGap};
  column-gap: ${({ columnGap }) => columnGap};
`

export default FlexLayout
