import BigNumber from 'bignumber.js'
import { useCallback, useMemo, useState } from 'react'
import { Button, Modal, AutoRenewIcon } from '@pancakeswap/uikit'
import { ModalActions, ModalInput } from 'components/Modal'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

interface WithdrawModalProps {
  max: BigNumber
  onConfirm: (amount: string) => void
  onDismiss?: () => void
  tokenName?: string
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onConfirm, onDismiss, max, tokenName = '' }) => {
  const [val, setVal] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const valNumber = new BigNumber(val)
  const fullBalanceNumber = new BigNumber(fullBalance)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.validity.valid) {
        setVal(e.currentTarget.value.replace(/,/g, '.'))
      }
    },
    [setVal],
  )

  const handleSelectMax = useCallback(() => {
    setVal(fullBalance)
  }, [fullBalance, setVal])

  return (
    <Modal title={t('UNSTAKE LP TOKENS')} onDismiss={onDismiss}>
      <ModalInput
        onSelectMax={handleSelectMax}
        onChange={handleChange}
        value={val}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={t('Unstake')}
      />
      <ModalActions>
        <Button
          variant="secondary"
          className="glow2small
"
          onClick={onDismiss}
          // width="100%"
          disabled={pendingTx}
        >
          {t('Cancel')}
        </Button>
        {pendingTx ? (
          <Button
            // width="100%"
            className="glow2small
"
            variant="secondary"
            isLoading={pendingTx}
            endIcon={<AutoRenewIcon spin color="currentColor" />}
          >
            {t('Confirming')}
          </Button>
        ) : (
          <Button
            // width="100%"
            variant="secondary"
            className="glow2small"
            disabled={!valNumber.isFinite() || valNumber.eq(0) || valNumber.gt(fullBalanceNumber)}
            onClick={async () => {
              setPendingTx(true)
              await onConfirm(val)
              onDismiss?.()
              setPendingTx(false)
            }}
          >
            {t('confirm')}
          </Button>
        )}
      </ModalActions>
    </Modal>
  )
}

export default WithdrawModal
