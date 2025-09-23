import styles from '../styles/tools.module.css'
import Button from './button'
import Dropdown from './dropdown'
import { Retool } from '@tryretool/custom-component-support'
import { GridState } from 'ag-grid-community'

type State = {
  id: string
  createdBy: number
  name: string
  description: string
  visibility: string
  gridState: string
}

type Props = {
  setCurrentGridState: (updates: Retool.SerializableObject) => void
  setSelectedView: (updates: Retool.SerializableObject) => void
  gridStates: State[]
  state: GridState
  view: State | undefined
  setView: (value: React.SetStateAction<State | undefined>) => void
}

const Tools = ({ setCurrentGridState, setSelectedView, gridStates, state, view, setView }: Props) => {

  // Retool event handlers
  const handleImport = Retool.useEventCallback({ name: "Import" })
  const handleShare = Retool.useEventCallback({ name: "Share" })
  const handleSave = Retool.useEventCallback({ name: "Save" })

  const handleClickImport = () => {
    handleImport()
  }

  const handleClickShare = async () => {
    setSelectedView(view as Retool.SerializableObject)
    handleShare()
  }

  const handleClickSave = () => {
    setCurrentGridState(state as Retool.SerializableObject)
    handleSave()
  }

  return (
    <div className={styles.tools}>

        <Dropdown

          gridStates={gridStates}

          className={styles.states}

          view={view}
          setView={setView}
        />

        <Button
          type="primary"
          text="IMPORT"
          onClick={handleClickImport}
          className={styles.import}
        />

        <Button
          type="secondary"
          text="SHARE"
          onClick={handleClickShare}
          className={styles.share}
        />

        <Button
          type="primary"
          text="SAVE"
          onClick={handleClickSave}
          className={styles.save}
        />

      </div>
  )
}

export default Tools