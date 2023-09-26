import { Flex, Text, Spinner, Heading, useTooltip, HelpIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { getTokenInstance } from 'config/constants/token-info'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'
import Page from 'views/Page'
import PageHeader from 'components/PageHeader'
import {
  PoolCardAction,
  StyledPoolCard,
  StyledPoolCardInnerContainer,
} from 'views/xFarms/components/NFTPoolCard/Styled'
import { PoolCardActionProps } from 'views/xFarms/components/types'
import TypeIt from 'typeit-react'
import 'animate.css'
import { getTVLFormatted } from 'views/xFarms/utils'
import NewPositionButton from 'components/NewPositionButton'

const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 68px;
  }
`

export default function PoolV3({ table }: PoolCardActionProps) {
  const { data: merklData } = useMerklRewards()

  console.log(merklData?.pools)

  const pools = (merklData?.pools || []).map((p) => {
    const feeAmount = p.poolFee * 10000
    return {
      ...p,
      feeAmount,
      token: getTokenInstance(p.token0),
      quoteToken: getTokenInstance(p.token1),
      tvl: getTVLFormatted(p.tvl),
    }
  })

  return (
    <Page>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <WelcomeTypeIt
              options={{
                cursorChar: ' ',
                cursorSpeed: 1000000,
                speed: 75,
              }}
              speed={10}
              getBeforeInit={(instance) => {
                instance.type('V3 Pools', { speed: 5000 })
                return instance
              }}
            ></WelcomeTypeIt>
          </Flex>
        </Flex>
      </PageHeader>
      <Flex>
        {pools?.length > 0 ? (
          pools.map((p) => {
            console.log('p', p)

            const { targetRef, tooltip, tooltipVisible } = useTooltip(
              `${p.aprs[0].label}:  ${p.aprs[0].value} \n${p.aprs[1].label}:  ${p.aprs[1].value} \n${p.aprs[2].label}:  ${p.aprs[2].value}`,
               { placement: 'top-end', tooltipOffset: [20, 10] },
             )


            return (
              <StyledPoolCard key={p.pool}>
                <StyledPoolCardInnerContainer>
                  <Flex justifyContent="space-between" alignItems="center" mb="12px">
                    <TokenPairImage
                      variant="inverted"
                      primaryToken={p.token}
                      secondaryToken={p.quoteToken}
                      width={64}
                      height={64}
                      marginRight={12}
                    />
                    <Flex flexDirection="column" alignItems="flex-end">
                      <Heading mb="4px">
                        {p.token.symbol}-{p.quoteToken.symbol}
                      </Heading>
                    </Flex>
                  </Flex>
                  <PoolCardAction table={table}>
                    <Flex flexDirection="row" justifyContent="space-between">
                      <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                        APR:
                      </Text>
                      <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                        {p.aprs[0].value}
                      </Text>
                    </Flex>
                    <Flex flexDirection="row" justifyContent="space-between" mb={12}>
                      <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                        TVL:
                      </Text>
                      <Flex flexDirection="row" alignItems="center">
                        <Text color="textSubtle" textTransform="uppercase" fontWeight="600" fontSize="14px">
                          {p.tvl}
                        </Text>
                        <span ref={targetRef}>
                          <HelpIcon width="16px" height="16px" color="textSubtle" marginLeft="4px"/>
                        </span>
                        {tooltipVisible && tooltip}
                      </Flex>
                    </Flex>
                    <NewPositionButton
                      currencyIdA={p.token.address}
                      currencyIdB={p.quoteToken.address}
                      feeAmount={p.feeAmount}
                    />
                  </PoolCardAction>
                </StyledPoolCardInnerContainer>
              </StyledPoolCard>
            )
          })
        ) : (
          <Spinner />
        )}
      </Flex>
    </Page>
  )
}
