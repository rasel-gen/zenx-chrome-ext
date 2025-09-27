import { useCallback, type FC, type MouseEventHandler } from "react"
import { Link as RouterLink, type LinkProps } from "react-router-dom"

export const Link: FC<LinkProps> = ({
  className,
  onClick: propsOnClick,
  to,
  ...rest
}) => {
  const onClick = useCallback<MouseEventHandler<HTMLAnchorElement>>(
    (e) => {
      propsOnClick?.(e)

      // Compute if target path is external. In this case we would like to open
      // link in a new tab for browser extension.
      let path: string
      if (typeof to === "string") {
        path = to
      } else {
        const { search = "", pathname = "", hash = "" } = to
        path = `${pathname}?${search}#${hash}`
      }

      const targetUrl = new URL(path, window.location.toString())
      const currentUrl = new URL(window.location.toString())
      const isExternal =
        targetUrl.protocol !== currentUrl.protocol ||
        targetUrl.host !== currentUrl.host

      if (isExternal) {
        e.preventDefault()
        // Open external links in a new tab for browser extension
        window.open(targetUrl.toString(), "_blank", "noopener,noreferrer")
      }
    },
    [to, propsOnClick]
  )

  return (
    <RouterLink
      {...rest}
      to={to}
      onClick={onClick}
      className={`text-accent hover:text-accent/80 hover:underline transition-colors ${className || ""}`}
    />
  )
}
