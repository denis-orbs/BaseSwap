import { Button, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'

import styled from 'styled-components'
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

const Action = styled.div`
  padding-top: 16px;
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, addLiquidityUrl, lpLabel, displayApr }) => {
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
      <StakeAction
        {...farm}
        lpLabel={lpLabel}
        addLiquidityUrl={addLiquidityUrl}
        displayApr={displayApr}
        sharePrice={farm.sharePrice}
      />
    ) : (
      <Button
        // variant="arbblue"
        // height="30px"
        className="glow2small"
        // mt="8px"
        // width="100%"
        disabled={pendingTx}
        style={{ backgroundColor: 'transparent' }}
        onClick={doApproval}
      >
        {t('ENABLE Contract')}
      </Button>
    )
  }

  return (
    <Action>
      {/* <Flex mt="1rem">
        <Text bold textTransform="uppercase" color="white" fontSize="12px" pr="4px">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="white" fontSize="12px">
          {t('Staked')}
        </Text>
      </Flex> */}
      <Flex mt="1rem">
        <Text bold textTransform="uppercase" color="white">
          {farm.lpSymbol}
        </Text>
        <Text bold textTransform="uppercase" color="white">
          {t('Staked')}
        </Text>
      </Flex>
      {!account ? (
        // <ConnectWalletButton mt="8px" width="100%" />
        <ConnectWalletButton />
      ) : (
        <>
          {renderApprovalOrStakeButton()}

          <Flex mt="15px">
            {position ? <PendingRewards position={position} harvestPosition={harvestFunction} /> : <Skeleton />}
          </Flex>

          {/* {farm.nitroPoolAddress && <NitroPoolInfo position={position} />} */}
        </>
      )}
    </Action>
  )
}

export default CardActions
