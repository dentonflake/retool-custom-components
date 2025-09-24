import styles from '../styles/tools.module.css'
import Button from './button'
import Dropdown from './dropdown'
import { Retool } from '@tryretool/custom-component-support'
import { State, ToolsProps } from '../utils/definitions'
import { useMemo } from 'react'

const Tools = ({ gridRef, gridStates, cargoId }: ToolsProps) => {

  const [rawSelectedGridState, setSelectedGridState] = Retool.useStateObject({ name: "selectedView", inspector: "hidden" })

  const selectedGridState = useMemo(() => rawSelectedGridState as State, [rawSelectedGridState])

  // Retool event handlers
  const handleShare = Retool.useEventCallback({ name: "Share" })
  const handleImport = Retool.useEventCallback({ name: "Import" })
  const handleSaveAs = Retool.useEventCallback({ name: "Save As" })
  const handleSave = Retool.useEventCallback({ name: "Save" })
  
  return (
    <div className={styles.tools}>

        <Dropdown
          gridRef={gridRef}
          className={styles.states}
          gridStates={gridStates}
          selectedGridState={selectedGridState}
          setSelectedGridState={setSelectedGridState}
        />

        <Button
          type="secondary"
          text="SHARE"
          onClick={handleShare}
          className={styles.share}
          disabled={!selectedGridState.name}
        />

        <Button
          type="primary"
          text="IMPORT"
          onClick={handleImport}
          className={styles.import}
        />

        <Button
          type="secondary"
          text="SAVE AS"
          onClick={handleSaveAs}
          className={styles.saveAs}
        />

        <Button
          type="primary"
          text="SAVE"
          onClick={handleSave}
          className={styles.save}
          disabled={cargoId !== selectedGridState?.createdBy}
        />

      </div>
  )
}

export default Tools