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

// import { ButtonError, ButtonLight, ButtonPrimary, ButtonText } from '../../components/Button'
// import { BlueCard, OutlineCard, YellowCard } from '../../components/Card'
import { Button, Card, Flex, Text } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'

import Row, { RowBetween, RowFixed } from 'components/Row'
import TransactionConfirmationModal, { ConfirmationModalContent } from '../../components/TransactionConfirmationModal'
import { Bound, Field } from 'state/mint/v3/actions'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import { TransactionType } from 'state/transactions/types'
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
import { WRAPPED_NATIVE_CURRENCY } from 'config/constants/tokens-v3'
import { useIsSwapUnsupported } from 'hooks/v3/useIsSwapUnsupported'
import { ApprovalState } from 'lib/hooks/useApproval'
import { useSingleCallResult } from 'lib/hooks/multicall'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import { Dots } from 'pages/pool/styled'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { BodyWrapper } from 'components/App/AppBody'
import Review from './Review'
import { AddRemoveTabs } from 'components/NavigationTabs'
import FeeSelector from 'components/FeeSelector'

const DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE = new Percent(50, 10_000)

const StyledBodyWrapper = styled(BodyWrapper)<{ $hasExistingPosition: boolean }>`
  padding: ${({ $hasExistingPosition }) => ($hasExistingPosition ? '10px' : 0)};
  max-width: 640px;
`

