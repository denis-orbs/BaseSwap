import { DeserializedFarm } from 'state/types'

export const getSortedFarmsLP = (farmsLP: DeserializedFarm[]) => {
  if (!farmsLP) return []
  return [
    farmsLP.find((farm) => farm.pid === 1), // ARX-USDCe - arbidex
    // farmsLP.find((farm) => farm.pid === 15), // ARX-ETH - arbidex
    // farmsLP.find((farm) => farm.pid === 44), // ARB-USDC native - NEW
    // farmsLP.find((farm) => farm.pid === 45), // ARB-USDCe - NEW
    // farmsLP.find((farm) => farm.pid === 37), // USDCn - WETH Quantum Narrow NEW
    // farmsLP.find((farm) => farm.pid === 41), // FRAX - WETH Quantum Narrow NEW
    // farmsLP.find((farm) => farm.pid === 42), // frxETH - WETH Quantum Narrow NEW
    // farmsLP.find((farm) => farm.pid === 43), // frxETH - frax Quantum Narrow NEW
    // farmsLP.find((farm) => farm.pid === 46), // jeur-USDC Quantum Narrow NEW
    // farmsLP.find((farm) => farm.pid === 47), // jrt-weth classic new

    // // farmsLP.find((farm) => farm.pid === 39), // frxETH - FRAX Quantum Narrow NEW

    // farmsLP.find((farm) => farm.pid === 30), // ETH-USDCe Quantum Narrow
    // farmsLP.find((farm) => farm.pid === 22), // ETH-USDCe Q Wide
    // farmsLP.find((farm) => farm.pid === 25), // WBTC-USDCe Q Wide
    // farmsLP.find((farm) => farm.pid === 21), // BTC-ETH Q

    // farmsLP.find((farm) => farm.pid === 26), // ARB-USDCe Wide
    // farmsLP.find((farm) => farm.pid === 27), // ARB-WETH Q Wide
    // farmsLP.find((farm) => farm.pid === 28), // RDNT-WETH Q Wide
    // farmsLP.find((farm) => farm.pid === 31), // GNS-WETH Q Wide
    // farmsLP.find((farm) => farm.pid === 36), // USDC USDCE Q Stable
    // farmsLP.find((farm) => farm.pid === 29), // FRAX-USDCe Q Stable
    // farmsLP.find((farm) => farm.pid === 23), // USDT-USDCe Q Stable
    // farmsLP.find((farm) => farm.pid === 24), // DAI-USDCe Q
    // farmsLP.find((farm) => farm.pid === 34), // FRAX USD+ - Classic
    // farmsLP.find((farm) => farm.pid === 35), // FRAX-DAI+ - Classic
    // farmsLP.find((farm) => farm.pid === 17), // USD+ ETH - Classic
    // farmsLP.find((farm) => farm.pid === 8), // USD+ USDCe - Classic
    // farmsLP.find((farm) => farm.pid === 7), // USD+ DAI+ - Classic
    // farmsLP.find((farm) => farm.pid === 16), // DAI-DAI+ - Classic

    // farmsLP.find((farm) => farm.pid === 37), // USDC WETH
  ].filter((farm) => farm !== undefined)
}
