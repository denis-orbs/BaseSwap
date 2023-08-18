import { MenuItemsType, SwapIcon, SwapFillIcon, EarnFillIcon, EarnIcon, FarmIcon, CurrencyIcon, TradeFilledIcon, AddIcon, EllipsisIcon } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit/src/components/DropdownMenu/types'
import { DEFAULT_CHAIN_ID } from 'utils/providers'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean } & {
  items?: ConfigMenuDropDownItemsType[]
}

const filterItemBySupportChainId = (item, chainId) => {
  return !chainId || !item.supportChainIds ? true : item.supportChainIds?.includes(chainId)
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Swap'),
      href: '/swap',
      showItemsOnMobile: false,
      fillIcon: SwapFillIcon, 
      icon: SwapFillIcon,
      items: [].filter((item) => filterItemBySupportChainId(item, chainId)),
    }, 
    {
      label: t('Liquidity'),
      href: '/liquidity',
      showItemsOnMobile: false,
      icon: AddIcon,
      fillIcon: AddIcon, 
      items: [].filter((item) => filterItemBySupportChainId(item, chainId)),
    }, 

    {
      label: t('Farm'),
      href: '',
      icon: EarnIcon,
      fillIcon: EarnIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('Live Farms!'),
          href: '/farm',
        },
        {
          label: t('Finished Farms'),
          href: '/finishedfarms',
        },
      ],
    },
    {
      label: t('Earn'),
      href: '/pools',
      showItemsOnMobile: false,
      icon: CurrencyIcon,
      fillIcon: CurrencyIcon, 
      items: [].filter((item) => filterItemBySupportChainId(item, chainId)),
    }, 
    {
      label: t('More'),
      href: '',
      icon: EllipsisIcon,
      fillIcon: EllipsisIcon,
      supportChainIds: [DEFAULT_CHAIN_ID],
      items: [
        {
          label: t('BSX Presale!'),
          href: 'https://presale.baseswap.fi',
        },
        {
          label: t('Bridge'),
          href: '/bridge',
        },
        {
          label: t('NFT'),
          href: 'https://marketplace.baseswap.fi',
        },
      ],
    },
    // {
    //   label: t('Swap'),
    //   icon: SwapIcon,
    //   fillIcon: SwapFillIcon,
    //   href: '/swap',
    //   showItemsOnMobile: false,
    //   items: [
    //     {
    //       label: t('Swap'),
    //       href: '/swap',
    //     },
    //     {
    //       label: t('Liquidity'),
    //       href: '/liquidity',
    //     },
        // {
        //   label: t('Perpetual'),
        //   href: `https://perp.pancakeswap.finance/${perpLangMap(languageCode)}/futures/BTCUSDT?theme=${perpTheme(
        //     isDark,
        //   )}`,
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
        // {
        //   label: t('Transfer'),
        //   href: '/transfer',
        // },
  //     ].filter((item) => filterItemBySupportChainId(item, chainId)),
  //   },

  ].filter((item) => filterItemBySupportChainId(item, chainId))

export default config
