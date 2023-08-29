import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { ChainId, Currency, CurrencyAmount, Fraction, Percent, Price, Token } from '@baseswapfi/sdk-core'
import { NonfungiblePositionManager, Pool, Position } from '@baseswapfi/v3-sdk2'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import Badge from 'components/Badge'
import { Button, Text, Card, Box, Flex } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Column'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { LoadingFullscreen } from 'components/Loader/styled'
import CurrencyLogo from 'components/Logo/CurrencyLogo'
import { RowBetween, RowFixed } from 'components/Row'
import { Dots } from 'components/swap/styled'
import Toggle from 'components/Toggle'
import TransactionConfirmationModal, { ConfirmationModalContent } from 'components/TransactionConfirmationModal'
import { CHAIN_IDS_TO_NAMES, isSupportedChain } from 'config/constants/chains'
import { isGqlSupportedChain } from 'graphql/data/util'
import { useToken } from 'hooks/Tokens'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
import useIsTickAtLimit from 'hooks/v3/useIsTickAtLimit'
import { PoolState, usePool } from 'hooks/v3/usePools'
import useStablecoinPrice from 'hooks/useStablecoinPrice'
import { useV3PositionFees } from 'hooks/v3/useV3PositionFees'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import { useSingleCallResult } from 'lib/hooks/multicall'
import useNativeCurrency from 'lib/hooks/useNativeCurrency'
import { useCallback, useMemo, useRef, useState } from 'react'
import { Bound } from 'state/mint/v3/actions'
import { useIsTransactionPending } from 'state/transactions/hooks'
import { useTransactionAdder } from 'state/transactions/v3/hooks'
import styled, { useTheme } from 'styled-components'
import { currencyId } from 'utils/currencyId'
import { formatCurrencyAmount } from 'utils/v3/formatCurrencyAmount'
import { formatNumber, formatPrice, NumberType } from 'utils/v3/formatNumbers'
import { formatTickPrice } from 'utils/v3/formatTickPrice'
import { unwrappedToken } from 'utils/v3/unwrappedToken'

import RangeBadge from 'components/Badge/RangeBadge'
import { getPriceOrderingFromPositionForUI } from 'components/PositionListItem'
import RateToggle from 'components/RateToggle'
import { usePositionTokenURI } from 'hooks/v3/usePositionTokenURI'
import { TransactionType } from 'state/transactions/types'
import { calculateGasMargin } from 'utils/calculateGasMargin'
import { ExplorerDataType, getExplorerLink } from 'utils/getExplorerLink'
import { LoadingRows } from './styled'
import Trans from 'components/Trans'
import { useTranslation } from '@pancakeswap/localization'
import { ExternalLink } from 'react-feather'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Page from 'views/Page'
import useTokenPrices from 'hooks/useTokenPrices'

const getTokenLink = (chainId: ChainId, address: string) => {
  if (isGqlSupportedChain(chainId)) {
    const chainName = CHAIN_IDS_TO_NAMES[chainId]
    return `${window.location.origin}/#/tokens/${chainName}/${address}`
  } else {
    return getExplorerLink(chainId, address, ExplorerDataType.TOKEN)
  }
}

export const DarkCard = styled(Card)`
  background: ${({ theme }) => theme.colors.gradients.basedsexdark};
`

const PositionPageButtonPrimary = styled(Button)`
  width: 228px;
  height: 40px;
  font-size: 16px;
  line-height: 20px;
  border-radius: 12px;
`

// const PageWrapper = styled.div`
//   padding: 68px 16px 16px 16px;

//   min-width: 800px;
//   max-width: 960px;

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
//     min-width: 100%;
//     padding: 16px;
//   }

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     min-width: 100%;
//     padding: 16px;
//   }
// `

const PageWrapper = styled.div`
  padding: 68px 16px 16px 16px;

  min-width: 800px;
  max-width: 960px;
`

const BadgeText = styled.div`
  font-weight: 500;
  font-size: 14px;
`

