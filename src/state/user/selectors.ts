import { useSelector } from 'react-redux'
import { AppState } from 'state'

const selectUserClaimsData = ({ user: { claimsData } }: AppState) => claimsData

export function useUserClaimsDataSelector() {
  return useSelector(selectUserClaimsData)
}
