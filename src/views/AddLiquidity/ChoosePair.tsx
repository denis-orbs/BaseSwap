import { Currency } from '@magikswap/sdk'
import { Box, Text, AddIcon, CardBody, Button, CardFooter } from '@pancakeswap/uikit'
import { CurrencySelect } from 'components/CurrencySelect'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { AppHeader } from '../../components/App'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'

export function ChoosePair({
  currencyA,
  currencyB,
  error,
  onNext,
}: {
  currencyA?: Currency
  currencyB?: Currency
  error?: string
  onNext?: () => void
}) {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const isValid = !error
  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  return (
    <>
      <AppHeader
        title={t('Add Liquidity')}
        subtitle={t('')}
        helper={t(
          '',
        )}
        backTo="/liquidity"
      />
      <CardBody style={{ borderLeft: '4px solid #fff', borderRight: '4px solid #fff'}}>
        <Box>
          <Text textTransform="uppercase" color="background" fontWeight="900" small pb="12px">
            {t('Choose your fighter')}
          </Text>
          <FlexGap gap="4px">
            <CurrencySelect
              id="add-liquidity-select-tokena"
              selectedCurrency={currencyA}
              onCurrencySelect={handleCurrencyASelect}
              showCommonBases
            />
            <AddIcon color="textSubtle" />
            <CurrencySelect
              id="add-liquidity-select-tokenb"
              selectedCurrency={currencyB}
              onCurrencySelect={handleCurrencyBSelect}
              showCommonBases
            />
          </FlexGap>
        </Box>
      </CardBody>
      <CardFooter>
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : (
          <Button
            data-test="choose-pair-next"
            width="100%"
            variant={!isValid ? 'danger' : 'primary'}
            onClick={onNext}
            disabled={!isValid}
          >
            {error ?? t('Add Liquidity')}
          </Button>
        )}
      </CardFooter>
    </>
  )
}
