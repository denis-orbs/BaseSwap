import { useWeb3React } from '@web3-react/core'
import { useContext, useEffect } from 'react'
import NFTPoolCardTable from 'views/xFarms/components/NFTPoolCard/NFTPoolCardTable'
import NFTPoolCard from 'views/xFarms/components/NFTPoolCard/NFTPoolCard'
import { useAppDispatch } from 'state'
import { fetchNftPoolFarmDataAsync } from 'state/xFarms'
import { FarmsPageLayout, FarmsContext } from 'views/xFarms'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'

const DividerText = styled(Text)`
  font-size: 1.2rem;
  text-align: center;
  text-transform: uppercase;
  text-decoration: underline;
  font-weight: 600;
  letter-spacing: 4px;
  margin-bottom: 0rem;
  z-index: 1;
  color: #fff;
  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 1.5rem;
  }
`
function CategoryWrapper({ title, children }) {
  return (
    <>
      {/* <DividerText>{title}</DividerText> */}
      {children}
    </>
  )
}

const farmcategories = [
  { title: 'Baseswap', pids: [1, 6, 14, 3, 7, 8, 5, 11, 10, 12, 13, 15, 9, 2] },
  // { title: 'Bluechip', pids: [14, 3] },
  // { title: 'Arbitrum', pids: [44, 45, 26, 27] },
  // { title: 'Stables', pids: [36, 23, 24] },
  // { title: 'Frax', pids: [41, 43, 42, 29, 35, 34] },
  // { title: 'Overnight Finance', pids: [17, 8, 7, 16] },

  // { title: 'Partner', pids: [46, 47, 28, 31] },
]

const XFarmPage = () => {
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chosenFarmsMemoized, viewMode } = useContext(FarmsContext)

  console.log('viewMode,', viewMode)

  const categorizedFarms = farmcategories.map((category) => {
    const farms = chosenFarmsMemoized.filter((farm) => category.pids.includes(farm.pid))
    return { ...category, farms }
  })

  useEffect(() => {
    if (chainId) {
      dispatch(fetchNftPoolFarmDataAsync({ chainId }))
    }

    const interval = setInterval(() => {
      if (chainId) {
        dispatch(fetchNftPoolFarmDataAsync({ chainId }))
      }
    }, 30000)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [chainId, dispatch])

  const stakedOnly = localStorage?.getItem('stakedOnlyFarms') === 'true'

  console.log('categorizedFarms',categorizedFarms)

  return (
    <>
      {categorizedFarms.map(({ title, farms }) => {
        return (
          <CategoryWrapper title={title} key={title}>
            {viewMode === 'CARD' && farms.map((farm, i) => (
             <NFTPoolCard key={farm.pid} farm={farm} removed={false} stakedOnly={stakedOnly} />
            ))}
            {viewMode === 'TABLE' && farms.map((farm, i) => (
             <NFTPoolCardTable key={farm.pid} farm={farm} removed={false} stakedOnly={stakedOnly} />
            ))}
          </CategoryWrapper>
        )
      })}
    </>
  )
}

XFarmPage.Layout = FarmsPageLayout

export default XFarmPage
