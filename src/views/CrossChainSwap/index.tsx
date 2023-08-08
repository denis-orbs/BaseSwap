import Head from 'next/head'
import { Card, Flex, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import styled from "styled-components";
import PageTitle from 'components/PageTitle/PageTitle'
import Script from 'next/script'
import { FC } from 'react'
import Page from '../Page'

const StyledCard = styled(Card)`
width: 450px;
min-height: 690px;
${({ theme }) => theme.mediaQueries.md} {
  max-width: '100%';
}
`

const CrossChainSwap: FC = () => {

  const widgetConfig = {
    integratorId: "squid-swap-widget",
    companyName: "BaseSwap",
    style: {
      neutralContent: "#FFF",
      baseContent: "#FFF",
      base100: "#111",
      base200: "#333",
      base300: "#111",
      error: "#ED6A5E",
      warning: "#FFB155",
      success: "#004be4",
      primary: "#0154FE",
      secondary: "#1a65fe",
      secondaryContent: "#FFF",
      neutral: "#111",
      roundedBtn: "4px",
      roundedCornerBtn: "999px",
      roundedBox: "4px",
      roundedDropDown: "4px",
    },
    slippage: 1.5,
    infiniteApproval: false,
    enableExpress: true,
    apiUrl: "https://api.squidrouter.com",
    comingSoonChainIds: ["cosmoshub-4", "injective-1", "kichain-2"],
    titles: {
      swap: "Swap",
      settings: "Settings",
      wallets: "Wallets",
      tokens: "Select Token",
      chains: "Select Chain",
      history: "History",
      transaction: "Transaction",
      allTokens: "Select Token",
      destination: "Destination address",
    },
    priceImpactWarnings: {
      warning: 3,
      critical: 5,
    },
  };


  const widgetUrl = `https://widget.squidrouter.com/iframe?config=${encodeURIComponent(JSON.stringify(widgetConfig))}`;

  return (
    <>
      <Page>
        <PageTitle title="Cross Chain Swap" />
        <Flex
          width="95%"
          minWidth="95%"
          justifyContent="center"
          position="relative"
          marginLeft="auto"
          marginRight="auto"
          marginTop={20}
          marginBottom={60}
        >
          <StyledCard>
            {/* 
              // @ts-ignore  */}
            <iframe
              src={widgetUrl}
              title="Swap Widget"
              width="100%"
              height="690px" // Adjust the height as needed
              frameBorder="0"
              scrolling="no"
            />
          </StyledCard>
        </Flex>
      </Page>
    </>
  )
}

export default CrossChainSwap