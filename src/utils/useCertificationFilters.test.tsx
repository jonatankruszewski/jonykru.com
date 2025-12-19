// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { ProviderMap } from './useCertificationFilters'
import { useCertificationFilters } from './useCertificationFilters'

describe('useCertificationFilters', () => {
  const createMockProvidersMap = (): ProviderMap => ({
    provider1: {
      value: false,
      label: 'Provider 1',
      key: 'provider1'
    },
    provider2: {
      value: false,
      label: 'Provider 2',
      key: 'provider2'
    },
    provider3: {
      value: false,
      label: 'Provider 3',
      key: 'provider3'
    }
  })

  it('should initialize with all providers unselected and all=true', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual(providersMap)
  })

  it('should toggle a provider and set all=false when not all are selected', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    act(() => {
      result.current.handleToggleProvider('provider1')
    })

    expect(result.current.all).toBe(false)
    expect(result.current.selectedProviders.provider1.value).toBe(true)
    expect(result.current.selectedProviders.provider2.value).toBe(false)
    expect(result.current.selectedProviders.provider3.value).toBe(false)
  })

  it('should set all=true when all providers are selected', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    act(() => {
      result.current.handleToggleProvider('provider1')
    })
    act(() => {
      result.current.handleToggleProvider('provider2')
    })
    act(() => {
      result.current.handleToggleProvider('provider3')
    })

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual(providersMap)
  })

  it('should set all=true when all providers are deselected (none selected)', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    // First select all
    act(() => {
      result.current.handleToggleProvider('provider1')
    })
    act(() => {
      result.current.handleToggleProvider('provider2')
    })
    act(() => {
      result.current.handleToggleProvider('provider3')
    })

    expect(result.current.all).toBe(true)

    // Then deselect all
    act(() => {
      result.current.handleToggleProvider('provider1')
    })
    act(() => {
      result.current.handleToggleProvider('provider2')
    })
    act(() => {
      result.current.handleToggleProvider('provider3')
    })

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual(providersMap)
  })

  it('should toggle provider off when it is already selected', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    act(() => {
      result.current.handleToggleProvider('provider1')
    })

    expect(result.current.selectedProviders.provider1.value).toBe(true)

    act(() => {
      result.current.handleToggleProvider('provider1')
    })

    expect(result.current.selectedProviders.provider1.value).toBe(false)
  })

  it('should not change state when handleToggleAll is called and all=true', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    const initialProviders = { ...result.current.selectedProviders }
    const initialAll = result.current.all

    act(() => {
      result.current.handleToggleAll()
    })

    expect(result.current.all).toBe(initialAll)
    expect(result.current.selectedProviders).toEqual(initialProviders)
  })

  it('should reset to all providers selected when handleToggleAll is called and all=false', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    // First select only one provider
    act(() => {
      result.current.handleToggleProvider('provider1')
    })

    expect(result.current.all).toBe(false)
    expect(result.current.selectedProviders.provider1.value).toBe(true)

    // Then toggle all
    act(() => {
      result.current.handleToggleAll()
    })

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual(providersMap)
  })

  it('should handle multiple toggles correctly', () => {
    const providersMap = createMockProvidersMap()
    const { result } = renderHook(() => useCertificationFilters(providersMap))

    act(() => {
      result.current.handleToggleProvider('provider1')
    })
    act(() => {
      result.current.handleToggleProvider('provider2')
    })

    expect(result.current.all).toBe(false)
    expect(result.current.selectedProviders.provider1.value).toBe(true)
    expect(result.current.selectedProviders.provider2.value).toBe(true)
    expect(result.current.selectedProviders.provider3.value).toBe(false)

    act(() => {
      result.current.handleToggleProvider('provider3')
    })

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual(providersMap)
  })

  it('should handle empty providers map', () => {
    const emptyMap: ProviderMap = {}
    const { result } = renderHook(() => useCertificationFilters(emptyMap))

    expect(result.current.all).toBe(true)
    expect(result.current.selectedProviders).toEqual({})

    act(() => {
      result.current.handleToggleAll()
    })

    expect(result.current.all).toBe(true)
  })
})

