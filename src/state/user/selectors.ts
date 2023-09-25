import { useSelector } from 'react-redux'
import { AppState } from 'state'

const selectUserClaimsData = ({ user: { claimsData } }: AppState) => {
  return (
    claimsData || {
      pendingMerklBSX: 0,
      pendingMerklXBSX: 0,
      pendingMerklValue: '$0',
      isLoading: true,
    }
  )
}

export function useUserClaimsDataSelector() {
  return useSelector(selectUserClaimsData)
}
