import Head from 'next/head'
import React, { useCallback, useEffect, useState } from 'react'
import dayjs from 'dayjs';
import styled from 'styled-components';
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Button, Card, Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useCurrencyBalance } from 'state/wallet/hooks'
import tryParseAmount from 'utils/tryParseAmount'
import Datetime from 'react-datetime'
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
`;

const CustomCard = styled(Card)`
  height: 100%;
  background-color: #1a202c;
  z-index: 4;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1rem;
`;

const LeftColumn = styled.div`
  grid-column: 1 / span 12;

  @media (min-width: 768px) {
    grid-column: 1 / span 8;
  }

  background-color: #2d3748;
  padding: 1.5rem;
  border-radius: 0.375rem;
`;

const RightColumn = styled.div`
  grid-column: 1 / span 12;

  @media (min-width: 768px) {
    grid-column: 9 / span 4;
  }

  background-color: #2d3748;
  padding: 1.5rem;
  border-radius: 0.375rem;
`;

const TextContainer = styled.div`
  display: flex;
  justify-content: center;

  @media (min-width: 768px) {
    justify-content: flex-end;
  }
`;

const SubText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #a0aec0;
`;

const TextInput = styled.input`
  padding: 1rem;
  width: 100%;
  overflow: ellipsis;
  font-weight: bold;
  background-color: #2d3748;
  border-radius: 0.375rem;
  color: #e2e8f0;
  ::placeholder {
    color: #a0aec0;
  }
`;

const Locker: FC = () => {

  const { account, chainId, library } = useActiveWeb3React()
  const [tokenAddress, setTokenAddress] = useState('')
  const [withdrawer, setWithdrawer] = useState('')
  const [value, setValue] = useState('')
  // const [unlockDate, setUnlockDate] = useState(dayjs())
  const [unlockDate, setUnlockDate] = useState(dayjs().add(1, 'day'))
  const [pendingTx, setPendingTx] = useState(false)

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
        ).send(
          {
            value: "1000000000000000000", // Convert paymentAmount to string in base 10
            from: account, // Replace with the sender's address
          }
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
          throw 'User denied transaction signature.'
        }
      } catch (err) {
        console.log('err', err)
        // return toastSuccess(`Locker Failed:`, err)
        // addPopup({
        //   txn: { hash: undefined, summary: `Locker Failed: ${err}`, success: false },
        // })
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
          <CustomCard>
            <GridContainer>
              <LeftColumn>
                <Flex flexDirection="row">
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
                <Flex flexDirection="row">
                  <TextContainer>
                    <SubText>Amount</SubText>
                  </TextContainer>
                  <NumericalInput
                    className={'p-3 text-base bg-transparent'}
                    id="token-amount-input"
                    value={value}
                    onUserInput={(val) => {
                      setValue(val)
                    }}
                  />
                </Flex>
                {assetToken && selectedCurrencyBalance ? (
                  <div className="flex flex-col">
                    <div
                      onClick={() => setValue(selectedCurrencyBalance.toFixed())}
                      className="text-xxs font-medium text-right cursor-pointer text-low-emphesis"
                    >
                      Balance: {formatNumberScale(selectedCurrencyBalance.toSignificant(4))}{' '}
                    </div>
                  </div>
                ) : null}

                <TextContainer>
                  <SubText>Withdrawer</SubText>
                </TextContainer>
                <input
                  className="p-3 w-full flex overflow-ellipsis font-bold recipient-address-input bg-dark-900 h-full w-full rounded placeholder-low-emphesis"
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
                    className="text-xxs font-medium bg-transparent border rounded-full hover:bg-primary border-low-emphesis text-secondary whitespace-nowrap"
                  >
                    Me
                  </Button>
                )}
                {/* Add your withdrawer input and Button component here */}
                <TextContainer>
                  <SubText>Unlock Date</SubText>
                </TextContainer>
                {/* Add your Datetime input component here */}
                <>
                  {/* <Datetime
                                value={unlockDate}
                                utc={true}
                                closeOnSelect={true}
                                isValidDate={valid}
                                onChange={(e) => setUnlockDate(dayjs())}
                                inputProps={{
                                  className:
                                    'p-3 w-full flex overflow-ellipsis font-bold recipient-address-input bg-dark-900 h-full w-full rounded placeholder-low-emphesis',
                                }}
                              /> */}
                </>
                <TextContainer>
                  {/* Add your submission buttons here */}
                  {!account ? (
                              <div>Connect...</div>
                              // <Web3Connect size="lg" color="gradient" className="w-full" />
                            ) : !allInfoSubmitted ? (
                              <Button className="font-bold" style={{ width: '100%' }} disabled={!allInfoSubmitted}>
                                {errorMessage}
                              </Button>
                            ) : (
                              <>
                                {approvalState !== ApprovalState.APPROVED && (
                                  <Button
                                    onClick={handleApprove}
                                    disabled={
                                      approvalState !== ApprovalState.NOT_APPROVED ||
                                      approvalSubmitted ||
                                      !allInfoSubmitted
                                    }
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
                              </>
                            )}
                </TextContainer>
              </LeftColumn>
              <RightColumn>
                <div>
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
                  <p>Pay 0.1 FTM to lock.</p>
                  <TextContainer>
                    <SubText>Considerations</SubText>
                  </TextContainer>
                  <p>You will not be able to withdraw your tokens before the unlock time.</p>
                  <p>Locker contract address: Your Locker Address.</p>
                  <p>Always DYOR.</p>
                </div>
              </RightColumn>
            </GridContainer>
          </CustomCard>
        </Wrapper>
      </Page>
    </>
  )
}

export default Locker
