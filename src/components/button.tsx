import styles from '../styles/button.module.css'
import { Retool } from '@tryretool/custom-component-support'
import clsx from 'clsx'

type Props = {
  onClick: () => void,
  type: "primary" | "secondary",
  text: string,
  className: string
}

const Button = ({ onClick, type, text, className }: Props) => {

  return (
    <button
      className={clsx(
        styles.button,
        className,
        type === "primary" ? styles.primary : styles.secondary
      )}
      onClick={onClick}
    >{text}</button>
  )
}

export default Button