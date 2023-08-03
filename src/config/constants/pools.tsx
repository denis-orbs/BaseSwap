import { BigNumber } from '@ethersproject/bignumber'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'
import { serializeTokens } from 'utils/serializeTokens'
import { DEFAULT_CHAIN_ID } from 'utils/providers'
import { TOKENS_CHAIN_MAP } from './tokens'
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
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Stake, Earn – And more!</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.CakeFlexibleSideVault]: {
    name: <Trans>Stake BSWAP</Trans>,
    description: <Trans>Flexible staking.</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: '/images/tokens/autorenew.svg',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO CAKE',
    description: <Trans>Stake CAKE to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000,
    tokenImage: {
      primarySrc: `/images/tokens/${serializedTokens.cake.address}.svg`,
      secondarySrc: `/images/tokens/ifo-pool-icon.svg`,
    },
  },
} as const

export const livePools: SerializedPoolConfig[] = [
  {
    sousId: 100,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.axlUsdc,
    contractAddress: {
      [ChainId.BASE_GOERLI]: '0xbc3db10EeB75575674046653F080CE72037764F5',
      [ChainId.BASE]: '0x5800bC4Fb67836442709D111971E1F26c75b5F61',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.0012',
  },
  {
    sousId: 101,
    stakingToken: serializedTokens.cake,
    earningToken: serializedTokens.wbnb,
    contractAddress: {
      [ChainId.BASE_GOERLI]: '0x60373F437f75eda97c58234b9AE57E32A91e54a8',
      [ChainId.BASE]: '0xa98CFc9c51012346FeCAD04e02D03a79c51d7175',
    },
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0.000000625',
  },
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
