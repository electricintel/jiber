import { Action, Reducer, combineReducers } from '../../../core/index'
import { Socket } from '../../interfaces/socket'
import connection from './connection'
import connectedAt from './connected-at'
import lastReceivedAt from './last-received-at'
import lastSentAt from './last-sent-at'
import rateLimit from './rate-limit'

// Actions
export const INIT = 'hope/socket/INIT'
export const SEND = 'hope/socket/SEND'
export const RECEIVE = 'hope/socket/RECEIVE'
export const REMOVE = 'hope/socket/REMOVE'
export const RATE_LIMIT_OPTIONS = 'hope/socket/RATE_LIMIT_OPTIONS'

// Reducer
const reducer: Reducer = combineReducers({
  connection,
  connectedAt,
  lastReceivedAt,
  lastSentAt,
  rateLimit
})
export { reducer as default }

// Action Creators
export function socketInit (socketId: string, connection: Socket): Action {
  return {type: INIT, socketId, connection, timeMs: new Date().getTime()}
}

export function rateLimitOptions (
  socketId: string,
  periodDuration: number
): Action {
  return {type: RATE_LIMIT_OPTIONS, socketId, periodDuration}
}

export function socketSend (socketId: string): Action {
  return {type: SEND, socketId, timeMs: new Date().getTime()}
}

export function socketReceive (socketId: string): Action {
  return {type: RECEIVE, socketId, timeMs: new Date().getTime()}
}

export function socketRemove (socketId: string): Action {
  return {type: REMOVE, socketId}
}