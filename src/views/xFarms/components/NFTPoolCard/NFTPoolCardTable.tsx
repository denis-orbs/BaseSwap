import { useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { BigNumber } from 'bignumber.js'
import { Card, Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import ExpandableSectionButton from 'components/ExpandableSectionButton'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import getLiquidityUrlPathParts from 'utils/getLiquidityUrlPathParts'
import { FarmWithStakedValue } from '../types'
import CardHeadingTable from './CardHeadingTable'
import CardActionsContainer from './CardActionsContainer'
import DetailsSection from './DetailsSection'
import useNftPools from 'views/xFarms/hooks/useNftPools'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'

interface ExpandingWrapperProps {
  expanded: boolean;
}

const StyledCard = styled(Card)`
  align-self: baseline;
  min-width: 100% !important;
  max-width: 100% !important;
  margin: 0 0 0px 0 !important;
  ${({ theme }) => theme.mediaQueries.md} {
    max-width: 100% !important;
    width: 100% !important
    margin: 0 0 0px 0 !important;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 90% !important;
    max-width: 90% !important;
    margin: 0 0 0px 0 !important;
  }
`

const NFTPoolCardInnerContainer = styled(Flex)`
  flex-direction: row;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0px;
`
const NFTPoolCardOuterContainer = styled(Flex)`
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 16px;
`

const ExpandingWrapper = styled.div<ExpandingWrapperProps>`
${({ expanded }) =>
    expanded
      ? css`
      padding: 24px;
      border-top: 2px solid ${({ theme }) => theme.colors.cardBorder};
    `
      : css`
      padding: 0;
    `}
  overflow: hidden;
`

interface NFTPoolCardProps {
  farm: FarmWithStakedValue
  removed: boolean
  stakedOnly: boolean
}

const NFTPoolCardTable: React.FC<NFTPoolCardProps> = ({ farm, removed, stakedOnly }) => {
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

  const { lpAddresses, nftPoolAddress, sharePrice, lpTotalSupply, lpPrice, tokenAmountTotal, quoteTokenAmountTotal, token, quoteToken } = farm

  const { getInitialPoolPosition } = useNftPools()
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const stakedBalance = position?.stakedBalance || BIG_ZERO

  return (stakedOnly && parseInt(stakedBalance.toString()) > 0) || !stakedOnly ? (
    <StyledCard isActive={isPromotedFarm}>
      <NFTPoolCardOuterContainer>
      <NFTPoolCardInnerContainer>
        <CardHeadingTable
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
          earnLabel={earnLabel}
        // multiplier={farm.multiplier}
        />
         {!removed && (
          <Flex flexDirection="column" justifyContent="flex-start" alignItems="center" mr="60px">
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
        {new BigNumber(stakedBalance).gt(0) && new BigNumber(lpPrice).gt(0) && (
          <Flex flexDirection="column" justifyContent="flex-start" alignItems="center">
            <Text>{t('STAKED BALANCE')}:</Text>
            <Balance
              color="textSubtle"
              decimals={2}
              value={
                sharePrice
                  ? getBalanceNumber(new BigNumber(sharePrice).times(stakedBalance))
                  : getBalanceNumber(new BigNumber(lpPrice).times(stakedBalance))
              }
              unit=" USD"
              prefix="~"
            />
            <Flex style={{ gap: '4px' }}>
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={4}
                value={new BigNumber(stakedBalance).div(1e18).div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
                unit={` ${token.symbol}`}
              />
              <Balance
                fontSize="12px"
                color="textSubtle"
                decimals={4}
                value={new BigNumber(stakedBalance).div(1e18).div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
                unit={` ${quoteToken.symbol}`}
              />
            </Flex>
          </Flex>
        )}
      </NFTPoolCardInnerContainer>
      <ExpandableSectionButton onClick={toggleExpandableSection} expanded={showExpandableSection} />
      </NFTPoolCardOuterContainer>

      <ExpandingWrapper expanded={showExpandableSection}>
        {showExpandableSection && (
          <>
            <CardActionsContainer farm={farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} />
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
          </>
        )}
      </ExpandingWrapper>
    </StyledCard>
  ) : null
}

export default NFTPoolCardTable
