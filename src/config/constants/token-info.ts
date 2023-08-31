import { ChainId } from '@magikswap/sdk'
import { currentTokenMap } from './tokens'

export const DEFAULT_STABLE_SYMBOL = 'USDbC'
export const WRAPPED_NATIVE_SYMBOL = 'WETH'

export interface ITokenInfo {
  coinGeckoId?: string
  dexscreenerPair?: string
  name?: string
  symbol?: string
  decimals?: number
  logoURI?: string
  tokenListKey?: string // key in tokens.ts if needed to join to get a token instance
  addresses: { [chainId: number]: string }
}

export type StableTokenLookupKey =
  | 'FRAX'
  | 'USDCe'
  | 'USDP'
  | 'DAIP'
  | 'USDT'
  | 'DAI'
  | 'USDPLUS'
  | 'DAIPLUS'
  | 'axlUSDC'
  | 'USDbC'
// Add to this list as needed
export type TokenLookupKey =
  | StableTokenLookupKey
  | 'ProtocolToken'
  | 'BSWAP'
  | 'xProtocolToken'
  | 'WETH'
  | 'WBTC'
  | 'GMX'
  | 'ARB'
  | 'frxETH'
  | 'GNS'
  | 'DAI+'
  | 'USD+'
  | 'CGLD'
  | 'JRT'
  | 'DEUS'
  | 'RDNT'
  | 'OGRE'
  | 'DAI'
  | 'USDbC'
  | 'CBETH'
  | 'MIM'
  | 'USDP'
  | 'DAIP'
  | 'axlWBTC'
  | 'BBT'
  | 'EDE'
  | 'CBETH'
  | 'MIM'
  | 'YFX'
  | 'AXLWBTC'
  | 'MAG'
  | 'BLAZE'
  | 'UNIDX'
  | 'BASIN'
  | 'OGRE'
  | 'BSX'
  | 'GMD'
  | 'GND'
  | 'MAI'

export type TokenInfoMapping = {
  [key in TokenLookupKey]?: ITokenInfo
}

