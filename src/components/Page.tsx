import { useEffect, type PropsWithChildren } from "react"
import { useNavigate } from "react-router-dom"

export function Page({
  children,
  back = true,
  onBack
}: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
  /**
   * Optional custom back handler for Telegram back button.
   */
  onBack?: () => void
}>) {
  const navigate = useNavigate()

  useEffect(() => {
    if (back) {
      return () => {
        if (onBack) {
          onBack()
        } else {
          navigate(-1)
        }
      }
    }
  }, [back, onBack])

  return <>{children}</>
}
