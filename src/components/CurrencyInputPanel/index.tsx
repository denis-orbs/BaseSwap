import { Currency, Pair, Token } from '@magikswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from 'state/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from 'utils/formatBalance'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { Input as NumericalInput } from './NumericalInput'
import { CopyButton } from '../CopyButton'
import AddToWalletButton from '../AddToWallet/AddToWalletButton'

// bottom half of the input panel 
const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;

  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0.25 0.5rem;
  border-radius: 4px; 

; 
  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 4px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`

// top part of input panel 
const LabelRow = styled.div`
  display: flex;

  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  line-height: 1.2rem;
  padding: 0.75rem 1rem 0 1rem;
`

//sits behind the whole thing 
const InputPanel = styled.div`
  display: flex;
  border-radius: 8px; 
  flex-flow: column nowrap;
  position: relative;
  padding: 2px; 
  background: ${({ theme }) => theme.colors.gradients.gold};
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 8px;
  padding-bottom: 6px; 
  padding-top: 6px; 
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: 0 0 12px #fff; 
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 0px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showBUSD?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  disabled,
  error,
  showBUSD,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const token = pair ? pair.liquidityToken : currency instanceof Token ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null

  const amountInDollar = useBUSDCurrencyAmount(
    showBUSD ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )

  return (
    <Box position="relative" id={id}>
      <Flex alignItems="center" marginTop="12px" marginBottom="12px" justifyContent="space-between">
        <Flex>
          {beforeButton}
          <CurrencySelectButton
            zapStyle={zapStyle}
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <Flex alignItems="center"  justifyContent="space-between">
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="36px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text id="pair" fontWeight="900">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text id="pair" fontWeight="900">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length,
                      )}`
                    : currency?.symbol) || t('Select Token')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Flex>
          </CurrencySelectButton>
          {token && tokenAddress ? (
            <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
              <CopyButton
                width="16px"
                buttonColor="textSubtle"
                text={tokenAddress}
                tooltipMessage={t('Token address copied')}
                tooltipTop={-20}
                tooltipRight={40}
                tooltipFontSize={12}
              />
              <AddToWalletButton
                variant="text"
                p="0"
                height="auto"
                width="fit-content"
                tokenAddress={tokenAddress}
                tokenSymbol={token.symbol}
                tokenDecimals={token.decimals}
                tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
              />
            </Flex>
          ) : null}
        </Flex>
        {account && (
          <Text
            onClick={!disabled && onMax}
            color="textSubtle"
            fontSize="14px"
            style={{ display: 'inline', cursor: 'pointer' }}
          >
            {!hideBalance && !!currency
              ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
              : ' -'}
          </Text>
        )}
      </Flex>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error}>
          <LabelRow>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            />
          </LabelRow>
          <InputRow selected={disableCurrencySelect}>
            {!!currency && showBUSD && Number.isFinite(amountInDollar) && (
              <Text fontSize="12px" color="textSubtle" mr="12px">
                ~{formatNumber(amountInDollar)} USD
              </Text>
            )}
            {account && currency && !disabled && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow>
        </Container>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}
