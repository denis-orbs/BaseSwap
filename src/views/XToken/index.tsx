import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Flex, Text, Button, useModal } from '@pancakeswap/uikit'
import { TokenImage } from 'components/TokenImage'
import { BsArrowRightCircle } from 'react-icons/bs'
import Page from '../Page'
import PageHeader from 'components/PageHeader'
import useMatchBreakpoints from '@pancakeswap/uikit/src/hooks/useMatchBreakpoints'
import StyledCard from './components/StyledCard'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useXTokenInfo } from 'state/xToken/hooks'
import BigNumber from 'bignumber.js'
import VestingInfo from './components/VestingInfo'
import XTokenRedeemModal from './components/xTokenRedeemModal'
import { getTokenAddress, getTokenInstance } from 'config/constants/token-info'
import { useTranslation } from '@pancakeswap/localization'
import useXTokenActions from './hooks/useXTokenActions'
import XTokenConvertModal from './components/xTokenConvertModal'
import { BIG_ZERO } from 'utils/bigNumber'
import { priceDexScreener } from 'utils/tokenPricing'
import TypeIt from 'typeit-react'


const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: 40px;
  @media (min-width: 768px) {
    font-size: 68px;
  }
`
interface TextProps {
  isMobile: boolean
}

const XARXTitle = styled.div<TextProps>`
  color: #fff;
  font-size: ${(props) => (props.isMobile ? '3.5rem' : '3rem')};
  font-weight: 400;
  text-align: center;
  letter-spacing: 6px;
  line-height: ${(props) => (props.isMobile ? '4rem' : '4rem')};
  margin-bottom: ${(props) => (props.isMobile ? '4rem' : '1.5rem')};
  margin-top: 1.5rem;
  background: -webkit-linear-gradient(#fff, #8797a9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CardTitle = styled.div<TextProps>`
  color: #fff;
  font-size: ${(props) => (props.isMobile ? '2rem' : '2rem')};
  font-weight: 600;
  text-align: center;
  letter-spacing: 5px;
  line-height: ${(props) => (props.isMobile ? '2.1rem' : '2.1rem')};
  margin-bottom: ${(props) => (props.isMobile ? '0.5rem' : '0.2rem')};
  margin-top: 1.5rem;
  background: -webkit-linear-gradient(#fff, #8797a9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const XARXHeader = styled(Flex)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 2rem;
  margin-top: 1rem;
`
const ConvertImages = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  margin-left: 3rem;
  margin-right: 3rem;
`
const Pricing = styled(Flex)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 1rem;
`
const Action = styled(Flex)`
  margin-top: 2rem;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
`

const XToken: React.FC = () => {
  // const [cakePrice, SETCAKEPrice] = useState<BigNumber>(BIG_ZERO)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { chainId } = useWeb3React()
  const { fetchUserData } = useXTokenActions()
  const { userInfo } = useXTokenInfo()



  const BSX = useMemo(() => getTokenInstance(getTokenAddress('ProtocolToken', chainId)), [chainId])
  const xBSX = useMemo(() => getTokenInstance(getTokenAddress('xProtocolToken', chainId)), [chainId])

  const protocolTokenBalance = useMemo(() => new BigNumber(userInfo?.protocolTokenBalance || 0), [userInfo])
  const xTokenBalance = useMemo(() => new BigNumber(userInfo?.xTokenBalance || 0), [userInfo])

  // const [onPresentConvert] = useModal(
  //   <XTokenConvertModal stakingTokenBalance={protocolTokenBalance} stakingTokenPrice={cakePrice} />,
  // )

  const [onPresentRedeem] = useModal(<XTokenRedeemModal userXTokenBalance={xTokenBalance} />)

  useEffect(() => {
    // const fetchData = async () => {
    //   const price = await priceDexScreener('0xd5046b976188eb40f6de40fb527f89c05b323385')
    //   SETCAKEPrice(price)
    // }
    // fetchData()

    fetchUserData()
  }, [])

  return (
    <>
      <Page>
      <WelcomeTypeIt
          options={{
            cursorChar: ' ',
            cursorSpeed: 1000000,
            speed: 75,
          }}
          speed={10}
          getBeforeInit={(instance) => {
            instance.type('xBSX', { speed: 5000 })
            return instance
          }}
        />
          <Text
            textAlign="center"
            mb="1.5rem"
            fontSize={['.8rem', null, null, '0.9rem']}
            fontWeight={['500', null, null, '600']}
          >
            xBSX IS ONLY EARNED BY PROVIDING LIQUIDITY IN{' '}
            <a style={{ textDecoration: 'underline' }} href="/farms">
              INFINITY FARMS.
            </a>{' '}
            IT CAN BE CONVERTED TO ARX BELOW, OR{' '}
            <a style={{ textDecoration: 'underline' }} href="/pools">
              STAKED FOR REAL YIELD.
            </a>
          </Text>
       

        <Flex flexDirection={['column', null, null, 'row']}>
          <StyledCard>
            <XARXHeader>
              <CardTitle isMobile={isMobile}>VEST</CardTitle>
              <Text fontSize={['1rem', null, null, '0.9rem']} letterSpacing="3px">
                VEST xBSX FOR BSX
              </Text>
            </XARXHeader>

            <ConvertImages>
              <TokenImage token={xBSX} width={70} height={70} />
              <BsArrowRightCircle size={35} />
              <TokenImage token={BSX} width={70} height={70} />
            </ConvertImages>

            <Pricing>
              <Flex alignItems="center" justifyContent="space-between" mb="24px">
                <Text fontSize={['1rem', null, null, '0.9rem']} color="text">
                  xBSX BALANCE: {getFullDisplayBalance(xTokenBalance, 18, 3)}
                </Text>
              </Flex>
            </Pricing>

            <Action flexDirection={['row', null, null, 'row']}>
              {/* <Button
                variant="secondary"
                marginX="8px"
                className="glow2"
                width="40%"
                onClick={onPresentConvert}
                disabled={protocolTokenBalance.isZero()}
              >
                Convert to xBSX
              </Button> */}
              <Button
                variant="secondary"
                marginX="8px"
                className="glow2"
                width="40%"
                onClick={onPresentRedeem}
                disabled={xTokenBalance.isZero()}
              >
                Redeem for BSX
              </Button>
              <Button
                variant="secondary"
                className="connectglow"
                width="40%"
                marginX="8px"
                disabled={xTokenBalance.isZero()}
              >
                <a href="/pools" style={{ textDecoration: 'none', color: 'inherit' }}>
                  Stake for Real Yield{' '}
                </a>
              </Button>
            </Action>
          </StyledCard>
        </Flex>

        <Flex width={['100%', '100%', '100%', '80%']}>
          <VestingInfo />
        </Flex>
      </Page>
    </>
  )
}

export default XToken
