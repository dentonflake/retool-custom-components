import styles from '../styles/button.module.css'
import clsx from 'clsx'

type Props = {
  onClick: () => void,
  type: "primary" | "secondary",
  text: string,
  className: string
  disabled?: boolean
}

const Button = ({ onClick, type, text, className, disabled }: Props) => {

  return (
    <button
      className={clsx(
        styles.button,
        className,
        {
          [styles.primary]: type === "primary",
          [styles.secondary]: type === "secondary",
          [styles.disabled]: disabled
        }
      )}
      onClick={disabled ? undefined : onClick}
    >{text}</button>
  )
}

export default Button