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

function AddLiquidity() {
  return <div>Liq</div>
}

export default AddLiquidity
