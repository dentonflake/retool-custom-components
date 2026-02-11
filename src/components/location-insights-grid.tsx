
import { Retool } from '@tryretool/custom-component-support'
import { useState, useMemo, useCallback, useRef, useEffect } from 'react'

import styles from '../styles/insights.module.css'
import { LocationRow, LocationInsightsGridProps } from '../utils/definitions'

import { AgGridReact } from 'ag-grid-react'
import { AgChartsEnterpriseModule } from "ag-charts-enterprise"
import { LicenseManager, AllEnterpriseModule, IntegratedChartsModule } from 'ag-grid-enterprise'
import { ColDef, ModuleRegistry, StateUpdatedEvent, AllCommunityModule, themeQuartz } from 'ag-grid-community'
import { actualRateMPPAggregation } from '../utils/aggregate-functions'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)])
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103378}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nellis_Auction}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{nellis}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{nellis}_need_to_be_licensed___{nellis}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{11_September_2026}____[v3]_[0102]_MTc4OTA4MTIwMDAwMA==67f362d278f6fbbb12fe215d38e32531")

const LocationInsightsGrid = ({ rowData, gridState }: LocationInsightsGridProps) => {

  // Retool state outputs
  const [currentGridState, setCurrentGridState] = Retool.useStateObject({ name: "currentGridState", inspector: "hidden", initialValue: {} })

  // Reference to the AG Grid table
  const gridRef = useRef<AgGridReact<LocationRow>>(null);

  // Holds the state of the column definitions.
  const [colDefs] = useState<ColDef<LocationRow>[]>([

    {
      field: "date",
      headerName: "Date",
      filter: "agSetColumnFilter",
      sort: "asc",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "locationId",
      headerName: "Location ID",
      filter: "agSetColumnFilter",
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
      field: "type",
      headerName: "Type",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "jobId",
      headerName: "Job ID",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "job",
      headerName: "Job",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "jobTypeId",
      headerName: "Job Type ID",
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
      field: "laborType",
      headerName: "Labor Type",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "teamId",
      headerName: "Team ID",
      filter: "agSetColumnFilter",
      enablePivot: true,
      enableRowGroup: true,
    },

    {
      field: "departmentId",
      headerName: "Department ID",
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
      field: "areaId",
      headerName: "Area ID",
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
      field: "hours",
      headerName: "Hours",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueFormatter: params => params.value && params.value.toFixed(2)
    },

    {
      field: "directHours",
      headerName: "Direct Hours",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueFormatter: params => params.value && params.value.toFixed(2)
    },

    {
      field: "supportHours",
      headerName: "Support Hours",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueFormatter: params => params.value && params.value.toFixed(2) 
    },

    {
      field: "gapHours",
      headerName: "Gap Hours",
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
      colId: 'actualRateMPP',
      headerName: 'Actual Rate (MPP)',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['actualRateMPPAggregation'],
      aggFunc: 'actualRateMPPAggregation',
      enableValue: true,

      valueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const hours = Number(params.data?.hours) || 0
          const points = Number(params.data?.points) || 0

          const value = points > 0
            ? (hours * 60) / points
            : 0;
          
          return {
            hours,
            points,
            value
          }
        }
      },


      filterValueGetter: (params) => {
        if (!(params.node && params.node.group)) {

          const hours = Number(params.data?.hours) || 0
          const points = Number(params.data?.points) || 0

          const value = points > 0
            ? (hours * 60) / points
            : 0;

          return value;
        }

        return params.node?.aggData?.actualRateMPP?.value;
      },

      valueFormatter: (params) => {

        if (params.value == null) return '0';

        if (params.value.hasOwnProperty('value')) {
          return params.value.value.toFixed(2);
        }

        return '0';
      },

      comparator: (valueA, valueB) => {
        
        const numA = valueA?.value ?? 0;
        const numB = valueB?.value ?? 0;

        return numA - numB;
      }
    },

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
    actualRateMPPAggregation
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
        />
      </div>

    </section>
  )
}

export default LocationInsightsGrid
