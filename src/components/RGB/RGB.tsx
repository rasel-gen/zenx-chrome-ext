import { bem } from "@/css/bem"
import { classNames } from "@/css/classnames"
import type { FC } from "react"

import "./RGB.css"

const [b, e] = bem("rgb")

export type RGBProps = JSX.IntrinsicElements["div"] & {
  color: string
}

export const RGB: FC<RGBProps> = ({ color, className, ...rest }) => (
  <span {...rest} className={classNames(b(), className)}>
    <i className={e("icon")} style={{ backgroundColor: color }} />
    {color}
  </span>
)
