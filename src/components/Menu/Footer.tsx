import { memo } from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, LinkExternal, Link, Flex, Svg, Image, Button, TwitterIcon, TelegramIcon, DiscordIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'
import { IoMdDocument } from 'react-icons/io'

const Wrapper = memo(styled.div<{ $isSide: boolean }>`
  width: 100%;
  height: ${({ $isSide }) => ($isSide ? '100%' : 'auto')};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  display: none; 
  align-items: center;
  padding-top: 8px;
  padding-right: ${({ $isSide }) => ($isSide ? '4px' : '0px')};
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: ${({ $isSide }) => ($isSide ? 'column' : 'row')};
    display: flex; 
  }
`)
const DocsIcon = styled(IoMdDocument)`
  color: #0154FD;
  width: 28px;
  height: 28px; 
`;

type FooterVariant = 'default' | 'side'

const Footer: React.FC<{ variant?: FooterVariant; helpUrl?: string }> = ({
  variant = 'default',
  helpUrl = EXCHANGE_DOCS_URLS,
}) => {
  const { t } = useTranslation()
  const isSide = variant === 'side'
  return (
    <Wrapper $isSide={isSide}>
      {isSide && <Flex flexGrow={1} />}
      <Flex
        flexDirection={['row', null, null, 'column' ]}
        flexGrow={isSide ? 0 : 1}
        alignItems={['center', null, null, 'flex-end' ]}
        mb="12px" mr="8px" 
        width={['100vw', '100%', '100%', isSide ? '100%' : 'auto']}
        justifyContent={['center', 'center', 'center', 'flex-end']} 
        
        >
        
          <Link marginRight={['1rem', null, null, '0rem' ]} 
          marginBottom={['0px', null, null, '16px']}
          href="https://twitter.com/BaseSwap_Fi" >
                <TwitterIcon width="28px" color="#0154FD" /> 
          </Link>

          <Link 
          marginBottom={['0px', null, null, '16px']}
          marginRight={['1rem', null, null, '0rem' ]} href="https://discord.gg/2zUzjyGxw2" >
                <DiscordIcon width="28px" color="#0154FD" /> 
          </Link>

          <Link 
          marginBottom={['0px', null, null, '10px']}

          marginRight={['1rem', null, null, '0rem' ]} href="https://t.me/BaseswapFi" >
                <TelegramIcon width="28px" color="#0154FD" /> 
          </Link>
        
          <Link            
          marginBottom={['0px', null, null, '0px']}
          href="https://base-swap-1.gitbook.io/baseswap/" >
                <DocsIcon />
          </Link>
      </Flex>
    </Wrapper>
  )
}

export default memo(Footer)
