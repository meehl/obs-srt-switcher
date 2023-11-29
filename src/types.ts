export type ObsLoginInfo = {
  url: string
  password: string
  remember: boolean
}

export type ObsScene = {
  sceneName: string
  sceneIndex: number
}

export type SceneSwitchSettings = {
  collection: string
  main: string
  lowQuality: string
  brb: string
  rateThreshold: number
  rttThreshold: number
}

export type SrtSettings = {
  streamUrl: string
  streamId: string
  pollingInterval: number
}

export type SrtStats = {
  MsTimeStamp: number
  PktSentTotal: number
  PktRecvTotal: number
  PktSndLossTotal: number
  PktRcvLossTotal: number
  PktRetransTotal: number
  PktSentACKTotal: number
  PktRecvACKTotal: number
  PktSentNAKTotal: number
  PktRecvNAKTotal: number
  UsSndDurationTotal: number
  PktSndDropTotal: number
  PktRcvDropTotal: number
  PktRcvUndecryptTotal: number
  ByteSentTotal: number
  ByteRecvTotal: number
  ByteRcvLossTotal: number
  ByteRetransTotal: number
  ByteSndDropTotal: number
  ByteRcvDropTotal: number
  ByteRcvUndecryptTotal: number
  PktSent: number
  PktRecv: number
  PktSndLoss: number
  PktRcvLoss: number
  PktRetrans: number
  PktRcvRetrans: number
  PktSentACK: number
  PktRecvACK: number
  PktSentNAK: number
  PktRecvNAK: number
  MbpsSendRate: number
  MbpsRecvRate: number
  UsSndDuration: number
  PktReorderDistance: number
  PktRcvAvgBelatedTime: number
  PktRcvBelated: number
  PktSndDrop: number
  PktRcvDrop: number
  PktRcvUndecrypt: number
  ByteSent: number
  ByteRecv: number
  ByteRcvLoss: number
  ByteRetrans: number
  ByteSndDrop: number
  ByteRcvDrop: number
  ByteRcvUndecrypt: number
  UsPktSndPeriod: number
  PktFlowWindow: number
  PktCongestionWindow: number
  PktFlightSize: number
  MsRTT: number
  MbpsBandwidth: number
  ByteAvailSndBuf: number
  ByteAvailRcvBuf: number
  MbpsMaxBW: number
  ByteMSS: number
  PktSndBuf: number
  ByteSndBuf: number
  MsSndBuf: number
  MsSndTsbPdDelay: number
  PktRcvBuf: number
  ByteRcvBuf: number
  MsRcvBuf: number
  MsRcvTsbPdDelay: number
  PktSndFilterExtraTotal: number
  PktRcvFilterExtraTotal: number
  PktRcvFilterSupplyTotal: number
  PktRcvFilterLossTotal: number
  PktSndFilterExtra: number
  PktRcvFilterExtra: number
  PktRcvFilterSupply: number
  PktRcvFilterLoss: number
  PktReorderTolerance: number
}

export type SrtSocket = {
  address: string
  stream_id: string
  stats: SrtStats
}

export type TmiLoginInfo = {
  username: string
  oauthToken: string
  channel: string
  remember: boolean
}

export type BotSettings = {
  allowModerators: boolean
  privilegedUsers: string[]
}

export type ChatCommandSender = {
  name: string
  isBroadcaster: boolean
  isModerator: boolean
}

export const commandTypes = [
  'start',
  'stop',
  'collections',
  'scenes',
  'collection',
  'scene',
  'rate',
  'rtt',
  'forcebrb',
  'stats',
] as const

export type ChatCommandType = (typeof commandTypes)[number]

export type ChatCommand = {
  channel: string
  sender: ChatCommandSender
  type: ChatCommandType
  args: string[]
}
