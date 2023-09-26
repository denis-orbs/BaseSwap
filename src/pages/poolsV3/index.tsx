import { Flex, Text } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { getTokenInstance } from 'config/constants/token-info'
import useMerklRewards from 'lib/hooks/merkl-rewards/useMerklRewards'
import { useRouter } from 'next/router'
import Page from 'views/Page'
import {
  PoolCardAction,
  StyledPoolCard,
  StyledPoolCardInnerContainer,
} from 'views/xFarms/components/NFTPoolCard/Styled'
import { PoolCardActionProps } from 'views/xFarms/components/types'

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
      <Text>V3 POOLS</Text>
      <Flex>
        {pools.map((p) => {
          return (
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
          )
        })}
      </Flex>
    </Page>
  )
}
