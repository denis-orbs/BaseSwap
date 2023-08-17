import { useWeb3React } from '@web3-react/core'
// import { usePriceCakeBusd } from 'state/farms/hooks'

const XFarmPage = () => {
  const { account } = useWeb3React()
  // const { chosenFarmsMemoized } = useContext(FarmsContext)
  // const cakePrice = usePriceCakeBusd()

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
