import { set } from './set'
import { get } from './get'
import { splice } from './splice'
import { toArray } from './to-array'

/**
 * This reducer offers some generic functionality which could work well for
 * a variety of applications.
 * In an effort to offer a default setup that just works, this reducer
 * will be included in the client bundle. If you are using a custom reducer,
 * then you can safely exclude this file
 */

export interface SwissState {
  [key: string]: any
}

export const SET = 'SET'
export const DELETE = 'DELETE'
export const ADD = 'ADD'
export const PUSH = 'PUSH'
export const SPLICE = 'SPLICE'
export const POP = 'POP'

export const swiss = (state: SwissState = {}, action: any): SwissState => {
  const arrPath = action.path ? action.path : []
  const path: string[] = Array.isArray(arrPath) ? arrPath : action.path.split('.')
  const newValue = action.srcPath ? get(state, action.srcPath) : action.value
  const oldValue = get(state, path)

  switch (action.type) {
    case SET:
      return set(state, path, newValue)
    case DELETE:
      return set(state, path, undefined)
    case ADD:
      return set(state, path, (oldValue || 0) + newValue)
    case SPLICE:
      const { start, count, items, destPath } = action
      if (destPath) {
        set(state, destPath, toArray(oldValue).slice(start, start + count))
      }
      return set(state, path, splice(oldValue, start, count, ...items))
    case PUSH:
      return set(state, path, splice(oldValue, Infinity, 0, ...newValue))
    case POP:
      const arr: any[] = get(state, path, [])
      if (Array.isArray(arr) && arr.length > 0) {
        arr.pop()
      }
      return state
    default:
      return state
  }
}
