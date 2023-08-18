import { Flex, Heading } from '@pancakeswap/uikit'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { useMemo } from 'react'
import { useLpTokenPrice } from 'state/farms/hooks'
import { formatLpBalance, getBalanceNumber } from 'utils/formatBalance'

interface StackedLPProps {
  stakedBalance: BigNumber
  lpSymbol: string
  tokenSymbol: string
  quoteTokenSymbol: string
  lpTotalSupply: BigNumber
  tokenAmountTotal: BigNumber
  quoteTokenAmountTotal: BigNumber
  sharePrice: number
  lpPrice: string
}

const StakedLP: React.FunctionComponent<StackedLPProps> = ({
  stakedBalance,
  lpSymbol,
  quoteTokenSymbol,
  tokenSymbol,
  lpTotalSupply,
  tokenAmountTotal,
  quoteTokenAmountTotal,
  sharePrice,
  lpPrice,
}) => {
  const displayBalance = useMemo(() => {
    return formatLpBalance(stakedBalance)
  }, [stakedBalance])

  return (
    <Flex flexDirection="column" alignItems="flex-start">
      <Heading color={stakedBalance.eq(0) ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
      {/* {stakedBalance.gt(0) && lpPrice.gt(0) && (quantumPrice && quantumPrice.gt(0)) && ( */}
      {stakedBalance.gt(0) && new BigNumber(lpPrice).gt(0) && (
        <>
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
              decimals={12}
              value={stakedBalance.div(1e18).div(lpTotalSupply).times(tokenAmountTotal).toNumber()}
              unit={` ${tokenSymbol}`}
            />
            <Balance
              fontSize="12px"
              color="textSubtle"
              decimals={12}
              value={stakedBalance.div(1e18).div(lpTotalSupply).times(quoteTokenAmountTotal).toNumber()}
              unit={` ${quoteTokenSymbol}`}
            />
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default StakedLP
