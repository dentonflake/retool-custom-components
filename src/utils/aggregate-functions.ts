import { IAggFuncParams } from 'ag-grid-community'

export const distinctCount = (params: IAggFuncParams) => {

  console.log(params)

  const values = params.values || []
  const unique = new Set()

  if (params.rowNode.leafGroup) {
    for (const value of values) {
      if (value !== null) {
        unique.add(value)
      }
    }
  } else {
    for (const value of values) {
      if (value.unique instanceof Set) {
        for (const id of value.unique) {
          unique.add(id);
        }
      }
    }
  }

  return {
    unique,
    value: unique.size,
    toString: () => String(unique.size)
  }
};

export const pphAggregation = (params: IAggFuncParams) => {

  const { points, directHours } = params.values.reduce((acc, value) => {
    acc.points += value.points
    acc.directHours += value.directHours
    return acc
  }, { points: 0, directHours: 0 })

  return {
    points,
    directHours,
    value: directHours > 0 ? points / directHours : 0
  }
}

export const directPercentAggregation = (params: IAggFuncParams) => {

  const { directHours, totalHours } = params.values.reduce((acc, value) => {
    acc.directHours += value.directHours
    acc.totalHours += value.totalHours
    return acc
  }, { directHours: 0, totalHours: 0 })

  return {
    directHours,
    totalHours,
    value: totalHours > 0 ? (directHours / totalHours) * 100 : 0
  }
}

export const indirectPercentAggregation = (params: IAggFuncParams) => {

  const { indirectHours, totalHours } = params.values.reduce((acc, value) => {
    acc.indirectHours += value.indirectHours
    acc.totalHours += value.totalHours
    return acc
  }, { indirectHours: 0, totalHours: 0 })

  return {
    indirectHours,
    totalHours,
    value: totalHours > 0 ? (indirectHours / totalHours) * 100 : 0
  }
}

export const adminPercentAggregation = (params: IAggFuncParams) => {

  const { adminHours, totalHours } = params.values.reduce((acc, value) => {
    acc.adminHours += value.adminHours
    acc.totalHours += value.totalHours
    return acc
  }, { adminHours: 0, totalHours: 0 })

  return {
    adminHours,
    totalHours,
    value: totalHours > 0 ? (adminHours / totalHours) * 100 : 0
  }
}

export const gapPercentAggregation = (params: IAggFuncParams) => {

  const { gapHours, totalHours } = params.values.reduce((acc, value) => {
    acc.gapHours += value.gapHours
    acc.totalHours += value.totalHours
    return acc
  }, { gapHours: 0, totalHours: 0 })

  return {
    gapHours,
    totalHours,
    value: totalHours > 0 ? (gapHours / totalHours) * 100 : 0
  }
}

export const kioskPercent = (params: IAggFuncParams) => {

  const { kioskAssignments, totalAssignments } = params.values.reduce((acc, value) => {
    acc.kioskAssignments += value.kioskAssignments
    acc.totalAssignments += value.totalAssignments
    return acc
  }, { kioskAssignments: 0, totalAssignments: 0 })

  return {
    kioskAssignments,
    totalAssignments,
    value: totalAssignments > 0 ? (kioskAssignments / totalAssignments) * 100 : 0
  }
}

export const proactivePercent = (params: IAggFuncParams) => {
  
  const { proactiveAssignments, totalAssignments } = params.values.reduce((acc, value) => {
    acc.proactiveAssignments += value.proactiveAssignments
    acc.totalAssignments += value.totalAssignments
    return acc
  }, { proactiveAssignments: 0, totalAssignments: 0 })

  return {
    proactiveAssignments,
    totalAssignments,
    value: totalAssignments > 0 ? (proactiveAssignments / totalAssignments) * 100 : 0
  }
}

export const reactivePercent = (params: IAggFuncParams) => {
  
  const { reactiveAssignments, totalAssignments } = params.values.reduce((acc, value) => {
    acc.reactiveAssignments += value.reactiveAssignments
    acc.totalAssignments += value.totalAssignments
    return acc
  }, { reactiveAssignments: 0, totalAssignments: 0 })

  return {
    reactiveAssignments,
    totalAssignments,
    value: totalAssignments > 0 ? (reactiveAssignments / totalAssignments) * 100 : 0
  }
}