import { Action } from 'jiber-core'
import { createOptimistic } from './optimistic'
import { ClientRoomState } from './client-room'

const adder = (state: any = '', action: Action): any => {
  return state + action.value
}
const optimistic = createOptimistic(adder)

test('user generated actions are used on the optimistic state', () => {
  const state: any = undefined
  const action = {
    type: 'bet',
    value: '123',
    $id: 1
  }
  const roomState: ClientRoomState = {
    pendingActions: [],
    confirmed: undefined,
    optimistic: state,
    members: {},
    lastUpdatedAt: 0
  }
  expect(optimistic(roomState, action)).toEqual('123')
})

test('optimistic state is rebased when confirmed state is updated', () => {
  const roomState: ClientRoomState = {
    pendingActions: [
      {
        type: 'test',
        value: '123',
        $id: 4,
        $u: 'sally',
        $r: 'testRoom'
      },
      {
        type: 'test',
        value: '456',
        $id: 5,
        $u: 'sally',
        $r: 'testRoom'
      }
    ],
    confirmed: 'abc',
    optimistic: '',
    members: {},
    lastUpdatedAt: 0
  }
  const action: Action = {
    type: 'test',
    value: 'abc',
    $r: 'testRoom',
    $u: 'sally',
    $id: 3,
    $confirmed: true
  }

  const newState = optimistic(roomState, action)
  expect(newState).toEqual('abc123456')
})
