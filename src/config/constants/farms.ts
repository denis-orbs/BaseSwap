import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { ChainId } from '../../../packages/swap-sdk/src/constants'
import { TOKENS_CHAIN_MAP } from './tokens'
import { SerializedFarmConfig } from './types'

export const serializedTokens = serializeTokens(TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID])

export const CAKE_BNB_LP_MAINNET = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

const farms: SerializedFarmConfig[] = [
  // {
  //   pid: 0,
  //   lpSymbol: 'BBT-ETH LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '0xf4b96d5162adee867b6361e9f1848d701c4286c7',
  //   },
  //   token: serializedTokens.bbt,
  //   quoteToken: serializedTokens.wbnb,
  // },
  {
    pid: 1,
    lpSymbol: 'BSWAP-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'OGRE-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0x81a03d61c913bdcc60519423c8841c18ffb752a8',
    },
    token: serializedTokens.ogre,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 3,
    lpSymbol: 'axlUSDC-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x9a0b05f3cf748a114a4f8351802b3bffe07100d4',
    },
    token: serializedTokens.axlUsdc,
    quoteToken: serializedTokens.wbnb,
  },
  // {
  //   pid: 4,
  //   lpSymbol: 'USDBC-ETH LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.usdbc,
  //   quoteToken: serializedTokens.wbnb,
  // },
  // {
  //   pid: 5,
  //   lpSymbol: 'DAI-USDBC LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.dai,
  //   quoteToken: serializedTokens.usdbc,
  // },
  // {
  //   pid: 6,
  //   lpSymbol: 'CBETH-ETH LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.cbeth,
  //   quoteToken: serializedTokens.wbnb,
  // },
  // {
  //   pid: 1,
  //   lpSymbol: 'ETH-axlUSDC LP',
  //   lpAddresses: {
  //     [ChainId.BASE_GOERLI]: '0x61Bb3E29A49aCbd0160E6500c8261f3Ac8f0e431',
  //     [ChainId.BASE]: '',
  //   },
  //   token: serializedTokens.axlUsdc,
  //   quoteToken: serializedTokens.wbnb,
  // },
]

export default farms
