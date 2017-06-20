import { Action } from '../../core/index'
import createOnAction from './on-action'

test('return a function', () => {
  const addActions = () => Promise.resolve()
  const updateRoom = () => { /* do nothing */ }
  const onAction = createOnAction(addActions, updateRoom)
  expect(typeof onAction).toBe('function')
})

test('add action to storage', async () => {
  const calls: any = []
  const addAction = async (roomId: string, action: Action) => {
    calls.push({roomId, action})
  }
  const updateRoom = () => { /* do nothing */ }
  const action: Action = {type: 'SPLAT', $hope: 'bob'}
  const onAction = createOnAction(addAction, updateRoom)

  await onAction('user1', action)

  expect(calls[0].roomId).toBe('bob')
  expect(calls[0].action).toEqual(
    {type: 'SPLAT', $hope: {roomId: 'bob', userId: 'user1'}}
  )
})