export const STABLE_TOKEN_INF0: TokenInfoMapping = {
  axlUSDC: {
    coinGeckoId: 'axlusdc',
    decimals: 6,
    addresses: {
      [ChainId.BASE]: '0xEB466342C4d449BC9f53A865D5Cb90586f405215',
    },
  },
  USDbC: {
    coinGeckoId: 'usd-coin',
    decimals: 6,
    addresses: {
      [ChainId.BASE]: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    },
  },
  DAI: {
    coinGeckoId: 'dai',
    decimals: 18,
    addresses: {
      [ChainId.BASE]: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
    },
  },
  USDCe: {
    coinGeckoId: 'usd-coin',
    decimals: 6,
    addresses: {
      [ChainId.ARBITRUM]: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
  },
  WETH: {
    coinGeckoId: 'ethereum',
    addresses: {
      [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
  },
  FRAX: {
    coinGeckoId: 'frax',
    addresses: {
      [ChainId.ARBITRUM]: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
    },
  },
  USDT: {
    coinGeckoId: 'tether',
    addresses: {
      [ChainId.ARBITRUM]: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    },
  },
  USDPLUS: {
    coinGeckoId: 'usd',
    addresses: {
      [ChainId.BASE]: '0xB79DD08EA68A908A97220C76d19A6aA9cBDE4376',
    },
  },
  DAIPLUS: {
    coinGeckoId: 'overnight-dai',
    addresses: {
      [ChainId.BASE]: '0x65a2508C429a6078a7BC2f7dF81aB575BD9D9275',
    },
  },
}

export const TOKEN_INF0: TokenInfoMapping = {
  ...STABLE_TOKEN_INF0,
  // BBT: {
  //   addresses: {
  //     [ChainId.BASE]: '0x8DFAf055e21B16302DBf00815e5b4d9b6042a4Df',
  //   },
  // },
  ProtocolToken: {
    // coinGeckoId: 'arbitrum-exchange',
    // dexscreenerPair: '0xE80B4F755417FB4baF4dbd23C029db3F62786523', // TODO: Update after live on screener
    addresses: {
      [ChainId.BASE]: '0xd5046B976188EB40f6DE40fB527F89c05b323385', // BSX
      [ChainId.ARBITRUM]: '0xD5954c3084a1cCd70B4dA011E67760B8e78aeE84',
    },
  },
  xProtocolToken: {
    addresses: {
      [ChainId.BASE]: '0xE4750593d1fC8E74b31549212899A72162f315Fa', // xBSX
      [ChainId.ARBITRUM]: '0xa954A31137fBe5c2D384A0067DE042bAA58b3403',
    },
  },
  BSWAP: {
    dexscreenerPair: '0xE80B4F755417FB4baF4dbd23C029db3F62786523',
    addresses: {
      [ChainId.BASE]: '0x78a087d713Be963Bf307b18F2Ff8122EF9A63ae9',
    },
  },
  BSX: {
    dexscreenerPair: '0x7fea0384f38ef6ae79bb12295a9e10c464204f52',
    addresses: {
      [ChainId.BASE]: '0xd5046B976188EB40f6DE40fB527F89c05b323385',
    },
  },
  WETH: {
    coinGeckoId: 'ethereum',
    addresses: {
      [ChainId.BASE]: '0x4200000000000000000000000000000000000006',
      [ChainId.ARBITRUM]: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
  },
  WBTC: {
    coinGeckoId: 'wrapped-bitcoin',
    addresses: {
      [ChainId.ARBITRUM]: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
    },
  },

  ARB: {
    coinGeckoId: 'arbitrum',
    addresses: {
      [ChainId.ARBITRUM]: '0x912ce59144191c1204e64559fe8253a0e49e6548',
    },
  },

  frxETH: {
    coinGeckoId: 'frax-ether',
    addresses: {
      [ChainId.ARBITRUM]: '0x178412e79c25968a32e89b11f63B33F733770c2A',
    },
  },

  GMX: {
    coinGeckoId: 'gmx',
    addresses: {
      [ChainId.ARBITRUM]: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F',
    },
  },
  GNS: {
    coinGeckoId: 'gains-network',
    addresses: {
      [ChainId.ARBITRUM]: '0x18c11FD286C5EC11c3b683Caa813B77f5163A122',
    },
  },
  RDNT: {
    coinGeckoId: 'radiant-capital',
    addresses: {
      [ChainId.ARBITRUM]: '0x3082CC23568eA640225c2467653dB90e9250AaA0',
    },
  },
  'DAI+': {
    coinGeckoId: 'dai',
    addresses: {
      [ChainId.ARBITRUM]: '0xeb8E93A0c7504Bffd8A8fFa56CD754c63aAeBFe8',
    },
  },
  JRT: {
    coinGeckoId: 'jarvis-reward-token',
    addresses: {
      [ChainId.ARBITRUM]: '0x6Aa395F06986ea4eFe0a4630C7865C1eB08D5e7e',
    },
  },
  'USD+': {
    coinGeckoId: 'usd-coin',
    addresses: {
      [ChainId.ARBITRUM]: '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65',
    },
  },
  DEUS: {
    coinGeckoId: 'deus-finance-2',
    addresses: {
      [ChainId.ARBITRUM]: '0xDE5ed76E7c05eC5e4572CfC88d1ACEA165109E44',
    },
  },
  EDE: {
    addresses: {
      [ChainId.BASE]: '0x0A074378461FB7ed3300eA638c6Cc38246db4434',
      [ChainId.ARBITRUM]: '0x0A074378461FB7ed3300eA638c6Cc38246db4434',
    },
  },
  CBETH: {
    addresses: {
      [ChainId.BASE]: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
      [ChainId.ARBITRUM]: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    },
  },
  MIM: {
    addresses: {
      [ChainId.BASE]: '0x4A3A6Dd60A34bB2Aba60D73B4C88315E9CeB6A3D',
      [ChainId.ARBITRUM]: '0x4A3A6Dd60A34bB2Aba60D73B4C88315E9CeB6A3D',
    },
  },
  YFX: {
    addresses: {
      [ChainId.BASE]: '0x8901cB2e82CC95c01e42206F8d1F417FE53e7Af0',
      [ChainId.ARBITRUM]: '0x8901cB2e82CC95c01e42206F8d1F417FE53e7Af0',
    },
  },
  GMD: {
    addresses: {
      [ChainId.BASE]: '0xCd239E01C36d3079c0dAeF355C61cFF591C40DB1',
      [ChainId.ARBITRUM]: '0xCd239E01C36d3079c0dAeF355C61cFF591C40DB1',
    },
  },
  GND: {
    addresses: {
      [ChainId.BASE]: '0xfb825e93822dd971ebdfdb2180a751958dbd5e16',
      [ChainId.ARBITRUM]: '0xfb825e93822dd971ebdfdb2180a751958dbd5e16',
    },
  },
  AXLWBTC: {
    dexscreenerPair: '0x317d373E590795e2c09D73FaD7498FC98c0A692B',
    addresses: {
      [ChainId.BASE]: '0x1a35EE4640b0A3B87705B0A4B45D227Ba60Ca2ad',
      [ChainId.ARBITRUM]: '0x1a35EE4640b0A3B87705B0A4B45D227Ba60Ca2ad',
    },
  },
  MAG: {
    addresses: {
      [ChainId.BASE]: '0x2DC1cDa9186a4993bD36dE60D08787c0C382BEAD',
      [ChainId.ARBITRUM]: '0x2DC1cDa9186a4993bD36dE60D08787c0C382BEAD',
    },
  },
  BLAZE: {
    addresses: {
      [ChainId.BASE]: '0x37DEfBC399e5737D53Dfb5533d9954572F5B19bf',
      [ChainId.ARBITRUM]: '0x37DEfBC399e5737D53Dfb5533d9954572F5B19bf',
    },
  },
  UNIDX: {
    dexscreenerPair: '0x30dcc8444f8361d5ce119fc25e16af0b583e88fd',
    addresses: {
      [ChainId.BASE]: '0x6B4712AE9797C199edd44F897cA09BC57628a1CF',
      [ChainId.ARBITRUM]: '0x6B4712AE9797C199edd44F897cA09BC57628a1CF',
    },
  },
  BASIN: {
    addresses: {
      [ChainId.BASE]: '0x4788de271F50EA6f5D5D2a5072B8D3C61d650326',
      [ChainId.ARBITRUM]: '0x4788de271F50EA6f5D5D2a5072B8D3C61d650326',
    },
  },
  MAI: {
    addresses: {
      [ChainId.BASE]: '0xbf1aeA8670D2528E08334083616dD9C5F3B087aE',
      [ChainId.ARBITRUM]: '0xbf1aeA8670D2528E08334083616dD9C5F3B087aE',
    },
  },
  OGRE: {
    addresses: {
      [ChainId.BASE]: '0xAB8a1c03b8E4e1D21c8Ddd6eDf9e07f26E843492',
      [ChainId.ARBITRUM]: '0xAB8a1c03b8E4e1D21c8Ddd6eDf9e07f26E843492',
    },
  },
}

export function getTokenAddressesForChain(chainId: ChainId) {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].addresses[chainId])
    .map((info) => info[1].addresses[chainId])

  return infos
}

export const getCoingeckoTokenInfos = (chainId: ChainId): { tokenAddress: string; geckoId: string }[] => {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].coinGeckoId && info[1].addresses[chainId])
    .map((info) => {
      return {
        geckoId: info[1].coinGeckoId,
        tokenAddress: info[1].addresses[chainId],
      }
    })

  return infos
}

