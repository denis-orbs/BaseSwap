import Trans from 'components/Trans'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Text } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { useMemo } from 'react'
import { AlertTriangle, BookOpen, ChevronDown, ChevronsRight, Inbox, Layers } from 'react-feather'
import styled, { css, useTheme } from 'styled-components'
import { PositionDetails } from 'types/position'

import CTACards from './CTACards'
import { LoadingRows } from './styled'
import { useUserHideClosedPositions } from 'state/user/v3/hooks'
import { isSupportedChain } from 'config/constants/chains'
import { useNetworkSupportsV2 } from 'hooks/useNetworkSupportsV2'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import Link from 'next/link'
import { useFilterPossiblyMaliciousPositions } from 'hooks/v3/useFilterPossiblyMaliciousPositions'
import { useTranslation } from '@pancakeswap/localization'
import Page from 'views/Page'

// const PageWrapper = styled(AutoColumn)`
//   padding: 68px 8px 0px;
//   max-width: 870px;
//   width: 100%;

//   @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
//     max-width: 800px;
//     padding-top: 48px;
//   }

//   @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     max-width: 500px;
//     padding-top: 20px;
//   }
// `

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;
`

// const TitleRow = styled(RowBetween)`
//   color: ${({ theme }) => theme.colors.text};
//   @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     flex-wrap: wrap;
//     gap: 12px;
//     width: 100%;
//   }
// `

const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.colors.text};
`

// const ButtonRow = styled(RowFixed)`
//   & > *:not(:last-child) {
//     margin-left: 8px;
//   }

//   @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     width: 100%;
//     flex-direction: row;
//     justify-content: space-between;
//   }
// `

const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }
`

// const PoolMenu = styled(Menu)`
//   margin-left: 0;
//   @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     flex: 1 1 auto;
//     width: 50%;
//   }

//   a {
//     width: 100%;
//   }
// `
const PoolMenuItem = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-weight: 500;
`
const MoreOptionsButton = styled(Button)`
  border-radius: 12px;
  flex: 1 1 auto;
  padding: 6px 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  margin-right: 8px;
`

const MoreOptionsText = styled(Text)`
  align-items: center;
  display: flex;
`

const ErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  max-width: 300px;
  min-height: 25vh;
`

const IconStyle = css`
  width: 48px;
  height: 48px;
  margin-bottom: 0.5rem;
`

const NetworkIcon = styled(AlertTriangle)`
  ${IconStyle}
`

const InboxIcon = styled(Inbox)`
  ${IconStyle}
`

// const ResponsiveButtonPrimary = styled(Button)`
//   border-radius: 12px;
//   font-size: 16px;
//   padding: 6px 8px;
//   width: fit-content;
//   @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     flex: 1 1 auto;
//     width: 50%;
//   }
// `

const ResponsiveButtonPrimary = styled(Button)`
  border-radius: 12px;
  font-size: 16px;
  padding: 6px 8px;
  width: fit-content;
`

const MainContentWrapper = styled.main`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 0;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  overflow: hidden;
`

function PositionsLoadingPlaceholder() {
  return (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  )
}

function WrongNetworkCard() {
  const theme = useTheme()

  return (
    <>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <Text>
                <Trans>Pools</Trans>
              </Text>
            </TitleRow>

            <MainContentWrapper>
              <ErrorContainer>
                <Text color={theme.colors.tertiary} textAlign="center">
                  <NetworkIcon strokeWidth={1.2} />
                  <div data-testid="pools-unsupported-err">
                    <Trans>Your connected network is unsupported.</Trans>
                  </div>
                </Text>
              </ErrorContainer>
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
      {/* <SwitchLocaleLink /> */}
    </>
  )
}

export default function Pool() {
  const { account, chainId } = useActiveWeb3React()
  const networkSupportsV2 = useNetworkSupportsV2()
  const { t } = useTranslation()

  const theme = useTheme()
  const [userHideClosedPositions, setUserHideClosedPositions] = useUserHideClosedPositions()

  const { positions, loading: positionsLoading } = useV3Positions(account)

  const [openPositions, closedPositions] = positions?.reduce<[PositionDetails[], PositionDetails[]]>(
    (acc, p) => {
      acc[p.liquidity?.isZero() ? 1 : 0].push(p)
      return acc
    },
    [[], []],
  ) ?? [[], []]

  const userSelectedPositionSet = useMemo(
    () => [...openPositions, ...(userHideClosedPositions ? [] : closedPositions)],
    [closedPositions, openPositions, userHideClosedPositions],
  )

  const filteredPositions = useFilterPossiblyMaliciousPositions(userSelectedPositionSet)

  if (!isSupportedChain(chainId)) {
    return <WrongNetworkCard />
  }

  const showConnectAWallet = Boolean(!account)

  const menuItems = [
    {
      content: (
        <PoolMenuItem>
          <Trans>Migrate</Trans>
          <ChevronsRight size={16} />
        </PoolMenuItem>
      ),
      link: '/migrate/v2',
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>V2 liquidity</Trans>
          <Layers size={16} />
        </PoolMenuItem>
      ),
      link: '/pools/v2',
      external: false,
    },
    {
      content: (
        <PoolMenuItem>
          <Trans>Learn</Trans>
          <BookOpen size={16} />
        </PoolMenuItem>
      ),
      link: 'https://support.uniswap.org/hc/en-us/categories/8122334631437-Providing-Liquidity-',
      external: true,
    },
  ]

  return (
    <Page>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0">
              <Text>
                <Trans>Pools</Trans>
              </Text>
              <ButtonRow>
                {/* <Link data-cy="join-pool-button" id="join-pool-button" href="/addV3/ETH">
                + {t('New Position')}
              </Link> */}
              </ButtonRow>
            </TitleRow>

            <MainContentWrapper>
              {positionsLoading ? (
                <PositionsLoadingPlaceholder />
              ) : filteredPositions && closedPositions && filteredPositions.length > 0 ? (
                <PositionList
                  positions={filteredPositions}
                  setUserHideClosedPositions={setUserHideClosedPositions}
                  userHideClosedPositions={userHideClosedPositions}
                />
              ) : (
                <ErrorContainer>
                  <Text color={theme.colors.tertiary} textAlign="center">
                    <InboxIcon strokeWidth={1} style={{ marginTop: '2em' }} />
                    <div>
                      <Trans>Your active V3 liquidity positions will appear here.</Trans>
                    </div>
                  </Text>
                  {!showConnectAWallet && closedPositions.length > 0 && (
                    <Button
                      style={{ marginTop: '.5rem' }}
                      onClick={() => setUserHideClosedPositions(!userHideClosedPositions)}
                    >
                      <Trans>Show closed positions</Trans>
                    </Button>
                  )}
                  {showConnectAWallet && <ConnectWalletButton />}
                </ErrorContainer>
              )}
            </MainContentWrapper>

            {/* <CTACards /> */}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </Page>
  )
}
