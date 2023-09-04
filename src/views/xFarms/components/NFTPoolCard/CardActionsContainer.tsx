import { Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'

import styled, { css } from 'styled-components'
import { FarmWithStakedValue } from '../types'
import StakeAction from './StakeAction'
import { useWeb3React } from '@web3-react/core'
import PendingRewards from './PendingRewards'
import { useNftPoolAllowance } from 'views/xFarms/hooks/usetNftPoolAllowance'
// import { NitroPoolInfo } from '../NitroPoolInfo/NitroPoolInfo'
import { useHarvestPosition } from 'views/xFarms/hooks/useHarvestNftPoolPosition'
import { useCallback } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import useNftPools from 'views/xFarms/hooks/useNftPools'

interface ActionProps {
  table?: boolean;
}

const Action = styled.div<ActionProps>`
${({ table }) =>
    table
      ? css`
      margin-bottom: 12px;
    `
      : css`
      margin-bottom: 0px;
    `}
    padding-top: 16px;
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  addLiquidityUrl?: string
  lpLabel?: string
  table?: boolean
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, addLiquidityUrl, lpLabel, table }) => {
  const { account, chainId } = useWeb3React()
  const { t } = useTranslation()
  const { lpAddresses, nftPoolAddress } = farm

  const { getInitialPoolPosition } = useNftPools()
  const position = getInitialPoolPosition(nftPoolAddress[chainId])
  const { harvestPositionTo, harvestPosition } = useHarvestPosition(position?.nftPoolAddress)
  const { hasApproval, doApproval, pendingTx } = useNftPoolAllowance(nftPoolAddress[chainId], lpAddresses[chainId])

  // If position is deposited in a nitro pool then we need harvestPositionTo to get the harvest from nitro pool sent to owning user.
  // NFTPool contract will revert on harvestPositionTo if the owner of the position is not a contract.
  const harvestFunction = useCallback(async () => {
    return position?.hasNitroDeposit ? harvestPositionTo(position?.tokenIds[0]) : harvestPosition(position?.tokenIds[0])
  }, [position, harvestPositionTo, harvestPosition])

  const renderApprovalOrStakeButton = () => {
    return hasApproval ? (
      <StakeAction {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} sharePrice={farm.sharePrice} />
    ) : (
      <Button width="100%" marginTop="8px" disabled={pendingTx} onClick={doApproval}>
        {t('ENABLE Contract')}
      </Button>
    )
  }

  return (
    <Action table={table}>

      {/* <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
          BSX
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex> */}
      <Flex>
        <Text bold textTransform="uppercase" color="background" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="background" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? (
        // <ConnectWalletButton marginTop="8px" width="100%" /> this is fine
        <ConnectWalletButton variant="menuconnect" mt="8px" width="100%" />
      ) : (
        <>
          {renderApprovalOrStakeButton()}

          <Flex marginTop="0px">
            {position ? <PendingRewards position={position} harvestPosition={harvestFunction} table/> : <Skeleton />}
          </Flex>

          {/* {farm.nitroPoolAddress && <NitroPoolInfo position={position} />} */}
        </>
      )}
    </Action>
  )
}

export default CardActions
