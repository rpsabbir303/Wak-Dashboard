import type { ServiceCountrySelection } from '@/shared/components/CountryMultiSelect'

/** Must match `ServiceProfileSettings` localStorage key. */
export const SERVICE_PROVIDER_PROFILE_LS_KEY = 'service_settings:profile:v2'

export function emptyServiceCountrySelection(): ServiceCountrySelection {
  return { mode: 'single', allCountries: false, countryCodes: [] }
}

export function normalizeServiceCountrySelection(raw: unknown): ServiceCountrySelection {
  const d = emptyServiceCountrySelection()
  if (!raw || typeof raw !== 'object') return d
  const o = raw as Record<string, unknown>
  return {
    mode: o.mode === 'multi' ? 'multi' : 'single',
    allCountries: Boolean(o.allCountries),
    countryCodes: Array.isArray(o.countryCodes)
      ? o.countryCodes.filter((x): x is string => typeof x === 'string' && x.length > 0)
      : [],
  }
}

/** Reads saved provider service locations for defaulting Add Service, etc. */
export function readServiceLocationFromLocalStorage(): ServiceCountrySelection {
  try {
    const raw = localStorage.getItem(SERVICE_PROVIDER_PROFILE_LS_KEY)
    if (!raw) return emptyServiceCountrySelection()
    const p = JSON.parse(raw) as { serviceLocation?: unknown }
    return normalizeServiceCountrySelection(p?.serviceLocation)
  } catch {
    return emptyServiceCountrySelection()
  }
}
