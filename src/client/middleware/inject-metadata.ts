import randomStr from '../../core/utils/random-str'
import { LOCAL } from '../../core/constants/source-types'
import { Action, Middleware } from '../../core'

/**
 * Add some helpful data to the action
 */
export default function injectMetadata (action: Action): Action {
  const source = action.realtimeSource || LOCAL                                 // actions without a source are assumed to be local
  if (source !== LOCAL) return action                                           // only add metadata to local actions
  return {
    ...action,
    realtimeSource: LOCAL,                                                      // mark that this action originated locally
    quantumId: randomStr(16)                                                    // generate a unique id
  }
}