// responsive text
// disable the warning because we don't use the end prop, we just want to filter it out
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Label = styled(({ end, ...props }) => <Text {...props} />)<{ end?: boolean }>`
  display: flex;
  font-size: 16px;
  justify-content: ${({ end }) => (end ? 'flex-end' : 'flex-start')};
  align-items: center;
`

const ExtentsText = styled.span`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  font-weight: 500;
`

const HoverText = styled(Text)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.tertiary};
  :hover {
    color: ${({ theme }) => theme.colors.tertiary};
    text-decoration: none;
  }
`

const DoubleArrow = styled.span`
  color: ${({ theme }) => theme.colors.tertiary};
  margin: 0 1rem;
`
// const ResponsiveRow = styled(RowBetween)`
//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     flex-direction: column;
//     align-items: flex-start;
//     row-gap: 16px;
//     width: 100%;
//   }
// `

const ResponsiveRow = styled(RowBetween)``

// const ActionButtonResponsiveRow = styled(ResponsiveRow)`
//   width: 50%;
//   justify-content: flex-end;

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     width: 100%;
//     flex-direction: row;
//     * {
//       width: 100%;
//     }
//   }
// `

const ActionButtonResponsiveRow = styled(ResponsiveRow)`
  width: 50%;
  justify-content: flex-end;
`

// const ResponsiveButtonConfirmed = styled(Button)`
//   border-radius: 12px;
//   padding: 6px 8px;
//   width: fit-content;
//   font-size: 16px;

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
//     width: fit-content;
//   }

//   @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
//     width: fit-content;
//   }
// `

const ResponsiveButtonConfirmed = styled(Button)`
  border-radius: 12px;
  padding: 6px 8px;
  width: fit-content;
  font-size: 16px;
`

const NFTGrid = styled.div`
  display: grid;
  grid-template: 'overlap';
  min-height: 400px;
  padding: 12px;
`

const NFTCanvas = styled.canvas`
  grid-area: overlap;
`

const NFTImage = styled.img`
  grid-area: overlap;
  height: 400px;
  /* Ensures SVG appears on top of canvas. */
  z-index: 1;
`

function CurrentPriceCard({
  inverted,
  pool,
  currencyQuote,
  currencyBase,
}: {
  inverted?: boolean
  pool?: Pool | null
  currencyQuote?: Currency
  currencyBase?: Currency
}) {
  if (!pool || !currencyQuote || !currencyBase) {
    return null
  }

  const { t } = useTranslation()

  return (
    <DarkCard padding="12px" marginLeft="12px" marginRight="12px" marginBottom="4px">
      <AutoColumn gap="sm" justify="center">
        <ExtentsText>
          <Trans>Current price</Trans>
        </ExtentsText>
        <Text textAlign="center">
          {formatPrice(inverted ? pool.token1Price : pool.token0Price, NumberType.TokenTx)}
        </Text>
        <ExtentsText>{t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}</ExtentsText>
      </AutoColumn>
    </DarkCard>
  )
}

function LinkedCurrency({ chainId, currency }: { chainId?: number; currency?: Currency }) {
  const address = (currency as Token)?.address

  if (typeof chainId === 'number' && address) {
    return (
      <a href={getTokenLink(chainId, address)} target="_blank">
        <RowFixed>
          <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '0.5rem' }} />
          <Text>
            {currency?.symbol}
            {/* ↗ */}
          </Text>
          <ExternalLink size={16} style={{ marginLeft: 4 }} />
        </RowFixed>
      </a>
    )
  }

  return (
    <RowFixed>
      <CurrencyLogo currency={currency} size="20px" style={{ marginRight: '0.5rem' }} />
      <Text>{currency?.symbol}</Text>
    </RowFixed>
  )
}

