import styled from 'styled-components'
import PageSection from 'components/PageSection'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import Hero from './components/Hero'
import MetricsSection from './components/MetricsSection'
import TVL from './components/TVL'

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
            ? 'linear-gradient(to bottom, #020079, #0154FD, #ccc )'
            : 'linear-gradient(139.73deg, #E6FDFF 0%, #F3EFFF 100%)'
        }
        index={2}
        hasCurvedDivider={false}
      >
        <Hero />
        <TVL />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(to top, #020079, #0154FD, #ccc )'
            : 'linear-gradient(180deg, #FFFFFF 22%, #D7CAEC 100%)'
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
