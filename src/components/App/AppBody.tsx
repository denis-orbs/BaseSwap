import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'

//bodywrapper sits behind the card 
export const BodyWrapper = styled(Card)`
  border-radius: 8px;
  background-color: #000; 
  padding: 0rem;  

  max-width: 550px;
  width: 100%;
`
// export const BodyWrapper = styled(Card)`
//   border-radius: 8px;
//   background-color: #000; 
//   padding: 0.2rem;  
//   box-shadow: 0 2px 12px #000; 
//   max-width: 550px;
//   width: 100%;
// `

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return <BodyWrapper>{children}</BodyWrapper>
}
