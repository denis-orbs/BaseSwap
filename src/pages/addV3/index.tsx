import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { Currency, CurrencyAmount, NONFUNGIBLE_POSITION_MANAGER_ADDRESSES, Percent } from '@baseswapfi/sdk-core'
import { FeeAmount, NonfungiblePositionManager } from '@baseswapfi/v3-sdk2'
import OwnershipWarning from 'components/AddLiquidity/OwnershipWarning'
// import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { isSupportedChain } from 'config/constants/chains'
import usePrevious from 'hooks/usePrevious'
// import { useSingleCallResult } from 'lib/hooks/multicall'
// import { PositionPageUnsupportedContent } from 'pages/Pool/PositionPage'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import {
  useV3MintActionHandlers,
  useRangeHopCallbacks,
  useV3DerivedMintInfo,
  useV3MintState,
} from 'state/mint/v3/hooks'
import styled, { useTheme } from 'styled-components'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'

// import { ButtonError, ButtonLight, ButtonPrimary, ButtonText } from '../../components/Button'
// import { BlueCard, OutlineCard, YellowCard } from '../../components/Card'
import { Button, Card, Text } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'

import Row, { RowBetween, RowFixed } from 'components/Row'

import { Bound, Field } from 'state/mint/v3/actions'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import { TransactionType } from 'state/transactions/types'
// import { useUserSlippageToleranceWithDefault } from 'state/user/hooks'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { currencyId } from 'utils/v3/currencyId'
import { maxAmountSpend } from 'utils/v3/maxAmountSpend'
import MediumOnly, {
  CurrencyDropdown,
  DynamicSection,
  ResponsiveTwoColumns,
  ScrollablePage,
  StyledInput,
  Wrapper,
} from './styled'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useCurrency } from 'hooks/v3/Tokens'
import { useRouter } from 'next/router'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useStablecoinValue } from 'hooks/useStablecoinPrice'
import { useApproveCallback } from 'hooks/v3/useApproveCallback'
import { useUserSlippageToleranceWithDefault } from 'state/user/v3/hooks'
import { ZERO_PERCENT_V3 } from 'config/constants/v3'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

function AddLiquidity() {
  const router = useRouter()

  // TODO: Make sure this works like this
  const params: {
    currencyIdA?: string
    currencyIdB?: string
    feeAmount?: string
    tokenId?: string
  } = router.query

  const { account, chainId, library: provider } = useActiveWeb3React()
  const theme = useTheme()

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract(chainId)

  const baseCurrency = useCurrency(params?.currencyIdA)
  const currencyB = useCurrency(params?.currencyIdB)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB

  // fee selection from url
  const feeAmountFromUrl = params?.feeAmount
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined

  // check for existing position if tokenId in url
  const tokenId = params?.tokenId
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined,
  )

  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

  // mint state
  const { independentField, typedValue, startPriceTypedValue } = useV3MintState()

  const {
    pool,
    ticks,
    dependentField,
    price,
    pricesAtTicks,
    pricesAtLimit,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidPool,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    invertPrice,
    ticksAtLimit,
  } = useV3DerivedMintInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
  )

  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)

  const isValid = !errorMessage && !invalidRange

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings

  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const usdcValues = {
    [Field.CURRENCY_A]: useStablecoinValue(parsedAmounts[Field.CURRENCY_A]),
    [Field.CURRENCY_B]: useStablecoinValue(parsedAmounts[Field.CURRENCY_B]),
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    chainId ? NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId] : undefined,
  )

  const allowedSlippage = useUserSlippageToleranceWithDefault(
    outOfRange ? ZERO_PERCENT_V3 : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  )

  return <div>Liq</div>
}

export default AddLiquidity
