import { MenuEntry } from 'penguinfinance-uikit2'

export const config: MenuEntry[] = [
  {
    label: 'Home',
    icon: 'HomeIcon',
    href: '/',
  },
  {
    label: 'Buy $PEFI',
    icon: 'TradeIcon',
    href: 'https://app.pangolin.exchange/#/swap?outputCurrency=0xe896CDeaAC9615145c0cA09C8Cd5C25bced6384c',
  },
  {
    label: 'Igloos',
    icon: 'IglooIcon',
    href: '/igloos',
  },
  {
    label: 'Compounder',
    icon: 'CompounderIcon',
    href: '/compounder',
  },
  {
    label: 'Nests',
    icon: 'NestIcon',
    href: '/nests',
  },
  {
    label: 'Emperor',
    icon: 'CrownIcon',
    href: '/emperor',
  },
  {
    label: 'Arena',
    icon: 'BattleIcon',
    href: '/arena',
  },
  {
    label: 'Launchpad',
    icon: 'LaunchpadIcon',
    href: '/launchpad',
  },
  {
    label: 'Club Penguin',
    icon: 'BattleIcon',
    href: '/club',
  },
  // {
  //   label: 'Penguin lottery',
  //   icon: 'NftIcon',
  //   href: '/lottery',
  // },
  {
    label: 'Collectibles',
    icon: 'NftIcon',
    href: '/collectibles',
  },
  // {
  //   label: 'Penguin teams',
  //   icon: 'NftIcon',
  //   href: '/teams',
  // },
  {
    label: 'Learn More',
    icon: 'MoreIcon',
    items: [
      {
        label: 'Github',
        href: 'https://github.com/Penguin-Finance',
      },
      {
        label: 'Docs',
        href: 'https://www.penguinfinance.io/b',
      },
      {
        label: 'Medium Articles',
        href: 'https://penguin-finance.medium.com/',
      },
    ],
  },
  {
    label: 'Audited by CertiK',
    icon: 'AuditIcon',
    href: 'https://www.certik.org/projects/penguinfinance',
  },
]

export const socials = [
  {
    label: 'Discord',
    icon: 'DiscordIcon',
    href: 'https://discord.gg/R5Rv68GXXc',
  },
  {
    label: 'Telegram',
    icon: 'TelegramIcon',
    href: 'https://t.me/penguin_defi',
  },
  {
    label: 'Twitter',
    icon: 'TwitterIcon',
    href: 'https://twitter.com/penguin_defi',
  },
]
