import { baseTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const priceHelperLps: SerializedFarmConfig[] = [
  /**
   * These LPs are just used to help with price calculation for MasterChef LPs (farms.ts).
   * This list is added to the MasterChefLps and passed to fetchFarm. The calls to get contract information about the token/quoteToken in the LP are still made.
   * The absence of a PID means the masterchef contract calls are skipped for this farm.
   * Prices are then fetched for all farms (masterchef + priceHelperLps).
   * Before storing to redux, farms without a PID are filtered out.
   */
  // {
  //   pid: null,
  //   lpSymbol: 'ANKR-BNB LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x3147F98B8f9C53Acdf8F16332eaD12B592a1a4ae',
  //   },
  //   token: bscTokens.ankr,
  //   quoteToken: bscTokens.wbnb,
  // },
  // {
  //   pid: null,
  //   lpSymbol: 'ANTEX-BUSD LP',
  //   lpAddresses: {
  //     97: '',
  //     56: '0x4DcB7b3b0E8914DC0e6D366521604cD23E7991E1',
  //   },
  //   token: bscTokens.antex,
  //   quoteToken: bscTokens.busd,
  // },
  {
    pid: 1,
    lpSymbol: 'BSWAP-ETH LP',
    lpAddresses: {
      8453: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    },
    token: baseTokens.cake,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'OGRE-ETH LP',
    lpAddresses: {
     8453: '0x81a03d61c913bdcc60519423c8841c18ffb752a8',
    },
    token: baseTokens.ogre,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'axlUSDC-ETH LP',
    lpAddresses: {
     8453: '0x9a0b05f3cf748a114a4f8351802b3bffe07100d4',
    },
    token: baseTokens.axlUsdc,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 4,
    lpSymbol: 'USDBC-ETH LP',
    lpAddresses: {
     8453: '0x29a706a49baE714bCfcC96ac1A43e116cB57794c',
    },
    token: baseTokens.usdbc,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'DAI-USDBC LP',
    lpAddresses: {
     8453: '0x6D3c5a4a7aC4B1428368310E4EC3bB1350d01455',
    },
    token: baseTokens.dai,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 6,
    lpSymbol: 'CBETH-ETH LP',
    lpAddresses: {
     8453: '0x07CFA5Df24fB17486AF0CBf6C910F24253a674D3',
    },
    token: baseTokens.cbeth,
    quoteToken: baseTokens.wbnb,
  },
]

export default priceHelperLps
