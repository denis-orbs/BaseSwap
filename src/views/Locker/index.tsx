import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import styled from 'styled-components';
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Card, Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useCurrencyBalance } from 'state/wallet/hooks'
import tryParseAmount from 'utils/tryParseAmount'
import { formatNumberScale } from 'utils/formatBalance'
import PageTitle from 'components/PageTitle/PageTitle'
import Script from 'next/script'
import { FC } from 'react'
import { ethers } from 'ethers'
import Page from '../Page'
import { useTokenLocker } from 'hooks/useContract'
import NumericalInput from 'components/CurrencyInputPanel/NumericalInput'
import { LOCKER_ADDRESS } from 'config/constants/exchange';
import { useApproveCallback } from 'hooks/useApproveCallback';
import { useCurrency } from 'hooks/Tokens';
import { isAddress } from '@ethersproject/address';
// import { BigNumber } from '@ethersproject/bignumber'
import useToast from 'hooks/useToast';
import BigNumber from 'bignumber.js';
import { ToastDescriptionWithTx } from 'components/Toast';
import DateTimePicker from 'react-datetime-picker';
import { StyledCard } from '@pancakeswap/uikit/src/components/Card/StyledCard';



export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

const Wrapper = styled(Flex)`
  width: 95%;
  min-width: 95%;
  justify-content: center;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  margin-top: 20px;
  margin-bottom: 60px;
  overflow: visible;
`;

const StyledFlex = styled(Flex)`
  width: 95%;
  min-width: 95%;
  background: linear-gradient(to bottom, #333333, #000000);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin-top: 48px;
  margin-left: 12px;
  margin-right: 12px;
`;

const CardInner = styled.div`
  flex-direction: column;
  justify-content: space-around;
  padding: 24px;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const SubText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #a0aec0;
`;

const TextInput = styled.input`
  border-radius: 2px;
  border: 3px solid #fff;
  width: 100%;
  min-height: 60px;
  background: linear-gradient(to bottom,#000 20%,#111);
  color: #FFF;
  padding-left: 12px;
  font-weight: 500;
  font-size: 24px;
  text-align: right;
  padding-right: 12px;
`;

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];