function AddLiquidity() {
  const { t } = useTranslation()
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

  const currencyIdA = params?.currencyIdA
  const currencyIdB = params?.currencyIdB

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

  async function onAdd() {
    if (!chainId || !provider || !account) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? NonfungiblePositionManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: allowedSlippage,
              deadline: deadline.toString(),
              useNative,
            })
          : NonfungiblePositionManager.addCallParameters(position, {
              slippageTolerance: allowedSlippage,
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      let txn: { to: string; data: string; value: string } = {
        to: NONFUNGIBLE_POSITION_MANAGER_ADDRESSES[chainId],
        data: calldata,
        value,
      }

      setAttemptingTxn(true)

      provider
        .getSigner()
        .estimateGas(txn)
        .then((estimate) => {
          const newTxn = {
            ...txn,
            gasLimit: calculateGasMargin(estimate),
          }

          return provider
            .getSigner()
            .sendTransaction(newTxn)
            .then((response: TransactionResponse) => {
              setAttemptingTxn(false)
              addTransaction(response, {
                type: TransactionType.ADD_LIQUIDITY_V3_POOL,
                baseCurrencyId: currencyId(baseCurrency),
                quoteCurrencyId: currencyId(quoteCurrency),
                createPool: Boolean(noLiquidity),
                expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
                expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
                feeAmount: position.pool.fee,
              })
              setTxHash(response.hash)
            })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    } else {
      return
    }
  }

  const handleCurrencySelect = useCallback(
    (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
      const currencyIdNew = currencyId(currencyNew)

      if (currencyIdNew === currencyIdOther) {
        // not ideal, but for now clobber the other if the currency ids are equal
        return [currencyIdNew, undefined]
      }
      // prevent weth + eth
      const isETHOrWETHNew =
        currencyIdNew === 'ETH' ||
        (chainId !== undefined && currencyIdNew === WRAPPED_NATIVE_CURRENCY[chainId]?.address)
      const isETHOrWETHOther =
        currencyIdOther !== undefined &&
        (currencyIdOther === 'ETH' ||
          (chainId !== undefined && currencyIdOther === WRAPPED_NATIVE_CURRENCY[chainId]?.address))

      if (isETHOrWETHNew && isETHOrWETHOther) {
        return [currencyIdNew, undefined]
      }

      return [currencyIdNew, currencyIdOther]
    },
    [chainId],
  )

  // router segment names
  const handleCurrencyASelect = useCallback(
    (currencyANew: Currency) => {
      const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB)
      if (idB === undefined) {
        // navigate(`/add/${idA}`)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [idA]: [idA],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      } else {
        // navigate(`/add/${idA}/${idB}`)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [idA]: [idA],
              [idB]: [idB],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [handleCurrencySelect, currencyIdB, router],
  )

  const handleCurrencyBSelect = useCallback(
    (currencyBNew: Currency) => {
      const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA)
      if (idA === undefined) {
        // navigate(`/add/${idB}`)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [idB]: [idB],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      } else {
        // navigate(`/add/${idA}/${idB}`)
        router.replace(
          {
            pathname: router.pathname,
            query: {
              ...router.query,
              [idA]: [idA],
              [idB]: [idB],
            },
          },
          undefined,
          {
            shallow: true,
          },
        )
      }
    },
    [handleCurrencySelect, currencyIdA, router],
  )

  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')
      //  navigate(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`)
      router.replace(
        {
          pathname: `/addV3/${currencyIdA}/${currencyIdB}/${newFeeAmount}`,
        },
        undefined,
        {
          shallow: true,
        },
      )
    },
    [currencyIdA, currencyIdB, router, onLeftRangeInput, onRightRangeInput],
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      // dont jump to pool page if creating
      // navigate('/pools')
      // TODO: Need to line this up with our navigation/routing scheme
      router.push('/pools')
    }
    setTxHash('')
  }, [router, onFieldAInput, txHash])

  const addIsUnsupported = useIsSwapUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const clearAll = useCallback(() => {
    onFieldAInput('')
    onFieldBInput('')
    onLeftRangeInput('')
    onRightRangeInput('')
    // navigate(`/add`)
    router.push('/addV3')
  }, [router, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])

  // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks

  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  }`

  const [searchParams, setSearchParams] = useState<{ param: string; value: string }>()

  const handleSetFullRange = useCallback(() => {
    getSetFullRange()

    const minPrice = pricesAtLimit[Bound.LOWER]
    if (minPrice) {
      // searchParams.set('minPrice', minPrice.toSignificant(5))
      setSearchParams({ param: 'minPrice', value: minPrice.toSignificant(5) })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            minPrice: [minPrice.toSignificant(5)],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }

    const maxPrice = pricesAtLimit[Bound.UPPER]
    if (maxPrice) {
      // searchParams.set('maxPrice', maxPrice.toSignificant(5))
      setSearchParams({ param: 'maxPrice', value: maxPrice.toSignificant(5) })
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            maxPrice: [maxPrice.toSignificant(5)],
          },
        },
        undefined,
        {
          shallow: true,
        },
      )
    }
  }, [getSetFullRange, pricesAtLimit, searchParams])

  // START: sync values with query string
  const oldSearchParams = usePrevious(searchParams)
  // use query string as an input to onInput handlers
  useEffect(() => {
    const minPrice = searchParams?.value
    const oldMinPrice = oldSearchParams?.value
    if (
      minPrice &&
      typeof minPrice === 'string' &&
      !Number.isNaN(minPrice as any) &&
      (!oldMinPrice || oldMinPrice !== minPrice)
    ) {
      onLeftRangeInput(minPrice)
    }
    // disable eslint rule because this hook only cares about the url->input state data flow
    // input state -> url updates are handled in the input handlers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const Buttons = () =>
    addIsUnsupported ? (
      <Button disabled padding="12px">
        <Text mb="4px">
          <Trans>Unsupported Asset</Trans>
        </Text>
      </Button>
    ) : !account ? (
      <ConnectWalletButton />
    ) : (
      <AutoColumn gap="md">
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween>
              {showApprovalA && (
                <Button
                  onClick={approveACallback}
                  disabled={approvalA === ApprovalState.PENDING}
                  width={showApprovalB ? '48%' : '100%'}
                >
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>
                      <Text>{t(`Approving ${currencies[Field.CURRENCY_A]?.symbol}`)}</Text>
                    </Dots>
                  ) : (
                    <Text>{t(`Approve ${currencies[Field.CURRENCY_A]?.symbol}`)}</Text>
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button
                  onClick={approveBCallback}
                  disabled={approvalB === ApprovalState.PENDING}
                  width={showApprovalA ? '48%' : '100%'}
                >
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>
                      <Text>{t(`Approving ${currencies[Field.CURRENCY_B]?.symbol}`)}</Text>
                    </Dots>
                  ) : (
                    <Text>{t(`Approve ${currencies[Field.CURRENCY_B]?.symbol}`)}</Text>
                  )}
                </Button>
              )}
            </RowBetween>
          )}
        <Button
          onClick={() => {
            setShowConfirm(true)
          }}
          disabled={
            !isValid ||
            (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
          //error={!isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]}
        >
          <Text fontWeight={500}>{errorMessage ? errorMessage : <Trans>Preview</Trans>}</Text>
        </Button>
      </AutoColumn>
    )

  const usdcValueCurrencyA = usdcValues[Field.CURRENCY_A]
  const usdcValueCurrencyB = usdcValues[Field.CURRENCY_B]
  const currencyAFiat = useMemo(
    () => ({
      data: usdcValueCurrencyA ? parseFloat(usdcValueCurrencyA.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyA],
  )
  const currencyBFiat = useMemo(
    () => ({
      data: usdcValueCurrencyB ? parseFloat(usdcValueCurrencyB.toSignificant()) : undefined,
      isLoading: false,
    }),
    [usdcValueCurrencyB],
  )

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const showOwnershipWarning = Boolean(hasExistingPosition && account)

  return (
    <>
      <ScrollablePage>
        {showConfirm && (
          <TransactionConfirmationModal
            title={t('Add Liquidity')}
            onDismiss={handleDismissConfirmation}
            attemptingTxn={attemptingTxn}
            hash={txHash}
            pendingText={pendingText}
            content={() => {
              return (
                <ConfirmationModalContent
                  topContent={() => (
                    <Review
                      parsedAmounts={parsedAmounts}
                      position={position}
                      existingPosition={existingPosition}
                      priceLower={priceLower}
                      priceUpper={priceUpper}
                      outOfRange={outOfRange}
                      ticksAtLimit={ticksAtLimit}
                    />
                  )}
                  bottomContent={() => (
                    <Button style={{ marginTop: '1rem' }} onClick={onAdd}>
                      <Text fontWeight={500} fontSize={20}>
                        <Trans>Add</Trans>
                      </Text>
                    </Button>
                  )}
                />
              )
            }}
          />
        )}

        <StyledBodyWrapper $hasExistingPosition={hasExistingPosition}>
          <AddRemoveTabs
            creating={false}
            adding={true}
            positionID={tokenId}
            autoSlippage={DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE}
            showBackLink={!hasExistingPosition}
          >
            {!hasExistingPosition && (
              <Flex justifyContent="flex-end" style={{ width: 'fit-content', minWidth: 'fit-content' }}>
                <MediumOnly>
                  <Button onClick={clearAll}>
                    <Text fontSize="12px">
                      <Trans>Clear All</Trans>
                    </Text>
                  </Button>
                </MediumOnly>
              </Flex>
            )}
          </AddRemoveTabs>
          <Wrapper>
            <ResponsiveTwoColumns wide={!hasExistingPosition}>
              <AutoColumn gap="lg">
                {!hasExistingPosition && (
                  <>
                    <AutoColumn gap="md">
                      <RowBetween paddingBottom="20px">
                        <Text>
                          <Trans>Select Pair</Trans>
                        </Text>
                      </RowBetween>
                      <RowBetween>
                        <CurrencyDropdown
                          value={formattedAmounts[Field.CURRENCY_A]}
                          onUserInput={onFieldAInput}
                          hideInput={true}
                          onMax={() => {
                            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                          }}
                          onCurrencySelect={handleCurrencyASelect}
                          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                          currency={currencies[Field.CURRENCY_A] ?? null}
                          id="add-liquidity-input-tokena"
                          showCommonBases
                        />

                        <div style={{ width: '12px' }} />

                        <CurrencyDropdown
                          value={formattedAmounts[Field.CURRENCY_B]}
                          hideInput={true}
                          onUserInput={onFieldBInput}
                          onCurrencySelect={handleCurrencyBSelect}
                          onMax={() => {
                            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                          }}
                          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                          currency={currencies[Field.CURRENCY_B] ?? null}
                          id="add-liquidity-input-tokenb"
                          showCommonBases
                        />
                      </RowBetween>

                      <FeeSelector
                        disabled={!quoteCurrency || !baseCurrency}
                        feeAmount={feeAmount}
                        handleFeePoolSelect={handleFeePoolSelect}
                        currencyA={baseCurrency ?? undefined}
                        currencyB={quoteCurrency ?? undefined}
                      />
                    </AutoColumn>{' '}
                  </>
                )}
                {/* {hasExistingPosition && existingPosition && (
                  <PositionPreview
                    position={existingPosition}
                    title={<Trans>Selected Range</Trans>}
                    inRange={!outOfRange}
                    ticksAtLimit={ticksAtLimit}
                  />
                )} */}
              </AutoColumn>
            </ResponsiveTwoColumns>
          </Wrapper>
        </StyledBodyWrapper>
      </ScrollablePage>
    </>
  )
}

export default AddLiquidity
