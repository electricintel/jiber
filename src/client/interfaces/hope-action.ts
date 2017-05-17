import { SourceType } from '../../core/index'

interface HopeMeta {
  roomId: string,
  userId: string,
  actionId: number,
  source: SourceType
}

export interface HopeAction {
  $hope: HopeMeta,
  type: string,
  [key: string]: any
}

export { HopeAction as default }
