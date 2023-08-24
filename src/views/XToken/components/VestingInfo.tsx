import { Card, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useXTokenInfo } from 'state/xToken/hooks'
import styled from 'styled-components'
import VestingInfoCard from './VestingInfoCard'

interface TextProps {
  isMobile: boolean
}
export const VestingContainer = styled(Card)`
  min-width: 400px;
  margin-bottom: 12px;
  display: flex;
  width: 100%; 
  padding: 0.5rem;
  border: 2px solid #fff; 

  backdrop-filter: blur(1px);
`

const CardTitle = styled.div<TextProps>`
  color: #0154FD;
  font-size: ${(props) => (props.isMobile ? '2rem' : '3rem')};
  font-weight: 600;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: ${(props) => (props.isMobile ? '0.5rem' : '0.2rem')};
  margin-top: 0.2rem;

`

const VestingInfo: React.FC = () => {
  const { redemptionInfo } = useXTokenInfo()
  const { isMobile } = useMatchBreakpoints()

  return (
    <VestingContainer>
      <CardTitle isMobile={isMobile}>Underway...</CardTitle>

      {redemptionInfo.vestingList.map((vesting) => {
        return <VestingInfoCard key={vesting.endTime} vesting={vesting} />
      })}
    </VestingContainer>
  )
}

export default VestingInfo
