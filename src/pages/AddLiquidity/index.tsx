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
import { Text } from '@pancakeswap/uikit'
import {
  // useRangeHopCallbacks,
  // useV3DerivedMintInfo,
  // useV3MintActionHandlers,
  useV3MintState,
} from 'state/mint/v3/hooks'
import styled, { useTheme } from 'styled-components'
import { addressesAreEquivalent } from 'utils/addressesAreEquivalent'

import { TransactionType } from 'state/transactions/types'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { ZERO_PERCENT } from 'config/constants/exchange'
import Row, { RowBetween, RowFixed } from 'components/Row'
import { Bound, Field } from 'state/mint/v3/actions'
import { maxAmountSpend } from 'utils/v3/maxAmountSpend'
import MediumOnly, {
  CurrencyDropdown,
  DynamicSection,
  ResponsiveTwoColumns,
  ScrollablePage,
  StyledInput,
  Wrapper,
} from './styled'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

function AddLiquidity() {
  return <div>Liq</div>
}

export default AddLiquidity
