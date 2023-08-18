/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useCallback, useState, useMemo, useRef, createContext } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Text, Flex, Spinner } from '@pancakeswap/uikit'
import styled from 'styled-components'
import FlexLayout from 'components/Layout/Flex'
import Page from 'views/Page'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { DeserializedFarm } from 'state/types'
import orderBy from 'lodash/orderBy'
import { latinise } from 'utils/latinise'
import { useRouter } from 'next/router'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { FarmWithStakedValue } from './components/types'
import { useMatchBreakpoints, Toggle } from '@pancakeswap/uikit'
import { getSortedFarmsLP } from './utils'
import { getXFarmApr } from 'utils/apr'
import { useNftPoolsFarms } from 'state/xFarms/hooks'
import { useUserFarmStakedOnly } from 'state/user/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTokenPrices from 'hooks/useTokenPrices'
import { getTokenAddress } from 'config/constants/token-info'
import { useTranslation } from '@pancakeswap/localization'

interface TextProps {
  isMobile: boolean
  fontWeight?: number
  marginBottom?: string
}

export const XARXTitle = styled.div<TextProps>`
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

export const XARXSubTitle = styled.div<TextProps>`
  color: #fff;
  font-size: ${(props) => (props.isMobile ? '1.2rem' : '1.2rem')};
  line-height: ${(props) => (props.isMobile ? '1.5rem' : '1.7rem')};
  text-align: center;
  letter-spacing: 2px;
  font-weight: 500;
  background: -webkit-linear-gradient(#fff, #8797a9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const ControlContainer = styled.div`
  display: flex;
  width: 90%;
  align-items: center;
  position: relative;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 8px;
  margin-top: 1rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    width: 70%;
    flex-wrap: wrap;
    padding: 8px;
    margin-bottom: 8px;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;
  margin: 10px;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const NUMBER_OF_FARMS_VISIBLE = 40

const Farms: React.FC = ({ children }) => {
  const { pathname, query: urlQuery } = useRouter()
  const { account, chainId } = useWeb3React()

  const { arxPerSec, WETHPerSec, farms: farmsLP } = useNftPoolsFarms()

  const { t } = useTranslation()
  const { getTokenPrice } = useTokenPrices()
  const cakePrice = new BigNumber(getTokenPrice(getTokenAddress('ProtocolToken', chainId)))
  const WETHPrice = new BigNumber(getTokenPrice(getTokenAddress('WETH', chainId)))
  const [query, setQuery] = useState(typeof urlQuery?.search === 'string' ? urlQuery?.search : '')
  const [sortOption, setSortOption] = useState('hot')
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const chosenFarmsLength = useRef(0)

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  const sortedFarmsLP = getSortedFarmsLP(farmsLP as unknown as DeserializedFarm[])

  const [stakedOnlyState, setStakedOnlyState] = useState(localStorage?.getItem('stakedOnlyFarms') === 'true')

  const setStakedOnly = () => {
    const stakedOnly = localStorage?.getItem('stakedOnlyFarms') === 'true'
    if (stakedOnly) {
      localStorage.setItem('stakedOnlyFarms', 'false')
      setStakedOnlyState(false)
    } else {
      localStorage.setItem('stakedOnlyFarms', 'true')
      setStakedOnlyState(true)
    }
  }

  // const [stakedOnly, setStakedOnly] = useUserFarmStakedOnly(isActive)
  // const [stakedOnly, setStakedOnly] = useState(false)

  //  const activeFarms = sortedFarmsLP.filter((farm) => farm.pid !== 0 &&  farm.multiplier !== '0X')
  const activeFarms = sortedFarmsLP
  const inactiveFarms = []
  const archivedFarms = sortedFarmsLP

  // const stakedOnlyFarms = activeFarms.filter(
  //   (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  // )

  // const stakedInactiveFarms = inactiveFarms.filter(
  //   (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  // )

  // const stakedArchivedFarms = archivedFarms.filter(
  //   (farm) => farm.userData && new BigNumber(farm.userData.stakedBalance).isGreaterThan(0),
  // )

  const farmsList = useCallback(
    (farmsToDisplay: DeserializedFarm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        if (!farm.lpTotalInQuoteToken || !farm.quoteTokenPriceBusd) {
          return farm
        }

        const totalLiquidity = new BigNumber(farm.TVL || 0)
        const arxPoolWeight = new BigNumber(farm.arxPoolWeight || 0)
        const WETHPoolWeight = new BigNumber(farm.WETHPoolWeight || 0)

        const { cakeRewardsApr, lpRewardsApr } = isActive
          ? getXFarmApr(
              arxPoolWeight,
              WETHPoolWeight,
              cakePrice,
              WETHPrice,
              totalLiquidity,
              farm.lpAddresses[chainId],
              arxPerSec,
              WETHPerSec,
            )
          : { cakeRewardsApr: 0, lpRewardsApr: 0 }

        return { ...farm, apr: cakeRewardsApr, lpRewardsApr, liquidity: totalLiquidity }
      })

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter((farm: FarmWithStakedValue) => {
          return latinise(farm.lpSymbol.toLowerCase()).includes(lowercaseQuery)
        })
      }

      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive, arxPerSec, WETHPerSec, WETHPrice, farmsLP],
  )

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const [numberOfFarmsVisible, setNumberOfFarmsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfFarmsVisible((farmsCurrentlyVisible) => {
        if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
          return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return farmsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const { isMobile } = useMatchBreakpoints()
  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const chosenFarmsMemoized = useMemo(() => {
    let chosenFarms = []
    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case 'apr':
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr + farm.lpRewardsApr, 'desc')
        case 'multiplier':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0),
            'desc',
          )
        case 'earned':
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => (farm.userData ? Number(farm.userData.earnings) : 0),
            'desc',
          )
        case 'liquidity':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.liquidity), 'desc')
        case 'latest':
          return orderBy(farms, (farm: FarmWithStakedValue) => Number(farm.pid), 'desc')
        case 'quantum':
          return farms.filter((farm: FarmWithStakedValue) => farm.quantum === true)
        default:
          return farms
      }
    }

    if (isActive) {
      // chosenFarms = stakedOnly ? farmsList(stakedOnlyFarms) : farmsList(activeFarms)
      chosenFarms = farmsList(activeFarms)
    }
    if (isInactive) {
      // chosenFarms = stakedOnly ? farmsList(stakedInactiveFarms) : farmsList(inactiveFarms)
      chosenFarms = farmsList(inactiveFarms)
    }
    if (isArchived) {
      // chosenFarms = stakedOnly ? farmsList(stakedArchivedFarms) : farmsList(archivedFarms)
      chosenFarms = farmsList(archivedFarms)
    }

    return sortFarms(chosenFarms).slice(0, numberOfFarmsVisible)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    // stakedArchivedFarms,
    // stakedInactiveFarms,
    // stakedOnly,
    // stakedOnlyFarms,
    numberOfFarmsVisible,
    farmsLP,
  ])

  chosenFarmsLength.current = chosenFarmsMemoized.length

  return (
    <FarmsContext.Provider value={{ chosenFarmsMemoized }}>
      <Page>
        <PageHeader style={{}}>
          <XARXTitle isMobile={isMobile}>{t('Farms')}</XARXTitle>
          <XARXSubTitle isMobile={isMobile}>Earn ARX, xARX, and WETH by staking LP tokens. </XARXSubTitle>
          <Text>
            LOOKING FOR LEGACY FARMS? Find them&nbsp;
            <u>
              <a href="/legacyfarms">here</a>
            </u>
            !
          </Text>
        </PageHeader>
        {!account ? (
          // <ConnectWalletButton width={['100%', null, null, '25%']} marginTop={['1rem', null, null, '3rem']} />
          <ConnectWalletButton />
        ) : (
          <>
            <ControlContainer>
              <FilterContainer>
                <LabelWrapper>
                  <Text textTransform="uppercase">{t('Sort by')}</Text>
                  <Select
                    options={[
                      {
                        label: t('Hot'),
                        value: 'hot',
                      },
                      {
                        label: t('APR'),
                        value: 'apr',
                      },
                      // THIS DOESN'T WORK- NO PAWG HERE
                      // {
                      //   label: t('Earned'),
                      //   value: 'earned',
                      // },
                      {
                        label: t('Liquidity'),
                        value: 'liquidity',
                      },
                    ]}
                    onOptionChange={handleSortOptionChange}
                  />
                </LabelWrapper>
                <LabelWrapper style={{ marginLeft: 16 }}>
                  <Text textTransform="uppercase">{t('Search')}</Text>
                  <SearchInput initialValue={query} onChange={handleChangeQuery} placeholder="Search Farms" />
                </LabelWrapper>
              </FilterContainer>
              <ViewControls>
                <ToggleWrapper>
                  <Toggle
                    id="staked-only-farms"
                    checked={stakedOnlyState}
                    onChange={() => setStakedOnly()}
                    scale="sm"
                  />
                  <Text> {t('Staked only')}</Text>
                </ToggleWrapper>
              </ViewControls>
            </ControlContainer>

            <FlexLayout style={{ paddingLeft: '8px' }}>{children}</FlexLayout>
            {account && !farmsLP.length && (
              <Flex justifyContent="center">
                <Spinner />
              </Flex>
            )}

            <div ref={observerRef} />
          </>
        )}
      </Page>
    </FarmsContext.Provider>
  )
}

export const FarmsContext = createContext({ chosenFarmsMemoized: [] })

export default Farms
