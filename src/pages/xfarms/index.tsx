import { useWeb3React } from '@web3-react/core'
import { useContext, useEffect } from 'react'
import { useAppDispatch } from 'state'
import { fetchNftPoolFarmDataAsync } from 'state/xFarms'
import { FarmsPageLayout, FarmsContext } from 'views/xFarms'

const XFarmPage = () => {
  const { chainId } = useWeb3React()
  const dispatch = useAppDispatch()
  const { chosenFarmsMemoized } = useContext(FarmsContext)

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

  return (
    <>
      {/* {chosenFarmsMemoized.map((farm) => (
        <FarmCard
          key={farm.pid}
          farm={farm}
          displayApr={getDisplayApr(farm.apr, farm.lpRewardsApr)}
          cakePrice={cakePrice}
          account={account}
          removed={false}
        />
      ))} */}
    </>
  )
}

XFarmPage.Layout = FarmsPageLayout

export default XFarmPage
