import styles from '../styles/dropdown.module.css'

type State = {
  id: string
  createdBy: number
  name: string
  description: string
  visibility: string
  gridState: string
}

type Props = {
  // options: Option[]
  gridStates: State[]
  className?: string
  view: State | undefined
  setView: (value: React.SetStateAction<State | undefined>) => void
}

const Dropdown = ({ gridStates, className, view, setView }: Props) => {

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setView(gridStates.find(gridState => gridState.id === event.target.value))
  }

  return (
    <select
      value={view?.id}
      onChange={onChange}
      className={`${styles.dropdown} ${className}`}
    >
      {gridStates.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  )
}

export default Dropdown