import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

//bodywrapper sits behind the card
export const BodyWrapper = styled(Card)`
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  padding: 0rem;
  margin-top: 1rem; 
  max-width: 550px;
  width: 100%;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
