import { Action, Store } from '../../core/index'
import { socketSend } from '../reducers/socket/socket'

const OPEN = 1

export default function createSendToSocket (store: Store) {
  return function sendToSocket (socketId: string, action: Action): void {
    const socket = store.getState().sockets[socketId]
    const connection = socket.connection
    if (connection.readyState === OPEN) {
      connection.send(JSON.stringify(action))
      store.dispatch(socketSend(socketId))
    }
  }
}
