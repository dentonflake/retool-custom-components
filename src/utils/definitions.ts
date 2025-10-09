import { Retool } from '@tryretool/custom-component-support'
import { GridState } from 'ag-grid-enterprise'

export type AdvancedRow = {
  year: number
  month: string
  week: string
  day: string
  date: string
  location: string
  cargoId: number
  paylocityId: string
  status: string
  jobTitle?: string
  employee: string
  supervisor?: string
  supervisorSecond?: string
  supervisorThird?: string
  supervisorFourth?: string
  type: string
  job?: string
  department?: string
  area?: string
  jobType?: string
  hours: number
  points?: number
  actions?: number
  jobActions?: number
  nonJobActions?: number
  totalAssignments?: number
  kioskAssignments?: number
  proactiveAssignments?: number
  reactiveAssignments?: number
}

export type AdvancedInsightsGridProps = {
  rowData: AdvancedRow[]
  gridState: GridState
  setState?: (updates: Retool.SerializableObject) => void
}

export type ActionRow = {
  year?: string
  month?: string
  week?: string
  day?: string
  date?: string
  hour?: string
  createdAt?: string
  location?: string
  cargoId?: number
  paylocityId?: string
  status?: string
  jobTitle?: string
  employee?: string
  supervisor?: string
  supervisorSecond?: string
  supervisorThird?: string
  supervisorFourth?: string
  logType?: string
  itemId?: number
  action?: string
  program?: string
  programType?: string
  size?: string
}

export type ActionInsightsGridProps = {
  rowData: ActionRow[]
  gridState: GridState
  setState?: (updates: Retool.SerializableObject) => void
}