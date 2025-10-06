// @ts-ignore
import videoData from 'data-url:~/assets/public/splash.mp4'
import React, { useEffect, useState } from 'react'

interface SplashProps {
  onDone: () => void
  timeoutMs?: number
}

export const Splash: React.FC<SplashProps> = ({ onDone, timeoutMs = 1500 }) => {
  const [hasEnded, sethasEnded] = useState(false)

  useEffect(() => {
    const t = setTimeout(onDone, timeoutMs)
    return () => clearTimeout(t)
  }, [onDone, timeoutMs])

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden h-full">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={videoData}
        autoPlay
        muted
        playsInline
        onEnded={() => sethasEnded(true)}
        // loop
      />

      {/* typing loading indicator animation */}
      {hasEnded && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
          <div className="flex items-end gap-2">
            <span className="block w-2 h-2 rounded-full bg-[#EBEFF0] dot-bounce"></span>
            <span className="block w-2 h-2 rounded-full bg-[#EBEFF0] dot-bounce dot-delay-500"></span>
            <span className="block w-2 h-2 rounded-full bg-[#EBEFF0] dot-bounce dot-delay-1000"></span>
          </div>
        </div>
      )}
    </div>
  )
}
