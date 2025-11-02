import createMiddleware from 'next-intl/middleware'
import { locales } from './i18n'

// NOTE: Auth checks moved to client-side useEffect
// Reason: Cannot access Zustand store from server-side middleware
// Each protected page uses useEffect to check auth and redirect

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'ko',

  // Always show locale prefix for all languages (including Korean)
  localePrefix: 'always',
})

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
