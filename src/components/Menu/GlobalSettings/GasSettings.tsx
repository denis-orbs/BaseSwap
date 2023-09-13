import { Flex, Button, Text, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import QuestionHelper from 'components/QuestionHelper'
import { useTranslation } from '@pancakeswap/localization'
import { useGasPriceManager } from 'state/user/hooks'
import { GAS_PRICE_GWEI, GAS_PRICE } from 'state/types'


const GasSettings = () => {
  const { t } = useTranslation()
  const [gasPrice, setGasPrice] = useGasPriceManager()
  const { isMobile } = useMatchBreakpointsContext();

  return (
    <Flex flexDirection="column" mb="12px">
        <Flex mb="2px" alignItems="center" justifyContent="center"  >
          
        <Text textAlign="center" fontWeight="200" color="#fff">
          {t('Default Transaction Speed (GWEI)')}
        </Text>
        <QuestionHelper
          text={t(
            'Adjusts the gas price (transaction fee) for your transaction. Higher GWEI = higher speed = higher fees',
          )}
          placement="top-start"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap" justifyContent="space-between" alignItems="space-between" paddingX={isMobile ? '0rem' : '1rem' }>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.default)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.default ? 'gason' : 'gasoff'}
        >
           <Text fontSize="12px" >
          {t('Standard (%gasPrice%)', { gasPrice: GAS_PRICE.default })}
          </Text>
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.fast)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.fast ? 'gason' : 'gasoff'}
        >
           <Text fontSize="12px" >
          {t('Fast (%gasPrice%)', { gasPrice: GAS_PRICE.fast })}
          </Text>
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setGasPrice(GAS_PRICE_GWEI.instant)
          }}
          variant={gasPrice === GAS_PRICE_GWEI.instant ? 'gason' : 'gasoff'}
        >
           <Text fontSize="12px" >
          {t('Instant (%gasPrice%)', { gasPrice: GAS_PRICE.instant })}
          </Text>
        </Button>
      </Flex>
    </Flex>
  )
}

export default GasSettings
