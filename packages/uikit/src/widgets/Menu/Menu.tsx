import throttle from "lodash/throttle";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button } from "../../components/Button";
import BottomNav from "../../components/BottomNav";
import { Box } from "../../components/Box";
import Flex from "../../components/Box/Flex";
import Footer from "../../components/Footer";
import MenuItems from "../../components/MenuItems/MenuItems";
import { SubMenuItems } from "../../components/SubMenuItems";
import { useMatchBreakpoints } from "../../hooks";
import CakePrice from "../../components/CakePrice/CakePrice";
import Logo from "./components/Logo";
import UserMenu from "./components/UserMenu";
import { MENU_HEIGHT, MOBILE_MENU_HEIGHT, TOP_BANNER_HEIGHT, TOP_BANNER_HEIGHT_MOBILE } from "./config";
import { NavProps } from "./types";
import LangSelector from "../../components/LangSelector/LangSelector";
import { MenuContext } from "./context";
import { Text } from "../../components/Text";
import { Link } from "../../components/Link";
import TypeIt from 'typeit-react'
import { Image } from "../../components/Image";


const WelcomeTypeIt = styled(TypeIt)`
  font-weight: 400;
  color: #fff;
  text-align: left;
  letter-spacing: 0px;
  margin-bottom: 12px;
  font-size: 18px;
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const MenuImage = styled(Image)`
  box-shadow: 0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF;
  border-radius: 50%;
  
`;

const DropdownMenu = styled.div`
  display: none;
  position: absolute;
  background-color: #000;
  border-radius: 4px;
  min-width: 250px;
  box-shadow: 2px 0px 4px #fff, 0px 2px 4px #0154fe, 0px 2px 16px #0154fe;
  padding: 24px 12px;
  z-index: 1;
  flex-direction: column;
  justify-content: space-between;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${DropdownMenu} {
    display: block;
  }
`;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 65px;
  background: ${({ theme }) => theme.colors.gradients.pagebg};
  border-bottom: 4px solid ${({ theme }) => theme.colors.cardBorder};
  transform: translate3d(0, 0, 0);
  padding-left: 16px;
  padding-right: 16px;
`;

const FixedContainer = styled.div<{ showMenu: boolean; height: number }>`
  position: fixed;
  top: ${({ showMenu, height }) => (showMenu ? 0 : `-${height}px`)};
  left: 0;
  transition: top 0.2s;
  height: 65px;
  width: 100%;
  z-index: 20;
`;

const TopBannerContainer = styled.div<{ height: number }>`
  height: ${({ height }) => `${height}px`};
  min-height: ${({ height }) => `${height}px`};
  max-height: ${({ height }) => `${height}px`};
  width: 100%;
`;

const BodyWrapper = styled(Box)`
  position: relative;
  display: flex;
`;

const Inner = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  flex-grow: 1;
  transition: margin-top 0.2s, margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translate3d(0, 0, 0);
  max-width: 100%;
