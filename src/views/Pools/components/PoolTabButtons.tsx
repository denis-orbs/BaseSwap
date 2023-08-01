import { NextLinkFromReactRouter } from 'components/NextLink'
import ToggleView from 'components/ToggleView/ToggleView'
import { useRouter } from 'next/router'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, Toggle, Text, NotificationDot } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 16px;
  }
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools, viewMode, setViewMode }) => {
  const router = useRouter()

  const { t } = useTranslation()

  const isExact = router.asPath === '/pools' || router.asPath === '/_mp/pools'

  const viewModeToggle = <ToggleView idPrefix="clickPool" viewMode={viewMode} onToggle={setViewMode} />

  const liveOrFinishedSwitch = (
    <Wrapper>
      <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant="subtle">
        <ButtonMenuItem as={NextLinkFromReactRouter} to="/pools" replace>
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedPools}>
          <ButtonMenuItem id="finished-pools-button" as={NextLinkFromReactRouter} to="/pools/history" replace>
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle checked={stakedOnly} onChange={() => setStakedOnly(!stakedOnly)} scale="sm" />
      <Text> {t('Staked only')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
        CHOOSE YOUR &nbsp;
        <span style={{ textDecoration: 'line-through' }}>FIGHTER</span>
        &nbsp;VIEW MODE:
      </Text>
      <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
      {/* {viewModeToggle} */}
      {/* {stakedOnlySwitch} */}
      {/* {liveOrFinishedSwitch} */}
    </ViewControls>
  )
}

export default PoolTabButtons
