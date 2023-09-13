import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import PositionListItem from 'components/PositionListItem'
import Trans from 'components/Trans'
import React from 'react'
import styled from 'styled-components'
import { PositionDetails } from 'types/position'

const MobileHeader = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid ${({ theme }) => theme.colors.background};
`

const ToggleWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ToggleLabel = styled.button`
  cursor: pointer;
  background-color: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1rem;
`

type PositionListProps = React.PropsWithChildren<{
  positions: PositionDetails[]
  setUserHideClosedPositions: any
  userHideClosedPositions: boolean
}>

export default function PositionList({
  positions,
  setUserHideClosedPositions,
  userHideClosedPositions,
}: PositionListProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* <DesktopHeader>
        <Text>{t(`YOUR POSITIONS  ${positions && positions.length}`)}</Text>

        <ToggleLabel
          id="desktop-hide-closed-positions"
          onClick={() => {
            setUserHideClosedPositions(!userHideClosedPositions)
          }}
        >
          {userHideClosedPositions ? 
          <Text color="text" textTransform="uppercase" fontSize="13px">
              Show closed positions
          </Text> 
          : 
          <Text color="text" textTransform="uppercase" fontSize="13px">
            Hide closed positions
            </Text>}
        </ToggleLabel>
      </DesktopHeader> */}
      <MobileHeader>
        <Text>{t(`ACTIVE POSITIONS: ${positions && positions.length}`)}</Text>
        <ToggleWrap>
          <ToggleLabel
            onClick={() => {
              setUserHideClosedPositions(!userHideClosedPositions)
            }}
          >
            {userHideClosedPositions ? 

            <Text color="text" textTransform="uppercase" fontSize="13px">
              Show closed positions</Text> 
              : 
              <Text color="text" textTransform="uppercase" fontSize="13px">
              Hide closed positions
            </Text>}
          </ToggleLabel>
        </ToggleWrap>
      </MobileHeader>
      {positions.map((p) => (
        <PositionListItem key={p.tokenId.toString()} {...p} />
      ))}
    </>
  )
}
