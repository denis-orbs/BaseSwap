import { MaxButton } from 'pages/positions/styled'
import { Text } from 'rebass'
import styled from 'styled-components'

// export const Wrapper = styled.div`
//   position: relative;
//   padding: 20px;
//   min-width: 460px;

//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
//     min-width: 340px;
//   `};
// `

export const Wrapper = styled.div`
  position: relative;
  padding: 20px;
  min-width: 460px;
`

export const SmallMaxButton = styled(MaxButton)`
  font-size: 12px;
  color: #000;
  
`

// export const ResponsiveHeaderText = styled(Text)`
//   font-size: 40px;
//   font-weight: 500;
//   ${({ theme }) => theme.deprecated_mediaWidth.deprecated_upToExtraSmall`
//      font-size: 24px
//   `};
// `

export const ResponsiveHeaderText = styled(Text)`
  font-size: 40px;
  font-weight: 500;
  color: #fff;
`

export default Wrapper