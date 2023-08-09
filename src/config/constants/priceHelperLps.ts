import { baseTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const priceHelperLps: SerializedFarmConfig[] = [
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
  {
    pid: 8,
    lpSymbol: 'MIM-USDC LP',
    lpAddresses: {
      8453: '0xa2b120cab75aefdfafda6a14713349a3096eed79',
    },
    token: baseTokens.mim,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 9,
    lpSymbol: 'EDE-WETH LP',
    lpAddresses: {
     8453: '0x2135780D04C96E14bC205d2c8B8eD4e716d09A2b',
    },
    token: baseTokens.ede,
    quoteToken: baseTokens.wbnb,
  },
  {
    pid: 10,
    lpSymbol: 'USD+-USDC LP',
    lpAddresses: {
      8453: '0x696b4d181Eb58cD4B54a59d2Ce834184Cf7Ac31A',
    },
    token: baseTokens.usdp,
    quoteToken: baseTokens.usdbc,
  },
  {
    pid: 11,
    lpSymbol: 'DAI+-USD+ LP',
    lpAddresses: {
      8453: '0x7Fb35b3967798cE8322cC50eF52553BC5Ee4c306',
    },
    token: baseTokens.daip,
    quoteToken: baseTokens.usdp,
  },
]

export default priceHelperLps
