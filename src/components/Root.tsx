import { ErrorBoundary } from '@/components/ErrorBoundary'
import { HashRouter } from 'react-router-dom'

import { App } from '../main'

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  )
}

export function Root() {
  return (
    <ErrorBoundary fallback={ErrorBoundaryError}>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  )
}