`;

const Menu: React.FC<NavProps> = ({
  linkComponent = "a",
  banner,
  rightSide,
  isDark,
  toggleTheme,
  currentLang,
  setLang,
  cakePriceUsd,
  links,
  subLinks,
  footerLinks,
  activeItem,
  activeSubItem,
  langs,
  buyCakeLabel,
  children,
}) => {
  const { isMobile, isMd } = useMatchBreakpoints();
  const [showMenu, setShowMenu] = useState(true);
  const refPrevOffset = useRef(typeof window === "undefined" ? 0 : window.pageYOffset);

  const topBannerHeight = isMobile ? TOP_BANNER_HEIGHT_MOBILE : TOP_BANNER_HEIGHT;

  const totalTopMenuHeight = banner ? MENU_HEIGHT + topBannerHeight : MENU_HEIGHT;

  useEffect(() => {
    const handleScroll = () => {
      const currentOffset = window.pageYOffset;
      const isBottomOfPage = window.document.body.clientHeight === currentOffset + window.innerHeight;
      const isTopOfPage = currentOffset === 0;
      // Always show the menu when user reach the top
      if (isTopOfPage) {
        setShowMenu(true);
      }
      // Avoid triggering anything at the bottom because of layout shift
      else if (!isBottomOfPage) {
        if (currentOffset < refPrevOffset.current || currentOffset <= totalTopMenuHeight) {
          // Has scroll up
          setShowMenu(true);
        } else {
          // Has scroll down
          setShowMenu(false);
        }
      }
      refPrevOffset.current = currentOffset;
    };
    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener("scroll", throttledHandleScroll);
    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [totalTopMenuHeight]);

  // Find the home link if provided
  const homeLink = links.find((link) => link.label === "Home");
  const subLinksWithoutMobile = subLinks?.filter((subLink) => !subLink.isMobileOnly);
  const subLinksMobileOnly = subLinks?.filter((subLink) => subLink.isMobileOnly);

  return (
    <MenuContext.Provider value={{ linkComponent }}>
      <Wrapper>
        <FixedContainer showMenu={showMenu} height={totalTopMenuHeight}>
          {banner && <TopBannerContainer height={topBannerHeight}>{banner}</TopBannerContainer>}
          <StyledNav>

          <a href="/" style={{ marginLeft: '1rem' }}>
          <Flex alignItems="center" justifyContent="flex-start" flexDirection="row" >
              <img style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF',  borderRadius: '50%' }} 
              width={isMobile ? 0 : 40} height={isMobile ? 0 : 40}
              src="/images/newlogo.png"   alt="logo" />
   
                <Text marginLeft={['0rem', null, null, '0.5rem' ]} 
                marginRight={['0rem', null, null, '0.7rem' ]} 
                fontSize="2rem" >
                  BaseSwap
                </Text>
              <img style={{ boxShadow: '0 8px 8px #fff, 12px 0px 12px #0154FD, -12px 0px 12px #68B9FF',  borderRadius: '50%' }} 
              src="/images/tokens/0xd5046B976188EB40f6DE40fB527F89c05b323385.png" 
              width={isMobile ? 0 : 40} height={isMobile ? 0 : 40} alt="logo" />

            </Flex>

            </a>
            {!isMobile && (
              <Flex
                flexDirection="row"
                justifyContent="flex-start"
                alignItems="flex-end"
                marginLeft={isMobile ? "2rem" : "250px"}
                width="80%"
              >
                <Link href="/swap">
                  <Text marginRight="2rem">Swap</Text>
                </Link>
                <Link href="/liquidity">
                  <Text marginRight="2rem">Liquidity</Text>
                </Link>

                <DropdownContainer>
                  <Link href="/farm">
                    <Text marginRight="2rem">FARMS</Text>
                  </Link>
                  <DropdownMenu>
                    <Link href="/farm" marginBottom="1.2rem">
                      <Text>Live Farms!</Text>
                    </Link>
                    <Link href="/finishedfarms">
                      <Text color="#ccc">Finished Farms</Text>
                    </Link>
                  </DropdownMenu>
                </DropdownContainer>

                <Link href="/pools">
                  <Text marginRight="2rem">Earn </Text>
                </Link>
               

                <DropdownContainer>

                    <Text marginRight="2rem">MORE...</Text>
                        <DropdownMenu>
                        <Link href="/new" marginBottom="1.2rem" >
                                <Text marginRight="2rem">New here?</Text>
                            </Link>
                            <Link href="/xbsx" marginBottom="1.2rem" >
                                <Text marginRight="2rem">xBSX</Text>
                            </Link>
                            {/* <Link href="https://presale.baseswap.fi" marginBottom="1.2rem" >
                                <Text marginRight="2rem">BSX PRESALE!</Text>
                            </Link> */}
                           
                            <Link href="/bridge" marginBottom="1.2rem" >
                              <Text marginRight="2rem">Bridge </Text>
                            </Link>
                            <Link href="/locker" marginBottom="1.2rem" >
                              <Text marginRight="2rem">Token Locker </Text>
                            </Link>
                            <Link href="https://marketplace.baseswap.fi" >
                              <Text marginRight="2rem">NFT</Text>
                            </Link>
                           
                        </DropdownMenu>

                </DropdownContainer>
              </Flex>
            )}
            {/* <Logo isDark={isDark} href={homeLink?.href ?? "/"} /> */}
            {/* {!isMobile && <MenuItems items={links} activeItem={activeItem} activeSubItem={activeSubItem} ml="24px" />} */}

            <Flex alignItems="center" justifyContent="flex-end" height="100%" width="300px">
              {/* test {!isMobile && !isMd && (
                <Box mr="12px">
                  <CakePrice showSkeleton={false} cakePriceUsd={cakePriceUsd} />
                </Box>
              )} */}
              {/* <Box mt="4px">
                <LangSelector
                  currentLang={currentLang}
                  langs={langs}
                  setLang={setLang}
                  buttonScale="xs"
                  color="textSubtle"
                  hideLanguage
                />
              </Box> */}
              {rightSide}
            </Flex>
          </StyledNav>
        </FixedContainer>
        {subLinks && (
          <Flex justifyContent="space-around" mt={`${totalTopMenuHeight + 1}px`}>
            {/* <SubMenuItems items={subLinksWithoutMobile} mt={`${totalTopMenuHeight + 1}px`} activeItem={activeSubItem} />

            {subLinksMobileOnly?.length > 0 && (
              <SubMenuItems
                items={subLinksMobileOnly}
                mt={`${totalTopMenuHeight + 1}px`}
                activeItem={activeSubItem}
                isMobileOnly
              />
            )} */}
          </Flex>
        )}
        <BodyWrapper mt={!subLinks ? `${totalTopMenuHeight + 1}px` : "0"}>
          <Inner isPushed={false} showMenu={showMenu}>
            {children}
            {/* <Footer
              items={footerLinks}
              isDark={isDark}
              toggleTheme={toggleTheme}
              langs={langs}
              setLang={setLang}
              currentLang={currentLang}
              cakePriceUsd={cakePriceUsd}
              buyCakeLabel={buyCakeLabel}
              mb={[`${MOBILE_MENU_HEIGHT}px`, null, "0px"]}
            /> */}
          </Inner>
        </BodyWrapper>
        {isMobile && <BottomNav items={links} activeItem={activeItem} activeSubItem={activeSubItem} />}
      </Wrapper>
    </MenuContext.Provider>
  );
};

export default Menu;