function getRatio(
  lower: Price<Currency, Currency>,
  current: Price<Currency, Currency>,
  upper: Price<Currency, Currency>,
) {
  try {
    if (!current.greaterThan(lower)) {
      return 100
    } else if (!current.lessThan(upper)) {
      return 0
    }

    const a = Number.parseFloat(lower.toSignificant(15))
    const b = Number.parseFloat(upper.toSignificant(15))
    const c = Number.parseFloat(current.toSignificant(15))

    const ratio = Math.floor((1 / ((Math.sqrt(a * b) - Math.sqrt(b * c)) / (c - Math.sqrt(b * c)) + 1)) * 100)

    if (ratio < 0 || ratio > 100) {
      throw Error('Out of range')
    }

    return ratio
  } catch {
    return undefined
  }
}

// snapshots a src img into a canvas
function getSnapshot(src: HTMLImageElement, canvas: HTMLCanvasElement, targetHeight: number) {
  const context = canvas.getContext('2d')

  if (context) {
    let { width, height } = src

    // src may be hidden and not have the target dimensions
    const ratio = width / height
    height = targetHeight
    width = Math.round(ratio * targetHeight)

    // Ensure crispness at high DPIs
    canvas.width = width * devicePixelRatio
    canvas.height = height * devicePixelRatio
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    context.scale(devicePixelRatio, devicePixelRatio)

    context.clearRect(0, 0, width, height)
    context.drawImage(src, 0, 0, width, height)
  }
}

function NFT({ image, height: targetHeight }: { image: string; height: number }) {
  const [animate, setAnimate] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  return (
    <NFTGrid
      onMouseEnter={() => {
        setAnimate(true)
      }}
      onMouseLeave={() => {
        // snapshot the current frame so the transition to the canvas is smooth
        if (imageRef.current && canvasRef.current) {
          getSnapshot(imageRef.current, canvasRef.current, targetHeight)
        }
        setAnimate(false)
      }}
    >
      <NFTCanvas ref={canvasRef} />
      <NFTImage
        ref={imageRef}
        src={image}
        hidden={!animate}
        onLoad={() => {
          // snapshot for the canvas
          if (imageRef.current && canvasRef.current) {
            getSnapshot(imageRef.current, canvasRef.current, targetHeight)
          }
        }}
      />
    </NFTGrid>
  )
}

const useInverter = ({
  priceLower,
  priceUpper,
  quote,
  base,
  invert,
}: {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
  invert?: boolean
}): {
  priceLower?: Price<Token, Token>
  priceUpper?: Price<Token, Token>
  quote?: Token
  base?: Token
} => {
  return {
    priceUpper: invert ? priceLower?.invert() : priceUpper,
    priceLower: invert ? priceUpper?.invert() : priceLower,
    quote: invert ? base : quote,
    base: invert ? quote : base,
  }
}

export function PositionPageUnsupportedContent() {
  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
        <Text style={{ marginBottom: '8px' }}>
          <Trans>Position unavailable</Trans>
        </Text>
        <Text style={{ marginBottom: '32px' }}>
          <Trans>To view a position, you must be connected to the network it belongs to.</Trans>
        </Text>
        <Link
          href="/positions"
          style={{
            width: 'fit-content',
          }}
        >
          <Trans>Back to Pools</Trans>
        </Link>
      </div>
    </PageWrapper>
  )
}

export default function PositionPage() {
  const { chainId } = useActiveWeb3React()
  const router = useRouter()
  if (router.isReady && router.query.tokenId && isSupportedChain(chainId)) {
    return <PositionPageContent />
  }

  return <PositionPageUnsupportedContent />
}

