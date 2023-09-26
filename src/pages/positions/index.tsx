import Trans from 'components/Trans'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Text, Flex, Card, useMatchBreakpointsContext, SkeletonV2, Skeleton, Box } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import PositionList from 'components/PositionList'
import { RowBetween, RowFixed } from 'components/Row'
import { useV3Positions } from 'hooks/v3/useV3Positions'
import { useEffect, useMemo } from 'react'
import { AlertTriangle, BookOpen, ChevronsRight, Inbox, Layers } from 'react-feather'
import styled, { css, useTheme } from 'styled-components'
import { PositionDetails } from 'types/position'

import { LoadingRows } from './styled'
import { useUserHideClosedPositions } from 'state/user/v3/hooks'
import { isSupportedChain } from 'config/constants/chains'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useFilterPossiblyMaliciousPositions } from 'hooks/v3/useFilterPossiblyMaliciousPositions'
import { useTranslation } from '@pancakeswap/localization'
import Page from 'views/Page'
import { useRouter } from 'next/router'
import 'animate.css'
import { CreateNewIcon } from '@pancakeswap/uikit'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { useUserClaimsDataSelector } from 'state/user/selectors'
import NewPositionButton from 'components/NewPositionButton'

const PageTitle = styled(Text)`
  font-weight: 400;
  color: #fff;
  text-align: center;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 48px;
  }
`

const PageWrapper = styled(AutoColumn)`
  padding: 68px 8px 0px;
  max-width: 870px;
  width: 100%;
`

const TitleRow = styled(RowBetween)`
  color: ${({ theme }) => theme.colors.text};
`

const ButtonRow = styled(RowFixed)`
  & > *:not(:last-child) {
    margin-left: 8px;
  }
`

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

// responsive text
// disable the warning because we don't use the end prop, we just want to filter it out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Label = styled(({ end, ...props }) => <Text {...props} />)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
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
  background: ${({ theme }) => theme.colors.gradients.basedsexgray};
  border: 3px solid ${({ theme }) => theme.colors.cardBorder};

  padding: 0px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const DarkCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexgrayflip};
  border-width: 2px;
  border-color: ${({ theme }) => theme.colors.background};
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
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpointsContext()

  const { isLoading: rewardsLoading, data: rewardData, doClaim, isClaiming } = useMerklRewards()
  const { pendingMerklBSX, pendingMerklXBSX, pendingMerklValue } = useUserClaimsDataSelector()

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
      <PageTitle>MANAGE POSITIONS</PageTitle>
      <Text fontSize="18px">Add or remove liquidity from BaseX Concentrated Liquidity Positions</Text>
      <PageWrapper>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow padding="0" marginBottom="12px">
              <Text fontSize="24px">
                <Trans>CURRENT POSITIONS</Trans>
              </Text>
              <ButtonRow>
                <NewPositionButton currencyIdA="ETH" />
              </ButtonRow>
            </TitleRow>

            <Card marginBottom="12px" style={{ borderWidth: '3px' }}>
              <AutoColumn gap="md" style={{ width: '100%', padding: '8px' }}>
                <AutoColumn gap="md">
                  <RowBetween style={{ alignItems: 'flex-start' }}>
                    <AutoColumn gap="md">
                      <Text fontSize="24px">
                        <Trans>PENDING REWARDS</Trans>
                      </Text>

                      <Text color={theme.colors.primaryBright} fontSize="32px" fontWeight={500}>
                        {t(pendingMerklValue)}
                      </Text>
                    </AutoColumn>
                    <Button
                      disabled={!rewardData?.hasClaims || isClaiming}
                      onClick={() => {
                        doClaim()
                      }}
                    >
                      <Text>{isClaiming ? t('Claiming..') : t('Claim')}</Text>
                    </Button>
                  </RowBetween>
                </AutoColumn>
                {!rewardsLoading ? (
                  <DarkCard paddingX="0rem" paddingY="4px" style={{ borderWidth: '2px' }}>
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingLeft={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={rewardData?.bsxCurrency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {pendingMerklBSX}&nbsp;
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {t(`BSX`)}
                          </Text>
                        </Flex>
                        <Flex
                          justifyContent="center"
                          flexDirection="row"
                          paddingRight={isMobile ? '4px' : '4rem'}
                          alignItems="center"
                        >
                          <CurrencyLogo
                            currency={rewardData?.xbsxCurrency}
                            size="60px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text color="text" fontSize="1.5rem">
                            {pendingMerklXBSX}&nbsp;
                          </Text>
                          <Text color="text" fontSize="1.5rem">
                            {t(`xBSX`)}
                          </Text>
                        </Flex>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                ) : (
                  <Skeleton />
                )}
              </AutoColumn>

              <Flex justifyContent="center">
                <img
                  src="https://924174234-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MZrRrYejMtN3SzZU10r%2Fuploads%2Fgit-blob-ed73190eb9c30bd96c439bdb3af22bf91e8446b9%2Fpowered-by-merkl-dark.png?alt=media"
                  alt="Merkl powered by Angle Labs"
                  width="35%"
                />
              </Flex>
            </Card>

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
                  <Text color={theme.colors.tertiary} textAlign="center" marginBottom="1rem">
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
                      <Text color="#fff">Show closed positions</Text>
                    </Button>
                  )}
                  {showConnectAWallet && <ConnectWalletButton marginBottom="1rem" marginTop="2rem" />}
                </ErrorContainer>
              )}
            </MainContentWrapper>
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </Page>
  )
}
