import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import {
  Currency,
  CurrencyAmount,
  NONFUNGIBLE_POSITION_MANAGER_ADDRESSES,
  Percent,
  FeeAmount,
  NonfungiblePositionManager,
} from '@baseswapfi/sdk-core'
import OwnershipWarning from 'components/AddLiquidity/OwnershipWarning'
// import UnsupportedCurrencyFooter from 'components/swap/UnsupportedCurrencyFooter'
import { isSupportedChain } from 'config/constants/chains'
import usePrevious from 'hooks/usePrevious'
// import { useSingleCallResult } from 'lib/hooks/multicall'
// import { PositionPageUnsupportedContent } from 'pages/Pool/PositionPage'
// TODO: Convert to current versions/ability as needed
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertTriangle } from 'react-feather'
import {
  // useRangeHopCallbacks,
  // useV3DerivedMintInfo,
  // useV3MintActionHandlers,
  useV3MintState,
} from 'state/mint/v3/hooks'
import styled, { useTheme } from 'styled-components'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'

// import { ButtonError, ButtonLight, ButtonPrimary, ButtonText } from '../../components/Button'
// import { BlueCard, OutlineCard, YellowCard } from '../../components/Card'
import { Button, Card, Text } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'

import Row, { RowBetween, RowFixed } from 'components/Row'

import { ZERO_PERCENT } from 'config/constants/exchange'

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

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

function AddLiquidity() {
  const router = useRouter()

  // TODO: Not sure this works like this
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

  return <div>Liq</div>
}

export default AddLiquidity