function PositionPageContent() {
  const router = useRouter()
  const tokenIdFromUrl = router.query.tokenId
  const { chainId, account, library: provider } = useActiveWeb3React()
  const theme = useTheme()
  const { t } = useTranslation()

  const parsedTokenId = tokenIdFromUrl ? BigNumber.from(tokenIdFromUrl) : undefined
  const { loading, position: positionDetails } = useV3PositionFromTokenId(parsedTokenId)

  const {
    token0: token0Address,
    token1: token1Address,
    fee: feeAmount,
    liquidity,
    tickLower,
    tickUpper,
    tokenId,
  } = positionDetails || {}

  const removed = liquidity?.eq(0)

  const metadata = usePositionTokenURI(parsedTokenId)

  const token0 = useToken(token0Address)
  const token1 = useToken(token1Address)

  const currency0 = token0 ? unwrappedToken(token0) : undefined
  const currency1 = token1 ? unwrappedToken(token1) : undefined

  // flag for receiving WETH
  const [receiveWETH, setReceiveWETH] = useState(false)
  const nativeCurrency = useNativeCurrency(chainId)
  const nativeWrappedSymbol = nativeCurrency.wrapped.symbol

  // construct Position from details returned
  const [poolState, pool] = usePool(token0 ?? undefined, token1 ?? undefined, feeAmount)
  const position = useMemo(() => {
    if (pool && liquidity && typeof tickLower === 'number' && typeof tickUpper === 'number') {
      return new Position({ pool, liquidity: liquidity.toString(), tickLower, tickUpper })
    }
    return undefined
  }, [liquidity, pool, tickLower, tickUpper])

  const tickAtLimit = useIsTickAtLimit(feeAmount, tickLower, tickUpper)

  const pricesFromPosition = getPriceOrderingFromPositionForUI(position)
  const [manuallyInverted, setManuallyInverted] = useState(false)

  // handle manual inversion
  const { priceLower, priceUpper, base } = useInverter({
    priceLower: pricesFromPosition.priceLower,
    priceUpper: pricesFromPosition.priceUpper,
    quote: pricesFromPosition.quote,
    base: pricesFromPosition.base,
    invert: manuallyInverted,
  })

  const inverted = token1 ? base?.equals(token1) : undefined
  const currencyQuote = inverted ? currency0 : currency1
  const currencyBase = inverted ? currency1 : currency0

  const ratio = useMemo(() => {
    return priceLower && pool && priceUpper
      ? getRatio(
          inverted ? priceUpper.invert() : priceLower,
          pool.token0Price,
          inverted ? priceLower.invert() : priceUpper,
        )
      : undefined
  }, [inverted, pool, priceLower, priceUpper])

  // fees
  const [feeValue0, feeValue1] = useV3PositionFees(pool ?? undefined, positionDetails?.tokenId, receiveWETH)

  // these currencies will match the feeValue{0,1} currencies for the purposes of fee collection
  const currency0ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token0 : unwrappedToken(pool.token0)) : undefined
  const currency1ForFeeCollectionPurposes = pool ? (receiveWETH ? pool.token1 : unwrappedToken(pool.token1)) : undefined

  const [collecting, setCollecting] = useState<boolean>(false)
  const [collectMigrationHash, setCollectMigrationHash] = useState<string | null>(null)
  const isCollectPending = useIsTransactionPending(collectMigrationHash ?? undefined)
  const [showConfirm, setShowConfirm] = useState(false)

  const { getTokenPrice } = useTokenPrices()

  // usdc prices always in terms of tokens
  // const price0 = useStablecoinPrice(token0 ?? undefined)
  // const price1 = useStablecoinPrice(token1 ?? undefined)

  const price0 = useMemo(() => getTokenPrice(token0?.address), [getTokenPrice, token0])
  const price1 = useMemo(() => getTokenPrice(token0?.address), [getTokenPrice, token1])

  const fiatValueOfFees: string = useMemo(() => {
    if (!feeValue0 || !feeValue1) return '0'

    // we wrap because it doesn't matter, the quote returns a USDC amount
    const feeValue0Wrapped = feeValue0?.wrapped
    const feeValue1Wrapped = feeValue1?.wrapped

    if (!feeValue0Wrapped || !feeValue1Wrapped) return null

    const amount0 = price0 * parseFloat(feeValue0Wrapped.toFixed() || '0')
    const amount1 = price1 * parseFloat(feeValue1Wrapped.toFixed() || '0')

    return formatNumber(amount0 + amount1)
  }, [price0, price1, feeValue0, feeValue1])

  const fiatValueOfLiquidity: string = useMemo(() => {
    if (!position) return '0'

    const amount0 = price0 * parseFloat(position?.amount0.toFixed() || '0')
    const amount1 = price1 * parseFloat(position?.amount1.toFixed() || '0')

    return formatNumber(amount0 + amount1)
  }, [price0, price1, position])

  const addTransaction = useTransactionAdder()
  const positionManager = useV3NFTPositionManagerContract(chainId)
  const collect = useCallback(() => {
    if (
      !currency0ForFeeCollectionPurposes ||
      !currency1ForFeeCollectionPurposes ||
      !chainId ||
      !positionManager ||
      !account ||
      !tokenId ||
      !provider
    )
      return

    setCollecting(true)

    // we fall back to expecting 0 fees in case the fetch fails, which is safe in the
    // vast majority of cases
    const { calldata, value } = NonfungiblePositionManager.collectCallParameters({
      tokenId: tokenId.toString(),
      expectedCurrencyOwed0: feeValue0 ?? CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0),
      expectedCurrencyOwed1: feeValue1 ?? CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0),
      recipient: account,
    })

    const txn = {
      to: positionManager.address,
      data: calldata,
      value,
    }

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
            setCollectMigrationHash(response.hash)
            setCollecting(false)

            addTransaction(response, {
              type: TransactionType.COLLECT_FEES,
              currencyId0: currencyId(currency0ForFeeCollectionPurposes),
              currencyId1: currencyId(currency1ForFeeCollectionPurposes),
              expectedCurrencyOwed0:
                feeValue0?.quotient.toString() ??
                CurrencyAmount.fromRawAmount(currency0ForFeeCollectionPurposes, 0).toExact(),
              expectedCurrencyOwed1:
                feeValue1?.quotient.toString() ??
                CurrencyAmount.fromRawAmount(currency1ForFeeCollectionPurposes, 0).toExact(),
            })
          })
      })
      .catch((error) => {
        setCollecting(false)
        console.error(error)
      })
  }, [
    chainId,
    feeValue0,
    feeValue1,
    currency0ForFeeCollectionPurposes,
    currency1ForFeeCollectionPurposes,
    positionManager,
    account,
    tokenId,
    addTransaction,
    provider,
  ])

  const owner = useSingleCallResult(tokenId ? positionManager : null, 'ownerOf', [tokenId]).result?.[0]
  const ownsNFT = owner === account || positionDetails?.operator === account

  const feeValueUpper = inverted ? feeValue0 : feeValue1
  const feeValueLower = inverted ? feeValue1 : feeValue0

  // check if price is within range
  const below = pool && typeof tickLower === 'number' ? pool.tickCurrent < tickLower : undefined
  const above = pool && typeof tickUpper === 'number' ? pool.tickCurrent >= tickUpper : undefined
  const inRange: boolean = typeof below === 'boolean' && typeof above === 'boolean' ? !below && !above : false

  function modalHeader() {
    return (
      <AutoColumn gap="md" style={{ marginTop: '20px' }}>
        <Card padding="12px 16px">
          <AutoColumn gap="md">
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueUpper?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</Text>
              </RowFixed>
              <Text>{feeValueUpper?.currency?.symbol}</Text>
            </RowBetween>
            <RowBetween>
              <RowFixed>
                <CurrencyLogo currency={feeValueLower?.currency} size="20px" style={{ marginRight: '0.5rem' }} />
                <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</Text>
              </RowFixed>
              <Text>{feeValueLower?.currency?.symbol}</Text>
            </RowBetween>
          </AutoColumn>
        </Card>
        <Text>
          <Trans>Collecting fees will withdraw currently available fees for you.</Trans>
        </Text>
        <Button data-testid="modal-collect-fees-button" onClick={collect}>
          <Trans>Collect</Trans>
        </Button>
      </AutoColumn>
    )
  }

  const showCollectAsWeth = Boolean(
    ownsNFT &&
      (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0)) &&
      currency0 &&
      currency1 &&
      (currency0.isNative || currency1.isNative) &&
      !collectMigrationHash,
  )

  if (!positionDetails && !loading) {
    return <PositionPageUnsupportedContent />
  }

  return loading || poolState === PoolState.LOADING || !feeAmount ? (
    <LoadingRows>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </LoadingRows>
  ) : (
    <>
      <Page>
        {showConfirm && (
          <TransactionConfirmationModal
            title={t('Claim fees')}
            onDismiss={() => setShowConfirm(false)}
            attemptingTxn={collecting}
            hash={collectMigrationHash ?? ''}
            content={() => {
              return <ConfirmationModalContent topContent={modalHeader} bottomContent={null} />
            }}
            // reviewContent={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={null} />}
            pendingText={t(`Collecting fees`)}
          />
        )}
        <AutoColumn gap="md" style={{ width: '100%', maxWidth: '1000px', marginBottom: '100px' }}>
          <AutoColumn gap="sm">
            <Link
              data-cy="visit-pool"
              style={{ textDecoration: 'none', width: 'fit-content', marginBottom: '1rem' }}
              href="/positions"
            >
              <HoverText>
                <Trans>← Back to Positions</Trans>
              </HoverText>
            </Link>
            <ResponsiveRow mb="24px" mt="12px">
              <RowFixed>
                <DoubleCurrencyLogo currency0={currencyBase} currency1={currencyQuote} size={24} margin />
                <Text fontSize="24px" mr="10px">
                  &nbsp;{currencyQuote?.symbol}&nbsp;/&nbsp;{currencyBase?.symbol}
                </Text>
                <Badge style={{ marginRight: '8px' }}>
                  <BadgeText>{t(`${new Percent(feeAmount, 1_000_000).toSignificant()}%`)}</BadgeText>
                </Badge>
                <RangeBadge removed={removed} inRange={inRange} />
              </RowFixed>
              {ownsNFT && (
                <ActionButtonResponsiveRow>
                  {currency0 && currency1 && feeAmount && tokenId ? (
                    <Button
                      // href={`/increaseV3/${currencyId(currency0)}/${currencyId(currency1)}/${feeAmount}/${tokenId}`}
                      onClick={() => {
                        router.replace({
                          pathname: '/addV3',
                          query: {
                            currencyIdA: currencyId(currency0),
                            currencyIdB: currencyId(currency1),
                            feeAmount,
                            tokenId: tokenId.toNumber(),
                          },
                        })
                      }}
                      style={{ marginRight: '8px', padding: '3px 8px', width: 'fit-content', borderRadius: '12px' }}
                    >
                      <Trans>Increase Liquidity</Trans>
                    </Button>
                  ) : null}
                  {tokenId && !removed ? (
                    <Button
                      // href={`/removeV3/${tokenId}`}
                      onClick={() => {
                        router.replace({
                          pathname: '/removeV3',
                          query: {
                            tokenId: tokenId.toNumber(),
                          },
                        })
                      }}
                      style={{ marginRight: '8px', padding: '3px 8px', width: 'fit-content', borderRadius: '12px' }}
                    >
                      <Trans>Remove Liquidity</Trans>
                    </Button>
                  ) : null}
                </ActionButtonResponsiveRow>
              )}
            </ResponsiveRow>
            <RowBetween></RowBetween>
          </AutoColumn>
          <ResponsiveRow align="flex-start">
            <Box
              style={{
                height: '100%',
                marginRight: 12,
              }}
            >
              {'result' in metadata ? (
                <Flex
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'space-around',
                    minWidth: '340px',
                  }}
                >
                  <NFT image={metadata.result.image} height={400} />
                  {typeof chainId === 'number' && owner && !ownsNFT ? (
                    <ExternalLink href={getExplorerLink(chainId, owner, ExplorerDataType.ADDRESS)}>
                      <Trans>Owner</Trans>
                    </ExternalLink>
                  ) : null}
                </Flex>
              ) : (
                <Card
                  style={{
                    minWidth: '340px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <LoadingFullscreen />
                </Card>
              )}
            </Box>
            <AutoColumn gap="sm" style={{ width: '100%', height: '100%' }}>
              <Card>
                <AutoColumn gap="md" style={{ width: '100%' }}>
                  <AutoColumn gap="md" style={{ padding: '8px' }}>
                    <Label>
                      <Trans>Liquidity</Trans>
                    </Label>
                    <Text fontSize="36px" fontWeight={500}>
                      {t(`$${fiatValueOfLiquidity}`)}
                    </Text>
                  </AutoColumn>
                  <DarkCard padding="12px 16px" margin="2px 8px">
                    <AutoColumn gap="md">
                      <RowBetween mb="8px">
                        <LinkedCurrency chainId={chainId} currency={currencyQuote} />
                        <RowFixed>
                          <Text>
                            {inverted ? position?.amount0.toSignificant(4) : position?.amount1.toSignificant(4)}
                          </Text>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px' }}>
                              <Text color={theme.colors.text} fontSize={11}>
                                {t(`${inverted ? ratio : 100 - ratio}%`)}
                              </Text>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <LinkedCurrency chainId={chainId} currency={currencyBase} />
                        <RowFixed>
                          <Text>
                            {inverted ? position?.amount1.toSignificant(4) : position?.amount0.toSignificant(4)}
                          </Text>
                          {typeof ratio === 'number' && !removed ? (
                            <Badge style={{ marginLeft: '10px' }}>
                              <Text color={theme.colors.text} fontSize={11}>
                                {t(`${inverted ? 100 - ratio : ratio}%`)}
                              </Text>
                            </Badge>
                          ) : null}
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                </AutoColumn>
              </Card>
              <Card>
                <AutoColumn gap="md" style={{ width: '100%', padding: '8px' }}>
                  <AutoColumn gap="md">
                    <RowBetween style={{ alignItems: 'flex-start' }}>
                      <AutoColumn gap="md">
                        <Label>
                          <Trans>Unclaimed fees</Trans>
                        </Label>
                        <Text color={theme.colors.success} fontSize="36px" fontWeight={500}>
                          {t(`$${fiatValueOfFees}`)}
                        </Text>
                      </AutoColumn>
                      {ownsNFT && (feeValue0?.greaterThan(0) || feeValue1?.greaterThan(0) || !!collectMigrationHash) ? (
                        <ResponsiveButtonConfirmed
                          data-testid="collect-fees-button"
                          disabled={collecting || !!collectMigrationHash}
                          confirmed={!!collectMigrationHash && !isCollectPending}
                          width="fit-content"
                          style={{ borderRadius: '12px' }}
                          padding="4px 8px"
                          onClick={() => setShowConfirm(true)}
                        >
                          {!!collectMigrationHash && !isCollectPending ? (
                            <Text color={theme.colors.text}>
                              <Trans> Collected</Trans>
                            </Text>
                          ) : isCollectPending || collecting ? (
                            <Text color={theme.colors.text}>
                              {' '}
                              <Dots>
                                <Trans>Collecting</Trans>
                              </Dots>
                            </Text>
                          ) : (
                            <>
                              <Text color={theme.colors.text}>
                                <Trans>Collect fees</Trans>
                              </Text>
                            </>
                          )}
                        </ResponsiveButtonConfirmed>
                      ) : null}
                    </RowBetween>
                  </AutoColumn>
                  <DarkCard padding="12px 16px">
                    <AutoColumn gap="md">
                      <RowBetween>
                        <RowFixed>
                          <CurrencyLogo
                            currency={feeValueUpper?.currency}
                            size="20px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text>{feeValueUpper?.currency?.symbol}</Text>
                        </RowFixed>
                        <RowFixed>
                          <Text>{feeValueUpper ? formatCurrencyAmount(feeValueUpper, 4) : '-'}</Text>
                        </RowFixed>
                      </RowBetween>
                      <RowBetween>
                        <RowFixed>
                          <CurrencyLogo
                            currency={feeValueLower?.currency}
                            size="20px"
                            style={{ marginRight: '0.5rem' }}
                          />
                          <Text>{feeValueLower?.currency?.symbol}</Text>
                        </RowFixed>
                        <RowFixed>
                          <Text>{feeValueLower ? formatCurrencyAmount(feeValueLower, 4) : '-'}</Text>
                        </RowFixed>
                      </RowBetween>
                    </AutoColumn>
                  </DarkCard>
                  {showCollectAsWeth && (
                    <AutoColumn gap="md">
                      <RowBetween>
                        <Text>{t(`Collect as ${nativeWrappedSymbol}`)}</Text>
                        <Toggle
                          id="receive-as-weth"
                          isActive={receiveWETH}
                          toggle={() => setReceiveWETH((receive) => !receive)}
                        />
                      </RowBetween>
                    </AutoColumn>
                  )}
                </AutoColumn>
              </Card>
            </AutoColumn>
          </ResponsiveRow>
          <Card paddingLeft={12} paddingRight={12} paddingTop={2} paddingBottom={2}>
            <AutoColumn gap="md">
              <RowBetween mb="8px">
                <RowFixed>
                  <Label display="flex" style={{ marginRight: '12px' }}>
                    <Trans>Price range</Trans>
                  </Label>
                  <Box>
                    <>
                      <RangeBadge removed={removed} inRange={inRange} />
                      <span style={{ width: '8px' }} />
                    </>
                  </Box>
                </RowFixed>
                <RowFixed>
                  {currencyBase && currencyQuote && (
                    <RateToggle
                      currencyA={currencyBase}
                      currencyB={currencyQuote}
                      handleRateToggle={() => setManuallyInverted(!manuallyInverted)}
                    />
                  )}
                </RowFixed>
              </RowBetween>

              <RowBetween style={{ justifyContent: 'center', marginBottom: '12px' }}>
                <DarkCard padding="12px">
                  <AutoColumn gap="sm" justify="center">
                    <ExtentsText>
                      <Trans>Min price</Trans>
                    </ExtentsText>
                    <Text textAlign="center">
                      {formatTickPrice({
                        price: priceLower,
                        atLimit: tickAtLimit,
                        direction: Bound.LOWER,
                        numberType: NumberType.TokenTx,
                      })}
                    </Text>
                    <ExtentsText> {t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}</ExtentsText>

                    {inRange && (
                      <Text color={theme.colors.tertiary}>
                        {t(`Your position will be 100% ${currencyBase?.symbol} at this price.`)}
                      </Text>
                    )}
                  </AutoColumn>
                </DarkCard>

                <DoubleArrow>⟷</DoubleArrow>
                <DarkCard padding="12px">
                  <AutoColumn gap="sm" justify="center">
                    <ExtentsText>
                      <Trans>Max price</Trans>
                    </ExtentsText>
                    <Text textAlign="center">
                      {formatTickPrice({
                        price: priceUpper,
                        atLimit: tickAtLimit,
                        direction: Bound.UPPER,
                        numberType: NumberType.TokenTx,
                      })}
                    </Text>
                    <ExtentsText> {t(`${currencyQuote?.symbol} per ${currencyBase?.symbol}`)}</ExtentsText>

                    {inRange && (
                      <Text color={theme.colors.tertiary}>
                        {t(`Your position will be 100% ${currencyQuote?.symbol} at this price.`)}
                      </Text>
                    )}
                  </AutoColumn>
                </DarkCard>
              </RowBetween>
              <CurrentPriceCard
                inverted={inverted}
                pool={pool}
                currencyQuote={currencyQuote}
                currencyBase={currencyBase}
              />
            </AutoColumn>
          </Card>
        </AutoColumn>
      </Page>
      {/* <SwitchLocaleLink /> */}
    </>
  )
}
