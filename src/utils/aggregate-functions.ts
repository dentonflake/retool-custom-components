import { IAggFuncParams } from 'ag-grid-community'

export const distinctCount = (params: IAggFuncParams) => {

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