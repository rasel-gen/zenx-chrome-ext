import { BackupEmailPage } from '@/pages/BackupEmailPage/BackupEmailPage'
import { ContactPage } from '@/pages/ContactPage/ContactPage'
import { HistoryPage } from '@/pages/HistoryPage/HistoryPage'
import { IndexPage } from '@/pages/IndexPage/IndexPage'
import { OnboardingPage } from '@/pages/OnboardingPage/OnboardingPage'
import { PasscodePage } from '@/pages/PasscodePage/PasscodePage'
import { PrivacyPolicyPage } from '@/pages/PrivacyPolicyPage/PrivacyPolicyPage'
import { SettingsPage } from '@/pages/SettingsPage/SettingsPage'
import { TransactionDetailsPage } from '@/pages/TransactionDetailsPage/TransactionDetailsPage'
import { WalletsPage } from '@/pages/WalletsPage/WalletsPage'
import { useWalletStore } from '@/stores/wallet'
import type { ComponentType, JSX } from 'react'
import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

const RootGate: ComponentType = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const loading = useWalletStore((s) => s.loading)
  const activeKeyringId = useWalletStore((s) => s.activeKeyringId)
  const redirectedRef = useRef(false)
  useEffect(() => {
    if (loading || redirectedRef.current) return
    const target = activeKeyringId ? '/dashboard' : '/onboarding'
    if (location.pathname !== target) {
      redirectedRef.current = true
      navigate(target, { replace: true })
    }
  }, [loading])
  return null
}

export const routes: Route[] = [
  // Root decides after store bootstrap
  { path: '/', Component: RootGate },
  // Default route will be decided after bootstrap; keep onboarding at '/onboarding'
  { path: '/onboarding', Component: OnboardingPage },
  { path: '/dashboard', Component: IndexPage },
  { path: '/history', Component: HistoryPage },
  { path: '/transaction/:id', Component: TransactionDetailsPage },
  { path: '/settings', Component: SettingsPage },
  { path: '/settings/wallets', Component: WalletsPage },
  { path: '/settings/contact', Component: ContactPage },
  { path: '/settings/backup-email', Component: BackupEmailPage },
  { path: '/settings/passcode', Component: PasscodePage },
  { path: '/privacy', Component: PrivacyPolicyPage },
]
