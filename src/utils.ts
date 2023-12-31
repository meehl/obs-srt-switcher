import {
  commandTypes,
  type ChatCommandType,
  type BotSettings,
  type ChatCommandSender,
} from './types'

export const isValidCommandType = (value: string): value is ChatCommandType => {
  return Object.values<string>(commandTypes).includes(value)
}

export const isAllowedToRun = (sender: ChatCommandSender, botSettings: BotSettings): boolean => {
  if (sender.isBroadcaster) return true
  if (sender.isModerator && botSettings.allowModerators) return true
  if (botSettings.privilegedUsers.includes(sender.name)) return true
  return false
}

export const parseNumber = (s: string): number | undefined => {
  const n = Number(s)
  return isNaN(n) ? undefined : n
}

export const parseBoolean = (s: string): boolean | undefined => {
  switch (s) {
    case 'true':
    case 'on':
    case 'yes':
    case '1':
      return true
    case 'false':
    case 'off':
    case 'no':
    case '0':
      return false
    default:
      return undefined
  }
}
