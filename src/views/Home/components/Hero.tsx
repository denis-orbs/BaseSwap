import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import Image from 'next/image'
import styled, { keyframes } from 'styled-components'
import bunnyImage from '../../../../public/images/home/lunar-bunny/bunny@2x.png'
import CompositeImage, { CompositeImageProps } from './CompositeImage'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'

import baseswap from '../../../../public/images/baselogolarge.png'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled.div`
  width: 100%;
  animation: ${flyingAnim} 3.5s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
  }
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const starsImage: CompositeImageProps = {
  path: '/images/home/lunar-bunny/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-r', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()

  return (
    <>
{/* <BgWrapper>
        <InnerWrapper>{theme.isDark ? <SlideSvgDark width="100%" /> : <SlideSvgLight width="100%" />}</InnerWrapper>
      </BgWrapper> */}
      <Flex
        position="relative"
        flexDirection={['column', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        mt={[account ? '5px' : '5px', null, '0rem']}
        id="homepage-hero"
        
      >
        <Flex 
        marginTop={[ '-3rem', null, null, '0rem' ]} 
        flex="1" flexDirection="column" 
        paddingX={['0px', null, null, '3rem']} 
        marginX={[ '-1rem', null, null, '2rem' ]} 
        >
          <Text fontWeight="900" color="contrast" mb="12px" fontSize={[ '48px', null, null, '100px']}>
            {t('BaseSwap')}
          </Text>
          <Heading scale="md" mb="24px">
            {t('Harder. Better. Faster. Stronger.')}
          </Heading>
          <Flex 
          flexDirection={[ 'column', null, null, 'row' ]}
          marginLeft={['0rem', null, null, '1rem']} 
          marginTop={['0.5rem', null, null, '2rem' ]} 
          alignItems="flex-end" 
          justifyContent={['center', null, null, 'flex-start' ]}>
            {!account && 
            <ConnectWalletButton  
              variant="primary" height="100%"
                width={[ '75vw', null, null, '25vw' ]}
                mr={[ null, null, null, '8px' ]} />}
            <NextLinkFromReactRouter to="/swap">
              <Button 
               mt={[ '1rem', null, null, null ]}
               width={[ '75vw', null, null, '25vw' ]}
              variant={!account ? 'secondary' : 'primarytwo'}>
                {t('Trade Now')}
                </Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <BunnyWrapper>
            <Image src={baseswap} priority placeholder="blur" alt={t('BaseSwap Logo')} />
          </BunnyWrapper>
          {/* <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper> */}
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
