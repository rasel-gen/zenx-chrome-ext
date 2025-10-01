import { Splash } from '@/components/Splash/Splash'
import { routes } from '@/navigation/routes'
import { useWalletStore } from '@/stores/wallet'
import { useEffect, useMemo, useState } from 'react'
import type { ComponentType } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

export function App() {
  const [showSplash, setShowSplash] = useState(true)
  const bootstrap = useWalletStore((s) => s.bootstrap)

  // Route guard HOC: require an active keyring for protected routes
  const withWalletGuard = (Comp: ComponentType) =>
    function WalletGuarded() {
      const loading = useWalletStore((s) => s.loading)
      const activeKeyringId = useWalletStore((s) => s.activeKeyringId)
      // Keep current page mounted during loading to preserve local spinners/overlays
      if (loading) return <Comp />
      if (!activeKeyringId) {
        return <Navigate to="/" replace />
      }
      return <Comp />
    }

  // Always bootstrap once on initial load. RootGate decides routing; avoid duplicate navigations here.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await bootstrap()
      } finally {
        if (!cancelled) setShowSplash(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="main-container">
      {showSplash ? (
        <Splash onDone={() => setShowSplash(false)} timeoutMs={999999} />
      ) : (
        <Routes>
          {routes.map((route) => {
            // Only protect routes that actually require a wallet
            const requiresWallet = new Set([
              '/dashboard',
              '/history',
              '/transaction/:id',
              '/settings',
              '/settings/wallets',
              '/settings/backup-email',
              '/settings/passcode',
            ]).has(route.path)
            const Guarded = requiresWallet
              ? withWalletGuard(route.Component)
              : route.Component
            return (
              <Route key={route.path} path={route.path} Component={Guarded} />
            )
          })}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  )
}
