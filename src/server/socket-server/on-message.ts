import { Action } from '../../core/index'
import ServerState from '../interfaces/server-state'

/**
 * handles 'message' socket event
 * json decodes the message, and passes the result to onAction
 * if there is an error, it is written back to the socket
 */
export default function createOnMessage (
  getState: () => ServerState,
  onAction: (userId: string, action: Action) => void,
  sendToSocket: (socketId: string, action: Action) => void
) {
  return function onMessage (
    socketId: string,
    message: string
  ): void {
    try {
      const state = getState()                                                  // look up their userId
      const socket = state.sockets[socketId]
      if (!socket || !socket.userId) return
      const userId = socket.userId
      const action = JSON.parse(message)
      onAction(userId, action)
    } catch (e) {
      sendToSocket(socketId, e.message)
    }
  }
}
