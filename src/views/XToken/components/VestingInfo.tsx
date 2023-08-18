import { Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useXTokenInfo } from 'state/xToken/hooks'
import styled from 'styled-components'
import VestingInfoCard from './VestingInfoCard'

interface TextProps {
  isMobile: boolean
}
export const VestingContainer = styled(Card)`
  min-width: 300px;
  margin-bottom: 12px;
  width: 100%;
  display: flex;
  padding: 0.5rem;
  border-image: linear-gradient(225deg, #7303c0, #ec38bc, #f86c0d, #fee383) 1;
  border-width: 2px;
  border-style: solid;
  backdrop-filter: blur(1px);
`

const CardTitle = styled.div<TextProps>`
  color: #fff;
  font-size: ${(props) => (props.isMobile ? '2rem' : '2rem')};
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 5px;
  line-height: ${(props) => (props.isMobile ? '2.1rem' : '2.1rem')};
  margin-bottom: ${(props) => (props.isMobile ? '0.5rem' : '0.2rem')};
  margin-top: 0.2rem;
  background: -webkit-linear-gradient(#fff, #8797a9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const VestingInfo: React.FC = () => {
  const { redemptionInfo } = useXTokenInfo()
  const { isMobile } = useMatchBreakpoints()

  return (
    <VestingContainer>
      <CardTitle isMobile={isMobile}>Vesting</CardTitle>

      {redemptionInfo.vestingList.map((vesting) => {
        return <VestingInfoCard key={vesting.endTime} vesting={vesting} />
      })}
    </VestingContainer>
  )
}

export default VestingInfo
