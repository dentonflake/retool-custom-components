import { Retool } from '@tryretool/custom-component-support'
import styles from '../styles/advanced-insights.module.css'
import { useState, useMemo, useCallback, FC, useRef, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { ColDef, GridState, ModuleRegistry, StateUpdatedEvent, AllCommunityModule } from 'ag-grid-community'
import { LicenseManager, AllEnterpriseModule } from 'ag-grid-enterprise'
import Tools from './tools'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule])
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103378}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nellis_Auction}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{nellis}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{nellis}_need_to_be_licensed___{nellis}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{11_September_2026}____[v3]_[0102]_MTc4OTA4MTIwMDAwMA==67f362d278f6fbbb12fe215d38e32531")

type Row = {
  year?: number
  month?: string
  week?: string
  day?: string
  date?: string
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
  type?: string
  job?: string
  department?: string
  area?: string
  jobType?: string
  hours?: number
  points?: number
  actions?: number
  jobActions?: number
  nonJobActions?: number
}

type State = {
  id: string
  createdBy: number
  name: string
  description: string
  visibility: string
  gridState: string
}

export const AdvancedInsights = () => {

  const gridRef = useRef<AgGridReact<Row>>(null);

  // Retool inspector input (Data Source)
  const [rawRowData, setRawRowData] = Retool.useStateArray({ name: "data", label: "Data Source" })
  const rowData = useMemo(() => rawRowData as Row[], [rawRowData])

  // Retool inspector input (Grid States)
  const [rawGridStates, setRawGridStates] = Retool.useStateArray({ name: "gridStates", label: "Grid States" })
  const gridStates = useMemo(() => rawGridStates as State[], [rawGridStates])

  // Retool state output (currentGridState)
  const [currentGridState, setCurrentGridState] = Retool.useStateObject({ name: "currentGridState", inspector: "hidden", initialValue: {} })

  // Retool state output (selectedView)
  const [selectedView, setSelectedView] = Retool.useStateObject({ name: "selectedView", inspector: "hidden", initialValue: {} })

  // Internal component state (Selected View)
  const [view, setView] = useState<State | undefined>()

  // Internal component state (Grid State)
  const [state, setState] = useState<GridState>(JSON.parse(`{
    "rowGroup": {
      "groupColIds": [
        "location",
        "supervisor"
      ]
    },
    "version": "34.2.0",
    "sideBar": {
      "visible": true,
      "position": "right",
      "openToolPanel": "columns",
      "toolPanels": {
        "columns": {
          "expandedGroupIds": []
        },
        "filters": {
          "expandedGroupIds": [],
          "expandedColIds": []
        }
      }
    },
    "sort": {
      "sortModel": [
        {
          "colId": "location",
          "sort": "desc"
        },
        {
          "colId": "supervisor",
          "sort": "desc"
        },
        {
          "colId": "ag-Grid-AutoColumn",
          "sort": "desc"
        }
      ]
    },
    "aggregation": {
      "aggregationModel": [
        {
          "colId": "hours",
          "aggFunc": "sum"
        }
      ]
    },
    "pivot": {
      "pivotMode": true,
      "pivotColIds": []
    },
    "columnVisibility": {
      "hiddenColIds": [
        "location"
      ]
    },
    "columnSizing": {
      "columnSizingModel": [
        {
          "colId": "ag-Grid-AutoColumn",
          "flex": 1,
          "width": 632
        },
        {
          "colId": "year",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "month",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "week",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "day",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "date",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "location",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "cargoId",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "paylocityId",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "status",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "jobTitle",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "employee",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "supervisor",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "supervisorSecond",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "supervisorThird",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "supervisorFourth",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "type",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "job",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "department",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "area",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "jobType",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "hours",
          "flex": 1,
          "width": 631
        },
        {
          "colId": "points",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "actions",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "jobActions",
          "flex": 1,
          "width": 200
        },
        {
          "colId": "nonJobActions",
          "flex": 1,
          "width": 200
        }
      ]
    },
    "columnOrder": {
      "orderedColIds": [
        "ag-Grid-AutoColumn",
        "year",
        "month",
        "week",
        "day",
        "date",
        "location",
        "cargoId",
        "paylocityId",
        "status",
        "jobTitle",
        "employee",
        "supervisor",
        "supervisorSecond",
        "supervisorThird",
        "supervisorFourth",
        "type",
        "job",
        "department",
        "area",
        "jobType",
        "hours",
        "points",
        "actions",
        "jobActions",
        "nonJobActions"
      ]
    },
    "rowGroupExpansion": {
      "expandedRowGroupIds": [
        "row-group-location-Katy",
        "row-group-location-Katy-supervisor-Jose Loza",
        "row-group-location-Mesa",
        "row-group-location-Mesa-supervisor-Sheena Gittens",
        "row-group-location-Phoenix",
        "row-group-location-Phoenix-supervisor-Lataya Solomon",
        "row-group-location-Delran",
        "row-group-location-Delran-supervisor-Morgan Martinez",
        "row-group-location-North Las Vegas",
        "row-group-location-North Las Vegas-supervisor-Usman Mian",
        "row-group-location-Nellis Outlet",
        "row-group-location-Nellis Outlet-supervisor-Jose Loza",
        "row-group-location-Denver",
        "row-group-location-Denver-supervisor-Sheena Gittens",
        "row-group-location-Katy West",
        "row-group-location-Katy West-supervisor-Lataya Solomon",
        "row-group-location-Salt Lake",
        "row-group-location-Salt Lake-supervisor-Morgan Martinez",
        "row-group-location-Henderson",
        "row-group-location-Henderson-supervisor-Usman Mian"
      ]
    },
    "pagination": {
      "page": 0,
      "pageSize": 100
    },
    "focusedCell": {
      "colId": "hours",
      "rowIndex": 13,
      "rowPinned": null
    }
  }`))

  // Event handler that updates the internal state of the grid when changed
  const onStateUpdated = useCallback((params: StateUpdatedEvent<Row>) => {
    setState(params.state)
  }, [])

  // Holds the state of the column definitions.
  const [colDefs, setColDefs] = useState<ColDef<Row>[]>([

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
      valueFormatter: params => params.value && params.value.toFixed(2)
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
  ])

  // Adds additional defaults to each column definition
  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 200,
    filterParams: {
      buttons: ["reset"]
    }
  }), [])

  useEffect(() => {
    if (!gridRef.current?.api) return;           // wait until ready
    if (!view?.gridState) return;
    gridRef.current.api.setState(JSON.parse(view.gridState));
  }, [view]);

  return (
    <section className={styles.container}>

      <Tools
        setCurrentGridState={setCurrentGridState}
        setSelectedView={setSelectedView}

        gridStates={gridStates}
        state={state}

        view={view}
        setView={setView}
      />

      <div className={styles.grid}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          sideBar
          initialState={state}
          onStateUpdated={onStateUpdated}
        />
      </div>

    </section>
  )
}