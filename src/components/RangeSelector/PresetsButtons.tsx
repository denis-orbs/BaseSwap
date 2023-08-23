import { Button } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Row'
import Trans from 'components/Trans'
import styled from 'styled-components'

const CustomButton = styled(Button).attrs(() => ({
  padding: '6px',
  $borderRadius: '8px',
}))`
  color: ${({ theme }) => theme.colors.primary};
  flex: 1;
`

interface PresetsButtonsProps {
  onSetFullRange: () => void
}

export default function PresetsButtons({ onSetFullRange }: PresetsButtonsProps) {
  return (
    <AutoRow gap="4px" width="auto">
      <CustomButton data-testid="set-full-range" onClick={onSetFullRange}>
        <Trans>Full Range</Trans>
      </CustomButton>
    </AutoRow>
  )
}
