
import { Retool } from '@tryretool/custom-component-support'
import { useMemo, useCallback, useRef, useEffect } from 'react'

import styles from '../styles/insights.module.css'
import { LocationRow, LocationInsightsGridProps } from '../utils/definitions'

import { AgGridReact } from 'ag-grid-react'
import { AgChartsEnterpriseModule } from "ag-charts-enterprise"
import { LicenseManager, AllEnterpriseModule, IntegratedChartsModule } from 'ag-grid-enterprise'
import { ColDef, ModuleRegistry, StateUpdatedEvent, AllCommunityModule, themeQuartz, IAggFuncParams } from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule, AllEnterpriseModule, IntegratedChartsModule.with(AgChartsEnterpriseModule)])
LicenseManager.setLicenseKey("Using_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-103378}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{Nellis_Auction}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{nellis}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{nellis}_need_to_be_licensed___{nellis}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Charts_and_AG_Grid}_Enterprise_versions_released_before_{11_September_2026}____[v3]_[0102]_MTc4OTA4MTIwMDAwMA==67f362d278f6fbbb12fe215d38e32531")

const LocationInsightsGrid = ({ rowData, gridState }: LocationInsightsGridProps) => {

  // Retool state outputs
  const [currentGridState, setCurrentGridState] = Retool.useStateObject({ name: "currentGridState", inspector: "hidden", initialValue: {} })

  // Reference to the AG Grid table
  const gridRef = useRef<AgGridReact<LocationRow>>(null);

  const buildPointsKey = useCallback((row?: LocationRow) => {
    if (!row) return ''

    const areaKey = row.areaId != null
      ? `areaId:${row.areaId}`
      : `area:${String(row.area ?? '').trim().toLowerCase()}`
    const departmentKey = row.departmentId != null
      ? `departmentId:${row.departmentId}`
      : `department:${String(row.department ?? '').trim().toLowerCase()}`

    return `${areaKey}|${departmentKey}`
  }, [])

  const directPointsByKey = useMemo(() => {
    const pointsMap = new Map<string, number>()

    for (const row of rowData) {
      if (String(row.laborType ?? '').trim().toLowerCase() !== 'direct') continue

      const key = buildPointsKey(row)
      if (!key) continue

      const points = Number(row.points) || 0
      pointsMap.set(key, (pointsMap.get(key) || 0) + points)
    }

    return pointsMap
  }, [buildPointsKey, rowData])

  const supportCountByKey = useMemo(() => {
    const countMap = new Map<string, number>()

    for (const row of rowData) {
      if (String(row.laborType ?? '').trim().toLowerCase() !== 'support') continue

      const key = buildPointsKey(row)
      if (!key) continue

      countMap.set(key, (countMap.get(key) || 0) + 1)
    }

    return countMap
  }, [buildPointsKey, rowData])

  const getEffectivePoints = useCallback((row?: LocationRow) => {
    if (!row) return 0

    const currentPoints = Number(row.points) || 0
    const laborType = String(row.laborType ?? '').trim().toLowerCase()
    if (laborType !== 'support') return currentPoints

    const key = buildPointsKey(row)
    if (!key) return currentPoints

    const directPoints = directPointsByKey.get(key)
    if (directPoints == null) return currentPoints

    const supportCount = supportCountByKey.get(key) || 1
    return directPoints / supportCount
  }, [buildPointsKey, directPointsByKey, supportCountByKey])

  const getSupportGoalPPH = useCallback((row?: LocationRow) => {
    if (!row) return 0
    return Number(row.supportGoalPointsPerHour ?? row.supportPPHGoal) || 0
  }, [])

  const getGoalRateMPP = useCallback((row?: LocationRow) => {
    if (!row) return 0

    const laborType = String(row.laborType ?? '').trim().toLowerCase()
    if (laborType === 'direct') return 0.6
    if (laborType === 'support') {
      const supportGoalPPH = getSupportGoalPPH(row)
      return supportGoalPPH > 0 ? 60 / supportGoalPPH : 0
    }

    return 0
  }, [getSupportGoalPPH])

  const aggregateMetrics = useCallback((params: IAggFuncParams) => {
    const leaves = params.rowNode?.allLeafChildren ?? []
    const sumsByKey = new Map<string, {
      directPoints: number
      supportPoints: number
      totalPoints: number
      otherPoints: number
      directHours: number
      supportHours: number
      totalHours: number
      otherHours: number
      directGoalHours: number
      supportGoalHours: number
      totalGoalHours: number
      otherGoalHours: number
    }>()

    for (const leaf of leaves) {
      const data = leaf.data as LocationRow | undefined
      if (!data) continue

      const key = buildPointsKey(data)
      if (!key) continue

      const laborType = String(data.laborType ?? '').trim().toLowerCase()
      const points = getEffectivePoints(data)
      const hours = Number(data.hours) || 0
      const goalRateMPP = getGoalRateMPP(data)
      const goalHours = points > 0 ? (goalRateMPP * points) / 60 : 0
      const bucket = sumsByKey.get(key) ?? {
        directPoints: 0,
        supportPoints: 0,
        totalPoints: 0,
        otherPoints: 0,
        directHours: 0,
        supportHours: 0,
        totalHours: 0,
        otherHours: 0,
        directGoalHours: 0,
        supportGoalHours: 0,
        totalGoalHours: 0,
        otherGoalHours: 0
      }

      if (laborType === 'direct') {
        bucket.directPoints += points
        bucket.directHours += hours
        bucket.directGoalHours += goalHours
      } else if (laborType === 'support') {
        bucket.supportPoints += points
        bucket.supportHours += hours
        bucket.supportGoalHours += goalHours
      } else if (laborType === 'total') {
        bucket.totalPoints += points
        bucket.totalHours += hours
        bucket.totalGoalHours += goalHours
      } else {
        bucket.otherPoints += points
        bucket.otherHours += hours
        bucket.otherGoalHours += goalHours
      }

      sumsByKey.set(key, bucket)
    }

    let points = 0
    let hours = 0
    let goalHours = 0
    for (const bucket of sumsByKey.values()) {
      const pointsValue = Math.max(bucket.directPoints, bucket.supportPoints, bucket.totalPoints) + bucket.otherPoints
      const hoursValue = Math.max(bucket.totalHours, bucket.directHours + bucket.supportHours) + bucket.otherHours
      const goalHoursValue = Math.max(bucket.totalGoalHours, bucket.directGoalHours + bucket.supportGoalHours) + bucket.otherGoalHours

      points += pointsValue
      hours += hoursValue
      goalHours += goalHoursValue
    }

    return {
      points,
      hours,
      goalHours
    }
  }, [buildPointsKey, getEffectivePoints, getGoalRateMPP])

  const pointsAggregation = useCallback((params: IAggFuncParams) => {
    return aggregateMetrics(params).points
  }, [aggregateMetrics])

  const actualRateMPPAggregation = useCallback((params: IAggFuncParams) => {
    const { points, hours } = aggregateMetrics(params)

    const value = points > 0
      ? (hours * 60) / points
      : 0

    return {
      points,
      hours,
      value
    }
  }, [aggregateMetrics])

  const goalRateMPPAggregation = useCallback((params: IAggFuncParams) => {
    const { points, goalHours } = aggregateMetrics(params)
    return points > 0 ? (goalHours * 60) / points : 0
  }, [aggregateMetrics])

  const goalHoursAggregation = useCallback((params: IAggFuncParams) => {
    return aggregateMetrics(params).goalHours
  }, [aggregateMetrics])

  const hoursDeltaAggregation = useCallback((params: IAggFuncParams) => {
    const { hours, goalHours } = aggregateMetrics(params)
    return goalHours - hours
  }, [aggregateMetrics])

  const pctToGoalAggregation = useCallback((params: IAggFuncParams) => {
    const { hours, goalHours } = aggregateMetrics(params)
    return hours > 0 ? (goalHours / hours) * 100 : 0
  }, [aggregateMetrics])

  // Holds the state of the column definitions.
  const colDefs = useMemo<ColDef<LocationRow>[]>(() => [

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
      field: "supportPPHGoal",
      headerName: "Support PPH Goal",
      filter: "agNumberColumnFilter",
      enableValue: true,
      valueGetter: params => Number(params.data?.supportGoalPointsPerHour ?? params.data?.supportPPHGoal) || 0,
      valueFormatter: params => params.value && params.value.toFixed(2)
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
      allowedAggFuncs: ['pointsAggregation'],
      aggFunc: 'pointsAggregation',
      enableValue: true,
      valueGetter: params => getEffectivePoints(params.data),
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
          const points = getEffectivePoints(params.data)

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
          const points = getEffectivePoints(params.data)

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

    {
      colId: 'goalRateMPP',
      headerName: 'Goal Rate',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['goalRateMPPAggregation'],
      aggFunc: 'goalRateMPPAggregation',
      enableValue: true,
      valueGetter: params => getGoalRateMPP(params.data),
      valueFormatter: params => Number(params.value || 0).toFixed(2)
    },

    {
      colId: 'goalHours',
      headerName: 'Goal Hours',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['goalHoursAggregation'],
      aggFunc: 'goalHoursAggregation',
      enableValue: true,
      valueGetter: (params) => {
        const points = getEffectivePoints(params.data)
        const goalRateMPP = getGoalRateMPP(params.data)
        return points > 0 ? (goalRateMPP * points) / 60 : 0
      },
      valueFormatter: params => Number(params.value || 0).toFixed(2)
    },

    {
      colId: 'hoursDelta',
      headerName: 'Hours delta',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['hoursDeltaAggregation'],
      aggFunc: 'hoursDeltaAggregation',
      enableValue: true,
      valueGetter: (params) => {
        const points = getEffectivePoints(params.data)
        const goalRateMPP = getGoalRateMPP(params.data)
        const goalHours = points > 0 ? (goalRateMPP * points) / 60 : 0
        const hours = Number(params.data?.hours) || 0
        return goalHours - hours
      },
      valueFormatter: params => Number(params.value || 0).toFixed(2)
    },

    {
      colId: 'pctToGoal',
      headerName: 'PCT to Goal',
      filter: 'agNumberColumnFilter',
      allowedAggFuncs: ['pctToGoalAggregation'],
      aggFunc: 'pctToGoalAggregation',
      enableValue: true,
      valueGetter: (params) => {
        const points = getEffectivePoints(params.data)
        const goalRateMPP = getGoalRateMPP(params.data)
        const goalHours = points > 0 ? (goalRateMPP * points) / 60 : 0
        const hours = Number(params.data?.hours) || 0
        return hours > 0 ? (goalHours / hours) * 100 : 0
      },
      valueFormatter: params => `${Number(params.value || 0).toFixed(0)}%`
    },

  ], [getEffectivePoints, getGoalRateMPP])

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
    pointsAggregation,
    actualRateMPPAggregation,
    goalRateMPPAggregation,
    goalHoursAggregation,
    hoursDeltaAggregation,
    pctToGoalAggregation
  }), [actualRateMPPAggregation, goalHoursAggregation, goalRateMPPAggregation, hoursDeltaAggregation, pctToGoalAggregation, pointsAggregation])

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
