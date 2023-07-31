import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { TOKENS_CHAIN_MAP, bscTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'
import { ChainId } from '../../../packages/swap-sdk/src/constants'

// const serializedTokens = serializeTokens(bscTokens)
const serializedTokens = serializeTokens(TOKENS_CHAIN_MAP[DEFAULT_CHAIN_ID])

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = BigNumber.from('20000000000000')
export const DURATION_FACTOR = BigNumber.from('31536000')

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto CAKE</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Stake, Earn – And more!</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeFlexibleSideVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Flexible staking.</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO CAKE',
    description: <Trans>Stake CAKE to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

export const livePools: SerializedPoolConfig[] = [
  // {
  //   sousId: 0,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.cake,
  //   contractAddress: {
  //     97: '',
  //     56: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652', // This is their CHEFV2....
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '10',
  //   isFinished: false,
  // },
  {
    sousId: 1,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.bbt,
    contractAddress: {
      [ChainId.BASE_GOERLI]: '0x21259AAf3fC70e40834b73A3eC36D0d0f68A861F',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.000001',
    version: 3,
  },
  // {
  //   sousId: 289,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.shell,
  //   contractAddress: {
  //     56: '0x595B7AF4F1828AB4953792482b01B2AFC4A46b72',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '89.699',
  //   version: 3,
  // },
  // {
  //   sousId: 288,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.high,
  //   contractAddress: {
  //     56: '0x28cc814bE3B994187B7f8Bfed10516A84A671119',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '0.1332',
  //   version: 3,
  // },
  // {
  //   sousId: 287,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.ole,
  //   contractAddress: {
  //     56: '0xda6F750be1331963E5772BEe757062f6bddcEA4C',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '2.2569',
  //   version: 3,
  // },
  // {
  //   sousId: 286,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.trivia,
  //   contractAddress: {
  //     56: '0x86471019Bf3f403083390AC47643062e15B0256e',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '4.976',
  //   version: 3,
  // },
]

// known finished pools
const finishedPools = [
  // {
  //   sousId: 285,
  //   stakingToken: serializedTokens.cake,
  //   earningToken: serializedTokens.sdao,
  //   contractAddress: {
  //     56: '0x168eF2e470bfeAEB32BE52FB218A41483904851c',
  //     97: '',
  //   },
  //   poolCategory: PoolCategory.CORE,
  //   tokenPerBlock: '0.405',
  //   version: 3,
  // }
].map((p) => ({ ...p, isFinished: true }))

export default [...livePools, ...finishedPools]
