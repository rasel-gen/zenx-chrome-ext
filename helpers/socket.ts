import { io, Socket } from "socket.io-client"

const WS_BASE = process.env.PLASMO_PUBLIC_API_BASE || "/"

function getLaunchData(): string {
  try {
    const lp = {}
    const data = (lp as any)?.tgWebAppData ?? (lp as any)?.initDataRaw
    if (typeof data === "string" && data.length > 0) return data
    if (data && typeof data === "object") {
      try {
        const usp = new URLSearchParams()
        Object.entries(data as Record<string, unknown>).forEach(
          ([key, value]) => {
            let v: string = ""
            if (key === "auth_date") {
              if (value instanceof Date) {
                v = String(Math.floor(value.getTime() / 1000))
              } else if (typeof value === "number") {
                v = String(Math.floor(value))
              } else if (typeof value === "string") {
                const asNum = Number(value)
                if (!Number.isNaN(asNum) && asNum > 0) {
                  v = String(Math.floor(asNum))
                } else {
                  const ms = Date.parse(value)
                  v = Number.isNaN(ms) ? "" : String(Math.floor(ms / 1000))
                }
              }
            } else if (key === "user") {
              v = typeof value === "string" ? value : JSON.stringify(value)
            } else {
              v = typeof value === "string" ? value : JSON.stringify(value)
            }
            if (v !== "") usp.append(key, v)
          }
        )
        const str = usp.toString()
        if (str) return str
      } catch {}
    }
  } catch {}
  // @ts-ignore
  const tg = (window as any)?.Telegram?.WebApp
  return typeof tg?.initData === "string" ? tg.initData : ""
}

export function createSocket(): Socket {
  return io(WS_BASE, {
    transports: ["websocket"],
    auth: { telegramLaunchData: getLaunchData() }
  })
}
