import { Splash } from "@/components/Splash/Splash"
import { routes } from "@/navigation/routes"
import { useWalletStore } from "@/stores/wallet"
import { useEffect, useMemo, useState } from "react"
import type { ComponentType } from "react"
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate
} from "react-router-dom"

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const isDark = true // Default to dark theme for wallet extension
  const bootstrap = useWalletStore((s) => s.bootstrap)
  const navigate = useNavigate()
  const location = useLocation()

  // Route guard HOC: require at least one wallet for non-root routes
  const withWalletGuard = (Comp: ComponentType) =>
    function WalletGuarded() {
      const wallets = useWalletStore((s) => s.wallets)
      const loading = useWalletStore((s) => s.loading)
      // Keep current page mounted during loading to preserve local spinners/overlays
      if (loading) return <Comp />
      if (!wallets || wallets.length === 0) {
        return <Navigate to="/" replace />
      }
      return <Comp />
    }

  // Always bootstrap once on initial load.
  // If initial route is '/', redirect to '/dashboard' when wallets already exist.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await bootstrap()
        if (!cancelled && location.pathname === "/") {
          const hasWallets =
            (useWalletStore.getState().wallets || []).length > 0
          if (hasWallets) navigate("/dashboard", { replace: true })
        }
      } finally {
        if (!cancelled) setShowSplash(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className={isDark ? "dark" : ""}>
      {showSplash && (
        <Splash onDone={() => setShowSplash(false)} timeoutMs={999999} />
      )}
      <Routes>
        {routes.map((route) => {
          const Guarded =
            route.path === "/"
              ? route.Component
              : withWalletGuard(route.Component)
          return (
            <Route key={route.path} path={route.path} Component={Guarded} />
          )
        })}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
