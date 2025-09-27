import { BackupEmailPage } from "@/pages/BackupEmailPage/BackupEmailPage"
import { ContactPage } from "@/pages/ContactPage/ContactPage"
import { HistoryPage } from "@/pages/HistoryPage/HistoryPage"
import { IndexPage } from "@/pages/IndexPage/IndexPage"
import { OnboardingPage } from "@/pages/OnboardingPage/OnboardingPage"
import { PasscodePage } from "@/pages/PasscodePage/PasscodePage"
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage/PrivacyPolicyPage"
import { SettingsPage } from "@/pages/SettingsPage/SettingsPage"
import { TransactionDetailsPage } from "@/pages/TransactionDetailsPage/TransactionDetailsPage"
import { WalletsPage } from "@/pages/WalletsPage/WalletsPage"
import type { ComponentType, JSX } from "react"

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [
  { path: "/", Component: OnboardingPage },
  { path: "/dashboard", Component: IndexPage },
  { path: "/history", Component: HistoryPage },
  { path: "/transaction/:id", Component: TransactionDetailsPage },
  { path: "/settings", Component: SettingsPage },
  { path: "/settings/wallets", Component: WalletsPage },
  { path: "/settings/contact", Component: ContactPage },
  { path: "/settings/backup-email", Component: BackupEmailPage },
  { path: "/settings/passcode", Component: PasscodePage },
  { path: "/privacy", Component: PrivacyPolicyPage }
]
