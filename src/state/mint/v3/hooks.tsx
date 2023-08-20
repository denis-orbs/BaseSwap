import {
  Currency,
  CurrencyAmount,
  Price,
  Rounding,
  Token,
  encodeSqrtRatioX96,
  FeeAmount,
  nearestUsableTick,
  Pool,
  Position,
  priceToClosestTick,
  TICK_SPACINGS,
  TickMath,
  tickToPrice,
} from '@baseswapfi/sdk-core'
import { useWeb3React } from '@web3-react/core'
import { PoolState, usePool } from 'hooks/v3/usePools'
import JSBI from 'jsbi'
import tryParseCurrencyAmount from 'lib/utils/tryParseCurrencyAmount'
import { ReactNode, useCallback, useMemo } from 'react'
// import { useSearchParams } from 'react-router-dom'
import { useAppDispatch, AppState } from 'state'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { getTickToPrice } from 'utils/v3/getTickToPrice'

import {
  Bound,
  Field,
  setFullRange,
  typeInput,
  typeLeftRangeInput,
  typeRightRangeInput,
  typeStartPriceInput,
} from './actions'
import { tryParseTick } from './utils'
import { useSelector } from 'react-redux'

export function useV3MintState(): AppState['mintV3'] {
  return useSelector<AppState, AppState['mintV3']>((state) => state.mintV3)
}
