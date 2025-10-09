import { Retool } from '@tryretool/custom-component-support';
import { useMemo } from 'react';
import ActionInsightsGrid from './action-insights-grid';
import { ActionRow } from '../utils/definitions';
import { GridState } from 'ag-grid-enterprise';

export const ActionInsights = () => {

  const [rawRowData] = Retool.useStateArray({ name: "data", label: "Data Source" });
  const [rawGridState] = Retool.useStateObject({ name: "gridState", label: "Grid State" });

  const rowData = useMemo(() => rawRowData as ActionRow[], [JSON.stringify(rawRowData)]);
  const gridState = useMemo(() => rawGridState as GridState, [JSON.stringify(rawGridState)]);

  console.log(gridState)

  return (
    <ActionInsightsGrid
      rowData={rowData}
      gridState={gridState}
    />
  )
};