import { useState } from 'react'

const MERKLE_BASE_URL = 'https://api.angle.money/v1/merkl'

// TODO: Creating distributions
// TODO: Get user claimable rewards
//

export default function useMerklRewards() {
  const [pools, setPools] = useState<any[]>([])

  return {
    pools,
  }
}
