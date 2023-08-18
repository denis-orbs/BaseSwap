import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '../types'
import CardHeading from './CardHeading'
import CardActionsContainer from './CardActionsContainer'
import DetailsSection from './DetailsSection'
import useNftPools from 'views/xFarms/hooks/useNftPools'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'

const StyledCard = styled(Card)`
  align-self: baseline;
  max-width: 100%;
  margin: 0 0 24px 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 400px;
    margin: 0 12px 24px;
  }
`

const NFTPoolCardInnerContainer = styled(Flex)`
flex-direction: column;
justify-content: space-around;
padding: 24px;
`

const ExpandingWrapper = styled.div`
padding: 24px;
border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
overflow: hidden;
`

interface NFTPoolCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  stakedOnly: boolean
}

const NFTPoolCard: React.FC<NFTPoolCardProps> = ({ farm, removed, stakedOnly }) => {
  const [showExpandableSection, setShowExpandableSection] = useState(false)
  const { t } = useTranslation()
  const totalValueFormatted = `~$${(farm?.TVL || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  const liquidityUrlPathParts = getLiquidityUrlPathParts({
    quoteTokenAddress: farm.quoteToken.address,
    tokenAddress: farm.token.address,
  })

  const earnLabel = t('BSWAP')
  const lpLabel = farm.lpSymbol && farm.lpSymbol.replace('PANCAKE', '')
  const addLiquidityUrl = `${BASE_ADD_LIQUIDITY_URL}/${liquidityUrlPathParts}`

  const lpAddress = getAddress(farm.lpAddresses)
  const isPromotedFarm = farm.token.symbol === 'BSWAP'

  const toggleExpandableSection = useCallback(() => {
    setShowExpandableSection((prev) => !prev)
  }, [])

  const { chainId } = useWeb3React()

  const { lpAddresses, nftPoolAddress } = farm

  const { getInitialPoolPosition } = useNftPools()
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const stakedBalance = position?.stakedBalance || BIG_ZERO

  return (stakedOnly && parseInt(stakedBalance.toString()) > 0) || !stakedOnly ? (
    <StyledCard isActive={isPromotedFarm}>
      <NFTPoolCardInnerContainer>
        <CardHeading
          lpLabel={lpLabel}
          token={farm.token}
          quoteToken={farm.quoteToken}
          quantum={farm.quantum}
          isNew={farm.isNew}
          narrow={farm.narrow}
          classic={farm.classic}
          wide={farm.wide}
          stable={farm.stable}
          isCore={farm.isCore}
        />
        {!removed && (
            <Flex justifyContent="space-between" alignItems="center">
            <Text>{t('APR')}:</Text>
            <Text bold style={{ display: 'flex', alignItems: 'center' }}>
                {farm.apr ? (
                <span>{`${Number(Number(farm.apr).toFixed(2)).toLocaleString()}%`}</span>
              ) : (
                <Skeleton height={24} width={80} />
              )}
            </Text>
          </Flex>
        )}

        <Flex justifyContent="space-between">
          <Text>{t('Earn')}:</Text>
          <Text bold>{earnLabel}</Text>
        </Flex>
        <CardActionsContainer farm={farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} />
      </NFTPoolCardInnerContainer>

      <ExpandingWrapper>
        <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
        {showExpandableSection && (
          <DetailsSection
            removed={removed}
            totalValueFormatted={totalValueFormatted}
            bscScanAddress={getBscScanLink(lpAddress, 'address')}
            infoAddress={`/info/pool/${lpAddress}`}
            lpLabel={lpLabel}
            addLiquidityUrl={addLiquidityUrl}
            auctionHostingEndDate={farm.auctionHostingEndDate}
            farm={farm}
          />
        )}
      </ExpandingWrapper>
    </StyledCard>
  ) : null
}

export default NFTPoolCard
