import { useTranslation } from '@pancakeswap/localization'
import { Text } from '@pancakeswap/uikit'
import PositionListItem from 'components/PositionListItem'
import React from 'react'
import styled from 'styled-components'
import { PositionDetails } from 'types/position'

// const DesktopHeader = styled.div`
//   display: none;
//   font-size: 14px;
//   font-weight: 500;
//   padding: 16px;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundAlt};

//   @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
//     align-items: center;
//     display: flex;
//     justify-content: space-between;
//     & > div:last-child {
//       text-align: right;
//       margin-right: 12px;
//     }
//   }
// `

const DesktopHeader = styled.div`
  display: none;
  font-size: 14px;
  font-weight: 500;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundAlt};
`

// const MobileHeader = styled.div`
//   font-weight: medium;
//   padding: 8px;
//   font-weight: 500;
//   padding: 16px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 16px;
//   border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundAlt};

//   @media screen and (min-width: ${MEDIA_WIDTHS.deprecated_upToSmall}px) {
//     display: none;
//   }

//   @media screen and (max-width: ${MEDIA_WIDTHS.deprecated_upToExtraSmall}px) {
//     display: flex;
//     flex-direction: row;
//     justify-content: space-between;
//   }
// `

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
  return (
    <>
      <DesktopHeader>
        <div>
          Your positions
          {positions && ` (${positions.length}) `}
        </div>

        <ToggleLabel
          id="desktop-hide-closed-positions"
          onClick={() => {
            setUserHideClosedPositions(!userHideClosedPositions)
          }}
        >
          {userHideClosedPositions ? <Text>Show closed positions</Text> : <Text>Hide closed positions</Text>}
        </ToggleLabel>
      </DesktopHeader>
      {/* <MobileHeader>
        <Trans>Your positions</Trans>
        <ToggleWrap>
          <ToggleLabel
            onClick={() => {
              setUserHideClosedPositions(!userHideClosedPositions)
            }}
          >
            {userHideClosedPositions ? <Trans>Show closed positions</Trans> : <Trans>Hide closed positions</Trans>}
          </ToggleLabel>
        </ToggleWrap>
      </MobileHeader> */}
      {positions.map((p) => (
        <PositionListItem key={p.tokenId.toString()} {...p} />
      ))}
    </>
  )
}
