import { Action } from '../../core/index'
import createOnActions from './on-actions'

test('return a function', () => {
  const addActions = () => Promise.resolve()
  const onActions = createOnActions(addActions)
  expect(typeof onActions).toBe('function')
})

test('divide actions by room, and them to storage', () => {
  const calls: any = []
  const addActions = async (roomId: string, actions: Action[]) => {
    calls.push({roomId, actions})
  }
  const actions: Action[] = [
    {type: 'DO_A_THING', $hope: {roomId: 'bob'}},
    {type: 'PLUNK', $hope: {roomId: 'awe'}},
    {type: 'SPLAT', $hope: {roomId: 'bob'}}
  ]
  const onActions = createOnActions(addActions)

  onActions('user1', actions)

  expect(calls[0].roomId).toBe('bob')
  expect(calls[0].actions).toEqual([
    {type: 'DO_A_THING', $hope: {roomId: 'bob', userId: 'user1'}},
    {type: 'SPLAT', $hope: {roomId: 'bob', userId: 'user1'}}
  ])

  expect(calls[1].roomId).toBe('awe')
  expect(calls[1].actions).toEqual([
    {type: 'PLUNK', $hope: {roomId: 'awe', userId: 'user1'}}
  ])
})