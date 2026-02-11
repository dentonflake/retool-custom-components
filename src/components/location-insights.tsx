import { Retool } from '@tryretool/custom-component-support'
import { useMemo } from 'react'
import LocationInsightsGrid from './location-insights-grid'
import { LocationRow } from '../utils/definitions'
import { GridState } from 'ag-grid-enterprise'

export const LocationInsights = () => {

  const [rawRowData] = Retool.useStateArray({ name: "data", label: "Data Source" })
  const [rawGridState] = Retool.useStateObject({ name: "gridState", label: "Grid State" })

  const rowData = useMemo(() => rawRowData as LocationRow[], [JSON.stringify(rawRowData)])
  const gridState = useMemo(() => rawGridState as GridState, [JSON.stringify(rawGridState)])

  return (
    <LocationInsightsGrid
      rowData={rowData}
      gridState={gridState}
    />
  )
}