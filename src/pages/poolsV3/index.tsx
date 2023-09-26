import { Flex, Text, Spinner, Link } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { getTokenInstance } from 'config/constants/token-info'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'
import { useRouter } from 'next/router'
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
  const router = useRouter()

  // TODO: Match up merkle pools to any local data?
  // may be able to use pure merkl data actually..
  // Filter out any pools not in our config setup..?
  console.log(merklData?.pools)

  const pools = (merklData?.pools || []).map((p) => {
    const feeAmount = p.poolFee * 10000
    return {
      ...p,
      feeAmount,
      token: getTokenInstance(p.token0),
      quoteToken: getTokenInstance(p.token1),
      liquidityUrlPath: `/addV3/${p.token0}/${p.token1}/${feeAmount}`,
    }
  })

  // const totalValueFormatted = `~$${(farm?.TVL || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  // const liquidityUrlPathParts = getLiquidityUrlPathParts({
  //   quoteTokenAddress: farm.quoteToken.address,
  //   tokenAddress: farm.token.address,
  // })

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
        {pools?.length > 0 ? pools.map((p) => {
          console.log('p',p)
          return (
            <Link href={p.liquidityUrlPath} marginBottom="1.2rem">
            <StyledPoolCard key={p.pool}>
              <StyledPoolCardInnerContainer>
                <Flex justifyContent="space-between" alignItems="flex-start" mb="-10px">
                  <TokenPairImage
                    variant="inverted"
                    primaryToken={p.token}
                    secondaryToken={p.quoteToken}
                    width={80}
                    height={80}
                  />
                </Flex>

                <PoolCardAction table={table}>
                  <Text>TVL: ${p.tvl}</Text>
                </PoolCardAction>
              </StyledPoolCardInnerContainer>
            </StyledPoolCard>
            </Link>
          )
        }):
        <Spinner /> 
      }
      </Flex>
    </Page>
  )
}
