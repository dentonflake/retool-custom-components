import { Retool } from '@tryretool/custom-component-support';
import { useMemo, useRef } from 'react';
import AdvancedInsightsGrid from './advanced-insights-grid';
import { Row, State } from '../utils/definitions';

export const AdvancedInsights = () => {

  const [rawRowData] = Retool.useStateArray({ name: "data" });
  const [rawGridStates] = Retool.useStateArray({ name: "gridStates" });
  const [rawCargoId] = Retool.useStateNumber({ name: "cargoId" });

  const rowData = useMemo(() => rawRowData as Row[], [JSON.stringify(rawRowData)]);
  const gridStates = useMemo(() => rawGridStates as State[], [JSON.stringify(rawGridStates)]);
  const cargoId = useMemo(() => rawCargoId as number, [JSON.stringify(rawCargoId)]);

  return (
    <AdvancedInsightsGrid
      rowData={rowData}
      gridStates={gridStates}
      cargoId={cargoId}
    />
  )
};