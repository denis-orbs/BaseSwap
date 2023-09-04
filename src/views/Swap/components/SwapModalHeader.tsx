import { 
  // Trade, 
  Percent, JSBI } from '@magikswap/sdk'
import { Text, ArrowDownIcon } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@pancakeswap/localization'
import { warningSeverity } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { CurrencyLogo } from 'components/Logo'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import truncateHash from 'utils/truncateHash'
import tryParseAmount from 'utils/tryParseAmount'
import { TruncatedText } from './styleds'
import { BIPS_BASE } from 'config/constants/exchange'

export default function SwapModalHeader({
  allowedSlippage,
  recipient,
  swapData,
  inputCurrency,
  outputCurrency,
  formattedAmounts,
}: {
  allowedSlippage: number
  recipient: string | null
  swapData: any
  inputCurrency: any
  outputCurrency: any
  formattedAmounts: any
}) {
  const { t } = useTranslation()
  const priceImpactSD = (-100 * swapData.priceImpact).toFixed(0)
  const priceImpactWithoutFee = new Percent(JSBI.BigInt(priceImpactSD), BIPS_BASE)
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee)

  const amount = parseInt(formattedAmounts[Field.OUTPUT]) * (1 - allowedSlippage / 10000)
  const { symbol } = outputCurrency

  const tradeInfoText = t(
    'Output is estimated. You will receive at least %amount% %symbol% or the transaction will revert.  Quote will update every 15 seconds for the next 3 minutes.',
    {
      amount,
      symbol,
    },
  )

  const [estimatedText, transactionRevertText] = tradeInfoText.split(`${amount} ${symbol}`)

  const truncatedRecipient = recipient ? truncateHash(recipient) : ''

  const recipientInfoText = t('Output will be sent to %recipient%', {
    recipient: truncatedRecipient,
  })

  const [recipientSentToText, postSentToText] = recipientInfoText.split(truncatedRecipient)

  const inputAmount = parseInt(swapData?.inAmounts[0]) / 10 ** inputCurrency?.decimals
  const outputAmount = parseInt(swapData?.outAmounts[0]) / 10 ** outputCurrency?.decimals


  return (
    <AutoColumn gap="md">
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={inputCurrency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText fontSize="24px" color='text'>
            {tryParseAmount(inputAmount.toString(), inputCurrency)?.toSignificant(6) ?? ''}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {inputCurrency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <RowFixed>
        <ArrowDownIcon width="16px" ml="4px" />
      </RowFixed>
      <RowBetween align="flex-end">
        <RowFixed gap="0px">
          <CurrencyLogo currency={outputCurrency} size="24px" style={{ marginRight: '12px' }} />
          <TruncatedText
            fontSize="24px"
            color={
              priceImpactSeverity > 2
                ? 'failure'
                : 'text'
            }
          >
            {tryParseAmount(outputAmount.toString(), outputCurrency)?.toSignificant(6) ?? ''}
          </TruncatedText>
        </RowFixed>
        <RowFixed gap="0px">
          <Text fontSize="24px" ml="10px">
            {outputCurrency.symbol}
          </Text>
        </RowFixed>
      </RowBetween>
      <AutoColumn justify="flex-start" gap="sm" style={{ padding: '24px 0 0 0px', maxWidth: '650px' }}>
        <Text small color="textSubtle" textAlign="left" style={{ width: '100%' }}>
          {estimatedText}
          <b>
            {amount} {symbol}
          </b>
          {transactionRevertText}
        </Text>
      </AutoColumn>
      {recipient !== null ? (
        <AutoColumn justify="flex-start" gap="sm" style={{ padding: '12px 0 0 0px' }}>
          <Text color="textSubtle">
            {recipientSentToText}
            <b title={recipient}>{truncatedRecipient}</b>
            {postSentToText}
          </Text>
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}