export const getDexscreenerTokenInfos = (chainId: ChainId): { tokenAddress: string; dexscreenerPair: string }[] => {
  const infos = Object.entries(TOKEN_INF0)
    .filter((info) => info[1].dexscreenerPair && info[1].addresses[chainId])
    .map((info) => {
      return {
        dexscreenerPair: info[1].dexscreenerPair,
        tokenAddress: info[1].addresses[chainId],
      }
    })

  return infos
}

export function getTokenInfo(key: TokenLookupKey, chainId: number): TokenInfoMapping & { address: string } {
  const token = TOKEN_INF0[key]

  return {
    ...token,
    address: token.addresses[chainId],
  }
}

export const getTokenAddress = (keyOrSymbol: TokenLookupKey, chainId: ChainId) => {
  if (!chainId) return ''

  const ref = TOKEN_INF0[keyOrSymbol]
  if (!ref) {
    throw new Error(`No address mapping for keyOrSymbol: ${keyOrSymbol}`)
  }

  const address = ref.addresses[chainId]
  if (!address) {
    throw new Error(`No chain id address mapping: ${chainId}`)
  }

  return address
}

export const getTokenImage = (address: string) => {
  return `/images/tokens/${address}.png`
}

export function getTokenInstance(address: string) {
  const instance = Object.entries(currentTokenMap).find((tk) => tk[1].address.toLowerCase() === address.toLowerCase())
  return instance ? instance[1] : null
}
