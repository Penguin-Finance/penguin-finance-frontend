import { Toast } from 'penguinfinance-uikit2'
import BigNumber from 'bignumber.js'
import { CampaignType, LPConfig, FarmConfig, Nft, PoolConfig, Team } from 'config/constants/types'

export type TranslatableText =
  | string
  | {
      id: number
      fallback: string
      data?: {
        [key: string]: string | number
      }
    }

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  strategyRatio?: number
  poolWeight?: BigNumber
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    stakedReceiptBalance?: BigNumber
    earnings: BigNumber
    pendingXPefi: BigNumber
  }
}

export interface Lp extends LPConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  userData?: {
    allowance?: BigNumber
    tokenBalance?: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  totalSupply?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface Profile {
  userId: number
  points: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft?: Nft
  team: Team
  hasRegistered: boolean
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface FarmsState {
  pefiPerBlock: number
  data: Farm[]
}

export interface CompounderFarmsState {
  pefiPerBlock: number
  gondolaPerSec: number
  lydPerSec: number
  data: Farm[]
}

export interface LpsState {
  data: Lp[]
}

export interface PoolsState {
  data: Pool[]
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  hasRegistered: boolean
  data: Profile
}

export type TeamResponse = {
  0: string
  1: string
  2: string
  3: string
  4: boolean
}

export type TeamsById = {
  [key: string]: Team
}

export interface TeamsState {
  isInitialized: boolean
  isLoading: boolean
  data: TeamsById
}

export interface Achievement {
  id: string
  type: CampaignType
  address: string
  title: TranslatableText
  description?: TranslatableText
  badge: string
  points: number
}

export interface AchievementState {
  data: Achievement[]
}

// emperor state

export interface Emperor {
  address?: string
  nickname?: string
  color?: string
  style?: number
  isRegistered?: boolean
  timeAsEmperor?: number
  lastCrowningBlockTimestamp?: number
  bidAmount?: number
  jackpot?: number
  canBePoisoned?: boolean
  lastTimePoisoned?: number
  lastPoisonedBy?: string
  timeLeftForPoison?: number
}

export interface Player {
  avaxDonations?: number
  pefiDonations?: number
  latestDonorName?: string
  address?: string
  nickname?: string
  color?: string
  isRegistered?: boolean
  style?: string
}

export interface EmperorState {
  myEmperor: Emperor
  currentEmperor: Emperor
  topEmperors: Emperor[]
  maxBidIncrease: number
  minBidIncrease: number
  openingBib?: number
  finalDate?: number
  poisonDuration?: number
}

export interface DonationsState {
  totalPefiRaised: number
  totalAvaxRaised: number
  latestDonor: Player
  myDonor: Player
  finalDate: string
  minDonationAvax: number
  minDonationPefi: number
}

// Global state
export interface GlobalState {
  wrongNetworkGuideModalOpened: boolean
}

export interface State {
  lps: LpsState
  farms: FarmsState
  compounderFarms: CompounderFarmsState
  toasts: ToastsState
  pools: PoolsState
  profile: ProfileState
  teams: TeamsState
  achievements: AchievementState
  // global
  global: GlobalState
  emperor: EmperorState
  donations: DonationsState
}