const Locker: FC = () => {

  const { account, chainId, library } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState('')
  const [withdrawer, setWithdrawer] = useState('')
  const [value, setValue] = useState('')
  // const [unlockDate, setUnlockDate] = useState(dayjs())
  const [unlockDate, setUnlockDate] = useState(dayjs().add(1, 'day'))

  const handleChangeDate = (date: Date) => {
    setUnlockDate(dayjs(date))
  }


  // const [unlockDate, setUnlockDate] = useState(new Date(new Date().getTime() + 24 * 60 * 60 * 1000))
  const [pendingTx, setPendingTx] = useState(false)

  const [dateValue, setDateValue] = useState<Value>(new Date());



  const assetToken = useCurrency(tokenAddress) || undefined
  const payingToken = useCurrency('0x0B794759D6ECD09750EDB6E7bf67e80C3fCc3A2d') || undefined
  const typedDepositValue = tryParseAmount(value, assetToken)
  const typedPayingValue = tryParseAmount(value, payingToken)
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, assetToken ?? undefined)

  const [approvalState, approve] = useApproveCallback(typedDepositValue, LOCKER_ADDRESS[chainId])
  // BOOTY TOKEN ADDRESS
  const [approvalStatePayingValue, approvePayingValue] = useApproveCallback(typedPayingValue, LOCKER_ADDRESS[chainId])

  const lockerContract = useTokenLocker()

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  const { toastSuccess, toastError } = useToast()

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  console.log('unlock date', unlockDate, dayjs(unlockDate).isValid(), dayjs(unlockDate).isBefore(dayjs()))

  const errorMessage = !isAddress(tokenAddress)
    ? 'Invalid token'
    : !isAddress(withdrawer)
      ? 'Invalid withdrawer'
      : isNaN(parseFloat(value)) || parseFloat(value) == 0
        ? 'Invalid amount'
        : (!dayjs(unlockDate).isValid() || dayjs(unlockDate).isBefore(dayjs()))
          ? 'Invalid unlock date'
          : ''

  const allInfoSubmitted = errorMessage == ''

  const handleApprove = useCallback(async () => {
    await approve()
  }, [approve])
  const handleApprovePayingValue = useCallback(async () => {
    await approvePayingValue()
  }, [approvePayingValue])

  const handleLock = useCallback(async () => {
    if (allInfoSubmitted) {
      setPendingTx(true)
      const bigNumberValue = new BigNumber(value).times(new BigNumber(10).pow(assetToken?.decimals));

      try {
        // const tx = await lockerContract.lockTokens(
        const tx = await lockerContract.lockTokensByBooty(
          tokenAddress,
          withdrawer,
          // new BigNumber(value, assetToken?.decimals.toString()),
          bigNumberValue.toString(),
          // .toBigNumber(assetToken?.decimals),
          dayjs(unlockDate).unix().toString(),
        )

        if (tx.wait) {
          const result = await tx.wait()

          const [_withdrawer, _amount, _id] = ethers.utils.defaultAbiCoder.decode(
            ['address', 'uint256', 'uint256'],
            result.events[2].data
          )

          // addPopup({
          //   txn: { hash: result.transactionHash, summary: `Created Lock [ID: ${_id}]`, success: true },
          // })

          setTokenAddress('')
          setWithdrawer('')
          setValue('')
          setUnlockDate(dayjs());
          toastSuccess(
            `Created Lock [ID: ${_id}]`,
            <ToastDescriptionWithTx txHash={result.transactionHash}>
              Your funds have been locked
            </ToastDescriptionWithTx>,
          )
        } else {
          toastError(
            `Error:`,
            `User denied transaction signature.`
          )
          // throw 'User denied transaction signature.'
        }
      } catch (err) {
        // console.log('err', err)
        // return toastSuccess(`Locker Failed:`, err)
        // addPopup({
        //   txn: { hash: undefined, summary: `Locker Failed: ${err}`, success: false },
        // })
        toastError(
          `Error:`,
          `${ err }`
        )
      } finally {
        setPendingTx(false)
      }
    }
  }, [allInfoSubmitted, assetToken, tokenAddress, withdrawer, value, unlockDate, lockerContract])

  var valid = function (current) {
    return current.isAfter(dayjs(unlockDate).subtract(1, 'day'))
  }

  return (
    <>
      <Page>
        <PageTitle title="Token Locker" />
        <Wrapper>
          <StyledCard className="animate__animated animate__fadeInLeft animate__fast">
            <CardInner>
              <Flex flexDirection="column" mt="12px">
                <TextContainer>
                  <SubText>Token Address</SubText>
                </TextContainer>
                <TextInput
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  pattern="^(0x[a-fA-F0-9]{40})$"
                  onChange={(e) => setTokenAddress(e.target.value)}
                  value={tokenAddress}
                />
              </Flex>
              <Flex flexDirection="column" mt="12px">
                <TextContainer>
                  <SubText>Amount</SubText>
                </TextContainer>
                <NumericalInput
                  style={{
                    minWidth: '100%',
                    borderRadius: '2px',
                    border: '3px solid #fff',
                    width: '100%',
                    minHeight: '60px',
                    background: 'linear-gradient(to bottom,#000 20%,#111)',
                    color: '#FFF',
                    paddingLeft: '12px',
                    fontSize: '24px',
                    paddingRight: '12px'
                  }}
                  id="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    setValue(val)
                  }}
                />
              </Flex>
              {assetToken && selectedCurrencyBalance ? (
                <Flex flexDirection="column" alignItems="flex-end" justifyContent="flex-end" mt="12px">
                  <div
                    onClick={() => setValue(selectedCurrencyBalance.toFixed())}
                    className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                  >
                    Balance: {formatNumberScale(selectedCurrencyBalance.toSignificant(4))}{' '}
                  </div>
                </Flex>
              ) : null}

              <TextContainer>
                <SubText>Withdrawer</SubText>
              </TextContainer>
              <Flex alignItems="center" marginBottom="12px">
                <TextInput
                  type="text"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  pattern="^(0x[a-fA-F0-9]{40})$"
                  onChange={(e) => setWithdrawer(e.target.value)}
                  value={withdrawer}
                />
                {account && (
                  <Button
                    onClick={() => setWithdrawer(account)}
                    size="xs"
                    marginRight={12}
                    marginLeft={12}
                  >
                    Me
                  </Button>
                )}
              </Flex>
              <TextContainer>
                <SubText>Unlock Date</SubText>
              </TextContainer>
              <DateTimePicker onChange={(date) => handleChangeDate(date)} value={unlockDate.toDate()} />
              <TextContainer>
                {!account ? (
                  <div>Connect...</div>
                  // <Web3Connect size="lg" color="gradient" className="w-full" />
                ) : !allInfoSubmitted ? (
                  <Button className="font-bold" style={{ width: '100%' }} disabled={!allInfoSubmitted}>
                    {errorMessage}
                  </Button>
                ) : (
                  <Flex flexDirection="column" alignItems="center" justifyContent="center">
                    {approvalState !== ApprovalState.APPROVED && (
                      <Button
                        onClick={handleApprove}
                        disabled={
                          approvalState !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted ||
                          !allInfoSubmitted
                        }
                        style={{
                          width: '100%',
                        }}
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <div className={'p-2'}>
                            Approving...
                          </div>
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    )}
                    {approvalStatePayingValue !== ApprovalState.APPROVED && (
                      <Button
                        onClick={handleApprovePayingValue}
                        disabled={
                          approvalStatePayingValue !== ApprovalState.NOT_APPROVED ||
                          approvalSubmitted ||
                          !allInfoSubmitted
                        }
                        style={{
                          width: '100%',
                        }}
                      >
                        {approvalState === ApprovalState.PENDING ? (
                          <div className={'p-2'}>
                            Approving...
                          </div>
                        ) : (
                          "Approve"
                        )}
                      </Button>
                    )}
                    {approvalState === ApprovalState.APPROVED && (
                      <Button
                        className="font-bold text-light"
                        onClick={handleLock}
                        style={{
                          width: '100%',
                        }}
                        disabled={approvalState !== ApprovalState.APPROVED || !allInfoSubmitted || pendingTx}
                      >
                        {pendingTx ? (
                          <div className={'p-2'}>
                            Locking
                          </div>
                        ) : (
                          'Lock'
                        )}
                      </Button>
                    )}
                  </Flex>
                )}
              </TextContainer>

              <StyledFlex flexDirection="column" justifyContent="flex-start">
                <TextContainer>
                  <SubText>How to use</SubText>
                </TextContainer>
                <p>
                  Input your token or liquidity pair address, amount of tokens to lock,
                  withdrawer address and when tokens will become unlocked.
                </p>
                <p>Click on "Approve" to allow the contract to transfer your tokens.</p>
                <p>Click on "Deposit" to lock your tokens into the locker contract.</p>
                <TextContainer>
                  <SubText>Fees</SubText>
                </TextContainer>
                <p>Pay 1 BSX to lock.</p>
                <TextContainer>
                  <SubText>Considerations</SubText>
                </TextContainer>
                <p>You will not be able to withdraw your tokens before the unlock time.</p>
                <p>Locker contract address: 0x746408887b35fbdb0587c270e5518005b8677cd3</p>
                <p>Always DYOR.</p>
              </StyledFlex>

            </CardInner>
          </StyledCard>
        </Wrapper>
      </Page>
    </>
  )
}

export default Locker
