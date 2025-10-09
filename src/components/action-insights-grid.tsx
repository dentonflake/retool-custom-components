
import { Retool } from '@tryretool/custom-component-support'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

import styles from '../styles/insights.module.css'
import { ActionRow, ActionInsightsGridProps } from '../utils/definitions'
// import { distinctCount, pphAggregation, gapPercentAggregation, directPercentAggregation } from '../utils/aggregate-functions'

import { AgGridReact } from 'ag-grid-react'
import { AgChartsEnterpriseModule } from "ag-charts-enterprise"
import { LicenseManager, AllEnterpriseModule, IntegratedChartsModule } from 'ag-grid-enterprise'
import { ColDef, ModuleRegistry, StateUpdatedEvent, AllCommunityModule, themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)])
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103378}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nellis_Auction}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{nellis}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{nellis}_need_to_be_licensed___{nellis}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{11_September_2026}____[v3]_[0102]_MTc4OTA4MTIwMDAwMA==67f362d278f6fbbb12fe215d38e32531")

const ActionInsightsGrid = ({ rowData, gridState }: ActionInsightsGridProps) => {

  // Retool state outputs
  const [currentGridState, setCurrentGridState] = Retool.useStateObject({ name: "currentGridState", inspector: "hidden", initialValue: {} })

  // Reference to the AG Grid table
  const gridRef = useRef<AgGridReact<ActionRow>>(null);

  // Holds the state of the column definitions.
  const [colDefs] = useState<ColDef<ActionRow>[]>([

    {
      field: "year",
      headerName: "Year",
      filter: "agSetColumnFilter",
      sort: "desc",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "month",
      headerName: "Month",
      filter: "agSetColumnFilter",
      sort: "desc",
      enablePivot: true,
      enableRowGroup: true,

      comparator: (a: string | null, b: string | null): number => {

        const order: Record<string, number> = {
          January: 1,
          February: 2,
          March: 3,
          April: 4,
          May: 5,
          June: 6,
          July: 7,
          August: 8,
          September: 9,
          October: 10,
          November: 11,
          December: 12,
        };

        const numA = a ? order[a] ?? 99 : 99;
        const numB = b ? order[b] ?? 99 : 99;

        return numA - numB;
      }
    },

    {
      field: "week",
      headerName: "Week",
      filter: "agSetColumnFilter",
      sort: "desc",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "day",
      headerName: "Day",
      filter: "agSetColumnFilter",
      sort: "desc",
      enablePivot: true,
      enableRowGroup: true,

      comparator: (a: string | null, b: string | null) => {
        const order: Record<string, number> = {
          Monday: 1,
          Tuesday: 2,
          Wednesday: 3,
          Thursday: 4,
          Friday: 5,
          Saturday: 6,
          Sunday: 7,
        };

        const numA = a ? order[a] ?? 99 : 99;
        const numB = b ? order[b] ?? 99 : 99;

        return numA - numB;
      }
    },

    {
      field: "date",
      headerName: "Date",
      filter: "agSetColumnFilter",
      sort: "desc",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "hour",
      headerName: "Hour",
      headerTooltip: "Hour",
      initialPivot: true,
      filter: true,
      enablePivot: true,
      enableRowGroup: true,
      sort: 'asc',

      comparator: (a: string, b: string) => {
        const parseHour = (val: string): number => {
          if (!val) return -1;
          const [hourStr, meridian] = val.split(" ");
          let hour = parseInt(hourStr, 10);

          if (meridian === "AM") {
            if (hour === 12) hour = 0;
          } else if (meridian === "PM") {
            if (hour !== 12) hour += 12;
          }
          return hour;
        };

        return parseHour(a) - parseHour(b);
      },
    },

    {
      field: "createdAt",
      headerName: "Created At",
      filter: true,
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "location",
      headerName: "Location",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "cargoId",
      headerName: "Cargo Id",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "paylocityId",
      headerName: "Paylocity Id",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "status",
      headerName: "Status",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "jobTitle",
      headerName: "Job Title",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "employee",
      headerName: "Employee",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
      enableValue: true
    },

    {
      field: "supervisor",
      headerName: "Supervisor",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "supervisorSecond",
      headerName: "2nd Supervisor",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "supervisorThird",
      headerName: "3rd Supervisor",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "supervisorFourth",
      headerName: "4th Supervisor",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "logType",
      headerName: "Log Type",
      headerTooltip: "Log Type",
      filter: true,
      enablePivot: true,
      enableRowGroup: true
    },

    {
      field: "itemId",
      headerName: "Item Id",
      headerTooltip: "Item Id",
      filter: true,
      enablePivot: true,
      enableRowGroup: true
    },

    {
      field: "action",
      headerName: "Action",
      headerTooltip: "Action",
      filter: true,
      initialRowGroup: true,
      enablePivot: true,
      enableRowGroup: true,
      enableValue: true,
      aggFunc: 'count',
      allowedAggFuncs: ['count']
    },

    {
      field: "program",
      headerName: "Program",
      headerTooltip: "Program",
      filter: true,
      enablePivot: true,
      enableRowGroup: true,
      enableValue: true,
      allowedAggFuncs: ['count']
    },

    {
      field: "programType",
      headerName: "Program Type",
      headerTooltip: "Program Type",
      filter: true,
      enablePivot: true,
      enableRowGroup: true,
      enableValue: true,
      allowedAggFuncs: ['count']
    },

    {
      field: "size",
      headerName: "Size",
      headerTooltip: "Size",
      filter: true,
      enablePivot: true,
      enableRowGroup: true,
      enableValue: true,
      allowedAggFuncs: ['count']
    }
  ])

  // Adds additional defaults to each column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 200,
    filterParams: {
      buttons: ["reset"]
    },
    cellRendererParams: {
      suppressCount: true
    }
  }), [])

  // Aggregate functions
  const aggFuncs = useMemo(() => ({
    // distinctCount,
    // pphAggregation,
    // gapPercentAggregation,
    // directPercentAggregation
  }), [])

  // Theme of the grid
  const theme = useMemo(() => themeQuartz.withParams({
    borderRadius: 4,
    browserColorScheme: "light",
    headerFontSize: 14,
    spacing: 8,
    wrapperBorderRadius: 8,
    wrapperBorder: "rgba(0, 0, 0, 0)"
  }), []);

  const debounceTimeoutRef = useRef<number | null>(null);

  const onStateUpdated = useCallback((event: StateUpdatedEvent) => {

    if (!gridRef.current) return;
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);

    debounceTimeoutRef.current = window.setTimeout(() => {
      const gridState = gridRef.current!.api.getState();
      setCurrentGridState(gridState as Retool.SerializableObject);
    }, 200);

  }, []);

  const onFirstDataRendered = () => {

    if (!gridRef.current?.api || !gridState) return;

    gridRef.current.api.setState(gridState);

  }

  useEffect(() => {

    if (!gridRef.current?.api || !gridState) return;

    gridRef.current.api.setState(gridState);

  }, [gridState]);

  return (
    <section className={styles.container}>

      <div className={styles.grid}>
        <AgGridReact

          ref={gridRef}

          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}

          // aggFuncs={aggFuncs}
          suppressAggFuncInHeader={true}

          sideBar
          enableCharts
          theme={theme}
          cellSelection

          onStateUpdated={onStateUpdated}
          onFirstDataRendered={onFirstDataRendered}
        />
      </div>

    </section>
  )
}

export default ActionInsightsGrid
