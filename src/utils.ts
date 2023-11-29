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
