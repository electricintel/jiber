import { get } from '../swiss/get'
import { parseParams } from './parse-params'

export const funcs: any = {

  SET: (_state: any, path: string, value: any) => {
    return { type: 'SET', path, value }
  },

  ADD: (_state: any, path: string, value: any) => {
    return { type: 'ADD', path, value }
  },

  PUSH: (_state: any, path: string, value: any) => {
    return { type: 'PUSH', path, value }
  },

  POP: (state: any, path: string, destPath: string) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return { type: 'POP', path, destPath }
    }
  },

  SPLICE: (state: any, path: string, start: number, count: number, destPath: string, ...items: any) => {
    const arr: any[] = get(state, path)
    if (Array.isArray(arr) && arr.length > 0) {
      return { type: 'SPLICE', path, start, count, items, destPath }
    }
  },

  CHECK: (state: any, path1: string, comparison: string, path2: any) => {
    const val1: any = parseParams(state, path1, true)
    const val2: any = parseParams(state, path2, true)
    switch (comparison) {
      case '==':
        return val1 === val2
      case '>':
        return val1 > val2
      case '<':
        return val1 < val2
      case '>=':
        return val1 >= val2
      case '<=':
        return val1 <= val2
      case '~=':
        return new RegExp(val2).test(val1)
      case '!=':
        return val1 !== val2
      case '?':
        return (val1 !== null) === val2
    }
  },

  IF: (state: any, path: string, comparison: string, value: any, trueSteps: any[] = [], falseSteps: any[] = []) => {
    const result = funcs.CHECK(state, path, comparison, value)
    return { addSteps: result ? trueSteps : falseSteps }
  }
}