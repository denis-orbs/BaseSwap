import styled from 'styled-components'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'
import MetricsSection from './components/MetricsSection'
import TVL from './components/TVL'
import readyplayerone from '../../../public/images/readybanner1.png'
import useScrollSnap from "react-use-scroll-snap";
import { useRef } from 'react'
import { AnimationOnScroll } from 'react-animation-on-scroll'; 

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 16px;
  }
`

const Home: React.FC = () => {
  const { theme } = useTheme()
 
  return (
    <>
      <PageMeta />

      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(to bottom right, #000, #222 )'
            : 'linear-gradient(139.73deg, #0154FD 0%, #fff 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        {/* <AnimationOnScroll initiallyVisible={true} delay={10} 
          offset={50} 
          animateIn="animate__lightSpeedInLeft" animateOut="animate__bounceOutRight" animateOnce={true}>
           */}
            <Hero />
        
        {/* </AnimationOnScroll> */}
        
        {/* <AnimationOnScroll initiallyVisible={false} delay={1000} 
            offset={50} 
            animateIn="animate__lightSpeedInLeft" animateOut="animate__bounceOutRight" animateOnce={true}>
           */}
          <TVL />
        
        {/* </AnimationOnScroll> */}

      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(to top right, #000, #222 )'
            : 'linear-gradient(180deg, #0154FD 0%, #fff 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <MetricsSection />
      </PageSection>
    </>
  )
}

export default Home
