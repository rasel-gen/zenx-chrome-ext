// @ts-ignore
import videoData from "data-url:~/assets/public/splash.mp4"
import React, { useEffect } from "react"

interface SplashProps {
  onDone: () => void
  timeoutMs?: number
}

export const Splash: React.FC<SplashProps> = ({ onDone, timeoutMs = 1500 }) => {
  useEffect(() => {
    const t = setTimeout(onDone, timeoutMs)
    return () => clearTimeout(t)
  }, [onDone, timeoutMs])

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden ">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={videoData}
        autoPlay
        muted
        playsInline
        loop
      />
    </div>
  )
}
