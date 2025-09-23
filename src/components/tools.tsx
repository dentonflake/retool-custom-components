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
  updatedAt: string
}

type Props = {
  setCurrentGridState: (updates: Retool.SerializableObject) => void
  setSelectedView: (updates: Retool.SerializableObject) => void
  gridStates: State[]
  state: GridState
  view: State | undefined
  setView: (value: React.SetStateAction<State | undefined>) => void
  cargoId: number
}

const Tools = ({ setCurrentGridState, setSelectedView, gridStates, state, view, setView, cargoId }: Props) => {

  // Retool event handlers
  const handleImport = Retool.useEventCallback({ name: "Import" })
  const handleShare = Retool.useEventCallback({ name: "Share" })
  const handleSave = Retool.useEventCallback({ name: "Save" })
  const handleSaveAs = Retool.useEventCallback({ name: "Save As" })

  const handleClickShare = () => {
    setSelectedView(view as Retool.SerializableObject)
    handleShare()
  }

  const handleClickImport = () => {
    handleImport()
  }

  const handleClickSaveAs = () => {
    setCurrentGridState(state as Retool.SerializableObject)
    handleSaveAs()
  }

  const handleClickSave = () => {
    setCurrentGridState(state as Retool.SerializableObject)
    setSelectedView(view as Retool.SerializableObject)
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
          type="secondary"
          text="SHARE"
          onClick={handleClickShare}
          className={styles.share}
        />

        <Button
          type="primary"
          text="IMPORT"
          onClick={handleClickImport}
          className={styles.import}
        />

        <Button
          type="secondary"
          text="SAVE AS"
          onClick={handleClickSaveAs}
          className={styles.saveAs}
        />

        <Button
          type="primary"
          text="SAVE"
          onClick={handleClickSave}
          className={styles.save}
          disabled={cargoId !== view?.createdBy}
        />

      </div>
  )
}

export default Tools