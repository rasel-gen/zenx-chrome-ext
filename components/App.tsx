import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  retrieveLaunchParams,
  useSignal,
  isMiniAppDark,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";

import { routes } from "@/navigation/routes.tsx";
import { Splash } from "@/components/Splash/Splash.tsx";
import { useWalletStore } from "@/stores/wallet";

export function App() {
  const [showSplash, setShowSplash] = useState(true);
  const lp = useMemo(() => retrieveLaunchParams(), []);
  const isDark = useSignal(isMiniAppDark);
  const bootstrap = useWalletStore((s) => s.bootstrap);
  const navigate = useNavigate();
  const location = useLocation();

  // Route guard HOC: require at least one wallet for non-root routes
  const withWalletGuard = (Comp: ComponentType) =>
    function WalletGuarded() {
      const wallets = useWalletStore((s) => s.wallets);
      const loading = useWalletStore((s) => s.loading);
      // Keep current page mounted during loading to preserve local spinners/overlays
      if (loading) return <Comp />;
      if (!wallets || wallets.length === 0) {
        return <Navigate to="/" replace />;
      }
      return <Comp />;
    };

  // Always bootstrap once on initial load.
  // If initial route is '/', redirect to '/dashboard' when wallets already exist.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await bootstrap();
        if (!cancelled && location.pathname === "/") {
          const hasWallets =
            (useWalletStore.getState().wallets || []).length > 0;
          if (hasWallets) navigate("/dashboard", { replace: true });
        }
      } finally {
        if (!cancelled) setShowSplash(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppRoot
      appearance={isDark ? "dark" : "light"}
      platform={["macos", "ios"].includes(lp.tgWebAppPlatform) ? "ios" : "base"}
    >
      {showSplash && (
        <Splash onDone={() => setShowSplash(false)} timeoutMs={999999} />
      )}
      <Routes>
        {routes.map((route) => {
          const Guarded =
            route.path === "/"
              ? route.Component
              : withWalletGuard(route.Component);
          return (
            <Route key={route.path} path={route.path} Component={Guarded} />
          );
        })}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AppRoot>
  );
}
