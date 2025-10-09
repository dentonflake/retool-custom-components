
import { Retool } from '@tryretool/custom-component-support'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

import styles from '../styles/insights.module.css'
import { AdvancedRow, AdvancedInsightsGridProps } from '../utils/definitions'
import { distinctCount, pphAggregation, gapPercentAggregation, directPercentAggregation, kioskPercent, proactivePercent, reactivePercent, adminPercentAggregation, indirectPercentAggregation } from '../utils/aggregate-functions'

import { AgGridReact } from 'ag-grid-react'
import { AgChartsEnterpriseModule } from "ag-charts-enterprise"
import { LicenseManager, AllEnterpriseModule, IntegratedChartsModule } from 'ag-grid-enterprise'
import { ColDef, ModuleRegistry, StateUpdatedEvent, AllCommunityModule, themeQuartz } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)])
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103378}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nellis_Auction}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{nellis}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{nellis}_need_to_be_licensed___{nellis}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{11_September_2026}____[v3]_[0102]_MTc4OTA4MTIwMDAwMA==67f362d278f6fbbb12fe215d38e32531")

const AdvancedInsightsGrid = ({ rowData, gridState }: AdvancedInsightsGridProps) => {

  // Retool state outputs
  const [currentGridState, setCurrentGridState] = Retool.useStateObject({ name: "currentGridState", inspector: "hidden", initialValue: {} })

  // Reference to the AG Grid table
  const gridRef = useRef<AgGridReact<AdvancedRow>>(null);

  // Holds the state of the column definitions.
  const [colDefs] = useState<ColDef<AdvancedRow>[]>([

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
      field: "type",
      headerName: "Type",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true
    },

    {
      field: "job",
      headerName: "Job",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "department",
      headerName: "Department",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "area",
      headerName: "Area",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "jobType",
      headerName: "Job Type",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "hours",
      headerName: "Hours",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueFormatter: params => params.value && params.value.toFixed(2)
    },

    {
      field: "points",
      headerName: "Points",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueFormatter: params => params.value && params.value.toFixed(0)
    },

    {
      field: "actions",
      headerName: "Actions",
      filter: "agNumberColumnFilter",
      enableValue: true
    },

    {
      field: "jobActions",
      headerName: "Job Actions",
      filter: "agNumberColumnFilter",
      enableValue: true
    },

    {
      field: "nonJobActions",
      headerName: "Non-Job Actions",
      filter: "agNumberColumnFilter",
      enableValue: true
    },

    {
      field: "totalAssignments",
      headerName: "Total Assignments",
      filter: "agNumberColumnFilter",
      enableValue: true,
    },

    {
      field: "kioskAssignments",
      headerName: "Kiosk Assignments",
      filter: "agNumberColumnFilter",
      enableValue: true,
    },

    {
      field: "proactiveAssignments",
      headerName: "Proactive Assignments",
      filter: "agNumberColumnFilter",
      enableValue: true
    },

    {
      field: "reactiveAssignments",
      headerName: "Reactive Assignments",
      filter: "agNumberColumnFilter",
      enableValue: true
    },

    {
      colId: "kioskPercent",
      headerName: "Kiosk %",
      filter: "agNumberColumnFilter",
      allowedAggFuncs: ['kioskPercent'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const kioskAssignments = Number(params.data!.kioskAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return {
            kioskAssignments,
            totalAssignments,
            value: totalAssignments > 0 ? (kioskAssignments / totalAssignments) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const kioskAssignments = Number(params.data!.kioskAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return totalAssignments > 0 ? (kioskAssignments / totalAssignments) * 100 : 0
        }

        return params.node?.aggData?.kioskPercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: "proactivePercent",
      headerName: "Proactive %",
      filter: "agNumberColumnFilter",
      allowedAggFuncs: ['proactivePercent'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const proactiveAssignments = Number(params.data!.proactiveAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return {
            proactiveAssignments,
            totalAssignments,
            value: totalAssignments > 0 ? (proactiveAssignments / totalAssignments) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const proactiveAssignments = Number(params.data!.proactiveAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return totalAssignments > 0 ? (proactiveAssignments / totalAssignments) * 100 : 0
        }

        return params.node?.aggData?.proactivePercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: "reactivePercent",
      headerName: "Reactive %",
      filter: "agNumberColumnFilter",
      allowedAggFuncs: ['reactivePercent'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const reactiveAssignments = Number(params.data!.reactiveAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return {
            reactiveAssignments,
            totalAssignments,
            value: totalAssignments > 0 ? (reactiveAssignments / totalAssignments) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const reactiveAssignments = Number(params.data!.reactiveAssignments) ?? 0
          const totalAssignments = Number(params.data!.totalAssignments) ?? 0

          return totalAssignments > 0 ? (reactiveAssignments / totalAssignments) * 100 : 0
        }

        return params.node?.aggData?.proactivePercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: 'pph',
      headerName: 'PPH',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['pphAggregation'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data?.jobType

          const points = Number(params.data?.points) ?? 0
          const directHours = type === 'Direct' ? Number(params.data?.hours) ?? 0 : 0

          return {
            points,
            directHours,
            value: directHours > 0 ? points / directHours : 0
          }
        }
      },


      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const points = Number(params.data?.points) ?? 0
          const directHours = type === 'Direct' ? Number(params.data?.hours) ?? 0 : 0

          return directHours > 0 ? points / directHours : 0
        }

        return params.node?.aggData?.pph?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(0);
        }

        return '0';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: 'directPercent',
      headerName: 'Direct %',
      headerTooltip: 'Direct Hours / Total Hours',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['directPercentAggregation'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const directHours = type === 'Direct' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return {
            directHours,
            totalHours,
            value: totalHours > 0 ? (directHours / totalHours) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const directHours = type === 'Direct' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return totalHours > 0 ? (directHours / totalHours) * 100 : 0
        }

        return params.node?.aggData?.directPercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: 'indirectPercent',
      headerName: 'Indirect %',
      headerTooltip: 'Indirect Hours / Total Hours',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['indirectPercentAggregation'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const indirectHours = type === 'Indirect' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return {
            indirectHours,
            totalHours,
            value: totalHours > 0 ? (indirectHours / totalHours) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const indirectHours = type === 'Indirect' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return totalHours > 0 ? (indirectHours / totalHours) * 100 : 0
        }

        return params.node?.aggData?.indirectPercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: 'adminPercent',
      headerName: 'Admin %',
      headerTooltip: 'Admin Hours / Total Hours',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['adminPercentAggregation'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const adminHours = type === 'Admin' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return {
            adminHours,
            totalHours,
            value: totalHours > 0 ? (adminHours / totalHours) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.jobType

          const adminHours = type === 'Admin' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return totalHours > 0 ? (adminHours / totalHours) * 100 : 0
        }

        return params.node?.aggData?.adminPercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

    {
      colId: 'gapPercent',
      headerName: 'Gap %',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['gapPercentAggregation'],
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.type

          const gapHours = type === 'gap' ? Number(params.data!.hours) ?? 0 : 0
          const totalHours = Number(params.data!.hours) ?? 0

          return {
            gapHours,
            totalHours,
            value: totalHours > 0 ? (gapHours / totalHours) * 100 : 0
          }
        }
      },

      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const type = params.data!.type

          const gapHours = type === 'gap' ? params.data!.hours : 0
          const totalHours = params.data!.hours

          return totalHours > 0 ? (gapHours / totalHours) * 100 : 0
        }

        return params.node?.aggData?.gapPercent?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0.00%';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2) + '%';
        }

        return '0.00%';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
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
    distinctCount,
    pphAggregation,
    gapPercentAggregation,
    directPercentAggregation,
    kioskPercent,
    proactivePercent,
    reactivePercent,
    adminPercentAggregation,
    indirectPercentAggregation
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

          aggFuncs={aggFuncs}
          suppressAggFuncInHeader={true}

          sideBar
          enableCharts
          theme={theme}
          cellSelection

          onStateUpdated={onStateUpdated}
          onFirstDataRendered={onFirstDataRendered}
          // groupTotalRow={"bottom"}
        />
      </div>

    </section>
  )
}

export default AdvancedInsightsGrid