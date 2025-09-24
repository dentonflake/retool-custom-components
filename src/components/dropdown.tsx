import { GridState } from 'ag-grid-enterprise'
import styles from '../styles/dropdown.module.css'
import { DropdownProps } from '../utils/definitions'
import { Retool } from '@tryretool/custom-component-support'

const Dropdown = ({ gridRef, gridStates, className, selectedGridState, setSelectedGridState }: DropdownProps) => {

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {

    const selectedState = gridStates.find(gridState => gridState.id === event.target.value)

    if (!selectedState) return

    setSelectedGridState(selectedState as Retool.SerializableObject)

    if (!gridRef.current) return

    const parseGridState = JSON.parse(selectedState.gridState) as GridState

    gridRef.current.api.setState(parseGridState)
  }

  return (
    <select
      className={`${styles.dropdown} ${className}`}
      value={selectedGridState.id || ''}
      onChange={onChange}
    >

      <option value='' disabled>
        Select a view
      </option>

      {gridStates.map((gridState) => (
        <option key={gridState.id} value={gridState.id}>
          {gridState.name}
        </option>
      ))}

    </select>
  )
}

export default Dropdown