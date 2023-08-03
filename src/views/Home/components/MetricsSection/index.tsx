import { Heading, Flex, Text, ChartIcon, CommunityIcon, SwapIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { formatLocalisedCompactNumber } from 'utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import Image from 'next/image'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import logo from '../../../../../public/images/baselogolarge.png'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <div style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF', 
      borderRadius: '100px' }}>
      <Image src={logo} alt="logo" height="150px" width="150px"  />
      </div>
      <Heading textAlign="center" scale="xl">
        Because you really only live once.
      </Heading>

      <Text textAlign="center" color="textSubtle">
        {t(
          'Decentralized finance leverages the individual and collective capacity of all of us, without interference.',
        )}
      </Text>
      <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          Join us on BASE chain now.
          {/* <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
          {inFunds} */}
        </Text>
      </Flex>

      {/* <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Will you join them?')}
      </Text> */}

      <Flex flexDirection={['column', null, null, 'row']}>
        <IconCard
          style={{ backgroundColor: '#333' }}
          {...UsersCardData}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <StatCardContent
            headingText="Safe and secure"
            bodyText={t('Trusted and secure platform')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
        <IconCard
          style={{ backgroundColor: '#333' }}
          {...TradesCardData}
          mr={[null, null, null, '16px']}
          mb={['16px', null, null, '0']}
        >
          <StatCardContent
            // headingText={t('%trades% trades', { trades })}
            headingText="Rapid swaps"
            bodyText={t('On the BASE blockchain')}
            highlightColor={theme.colors.primary}
          />
        </IconCard>
        <IconCard style={{ backgroundColor: '#333' }} {...StakedCardData}>
          <StatCardContent
            headingText="Stake and farm"
            bodyText={t('Grow your portfolio on BASE')}
            highlightColor={theme.colors.failure}
          />
        </IconCard>
      </Flex>
    </Flex>
  )
}

export default Stats
