import { Retool } from '@tryretool/custom-component-support';
import { useMemo } from 'react';
import AdvancedInsightsGrid from './advanced-insights-grid';
import { Row } from '../utils/definitions';
import { GridState } from 'ag-grid-enterprise';

export const AdvancedInsights = () => {

  const [rawRowData] = Retool.useStateArray({ name: "data", label: "Data Source" });
  const [rawGridState] = Retool.useStateObject({ name: "gridState", label: "Grid State" });

  const rowData = useMemo(() => rawRowData as Row[], [JSON.stringify(rawRowData)]);
  const gridState = useMemo(() => rawGridState as GridState, [JSON.stringify(rawGridState)]);

  return (
    <AdvancedInsightsGrid
      rowData={rowData}
      gridState={gridState}
    />
  )
};