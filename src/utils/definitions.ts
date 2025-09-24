import { Retool } from '@tryretool/custom-component-support'
import { AgGridReact } from 'ag-grid-react'

export type Row = {
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

export type State = {
  id: string
  createdBy: number
  name: string
  description?: string
  visibility: string
  gridState: string
  updatedAt: string
}

export type AdvancedInsightsGridProps = {
  rowData: Row[]
  gridStates: State[]
  cargoId: number
  setState?: (updates: Retool.SerializableObject) => void
}

export type ToolsProps = {
  gridRef: React.RefObject<AgGridReact<Row>>
  gridStates: State[]
  cargoId: number
}

export type DropdownProps = {
  gridRef: React.RefObject<AgGridReact<Row>>
  className?: string
  gridStates: State[]
  selectedGridState: State
  setSelectedGridState: (updates: Retool.SerializableObject) => void
}