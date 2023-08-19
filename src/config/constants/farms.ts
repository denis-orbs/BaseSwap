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
  //   nftPoolAddress: {
  //     [ChainId.BASE]: '0x6cC611e036D9cE3f66502d5cC544cdC209542Fc2',
  //   },
  //   token: serializedTokens.bbt,
  //   quoteToken: serializedTokens.wbnb,
  //   classic: true,
  // },
  {
    pid: 1,
    lpSymbol: 'BSWAP-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xaA93C2eFD8fcC07c723E19A6e78eF5d2644BF391',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },

  {
    pid: 14,
    lpSymbol: 'axlWBTC-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x317d373E590795e2c09D73FaD7498FC98c0A692B',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x7E0F687d82D05aDb99D196Cd8E342f042803A4b6',
    },
    token: serializedTokens.axlwbtc,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },
  {
    pid: 15,
    lpSymbol: 'UNIDX-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x30dcc8444F8361D5CE119fC25e16AF0B583e88Fd',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x76B9D14133a3AC1318c1a52F68b2caCe5cC4b053',
    },
    token: serializedTokens.unidx,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },

  {
    pid: 3,
    lpSymbol: 'axlUSDC-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x9a0b05f3cf748a114a4f8351802b3bffe07100d4',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x7d3cab8613e18534A2C11277b8EF2AaCaD94f842',
    },
    token: serializedTokens.axlUsdc,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },
  {
    pid: 7,
    lpSymbol: 'ETH-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x41d160033C222E6f3722EC97379867324567d883',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x34688C3E5AAD119851D5dc6AEb01Bf6DEA746eE7',
    },
    token: serializedTokens.wbnb,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },
  {
    pid: 8,
    lpSymbol: 'MIM-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0xa2b120cab75aefdfafda6a14713349a3096eed79',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x36A3483353B89CDBa4D7e4D1a81E3CEe15947eD1',
    },
    token: serializedTokens.mim,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },
  {
    pid: 10,
    lpSymbol: 'USD+-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xB404b32D20F780c7c2Fa44502096675867DecA1e',
    },
    token: serializedTokens.usdp,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },
  {
    pid: 11,
    lpSymbol: 'DAI+-USD+ LP',
    lpAddresses: {
      [ChainId.BASE]: '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x502D1aaC6D8265C1fF3dDef4f03FBe0edE41Fb69',
    },
    token: serializedTokens.daip,
    quoteToken: serializedTokens.usdp,
    classic: true,
  },
  {
    pid: 5,
    lpSymbol: 'DAI-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x6D3c5a4a7aC4B1428368310E4EC3bB1350d01455',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xEC652B590Fe21dcd18Ea01253B5152b202cc3dEb',
    },
    token: serializedTokens.dai,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },
  {
    pid: 6,
    lpSymbol: 'CBETH-ETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x07CFA5Df24fB17486AF0CBf6C910F24253a674D3',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x858a8B8143F8A510f663F8EeF31D9bF1Fb4d986F',
    },
    token: serializedTokens.cbeth,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },
  {
    pid: 12,
    lpSymbol: 'BASIN-WETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x6EDa0a4e05fF50594E53dBf179793CADD03689e5',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xfd6e1E7289a2F1a8Aa375d7b773D4C1f48E268a2',
    },
    token: serializedTokens.basin,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },
  {
    pid: 13,
    lpSymbol: 'YFX-USDC LP',
    lpAddresses: {
      [ChainId.BASE]: '0x1cd6ca847016a3bd0cc1fe2df5027e78ea428170',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xFc755e39A85E6D7AdB313E15048EfDfFfd53c164',
    },
    token: serializedTokens.yfx,
    quoteToken: serializedTokens.usdbc,
    classic: true,
  },

  {
    pid: 9,
    lpSymbol: 'EDE-WETH LP',
    lpAddresses: {
      [ChainId.BASE]: '0x2135780D04C96E14bC205d2c8B8eD4e716d09A2b',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0xDa95F1012702DFE1E6C9827638d0aB21637717E7',
    },
    token: serializedTokens.ede,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },

  {
    pid: 2,
    lpSymbol: 'OGRE-ETH LP',
    lpAddresses: {
      [ChainId.BASE_GOERLI]: '0x26484B48418581993e538607e305b363c98125CA',
      [ChainId.BASE]: '0x81a03d61c913bdcc60519423c8841c18ffb752a8',
    },
    nftPoolAddress: {
      [ChainId.BASE]: '0x4C8A2e0aB00A9A3685F68700D7B67bA4C6dA7111',
    },
    token: serializedTokens.ogre,
    quoteToken: serializedTokens.wbnb,
    classic: true,
  },

  // {
  //   pid: 4,
  //   lpSymbol: 'CBETH-USDBC LP',
  //   lpAddresses: {
  //     [ChainId.BASE]: '0x29a706a49baE714bCfcC96ac1A43e116cB57794c',
  //   },
  //   token: serializedTokens.cbeth,
  //   quoteToken: serializedTokens.usdbc,
  // },
]

export default farms

export const getNftPoolConfigs = (chainId: number) => {
  return farms.filter((f) => f.nftPoolAddress && f.nftPoolAddress[chainId])
}

export const getNftPoolAddresses = (chainId: number) => {
  return getNftPoolConfigs(chainId).map((f) => f.nftPoolAddress[chainId])
}
