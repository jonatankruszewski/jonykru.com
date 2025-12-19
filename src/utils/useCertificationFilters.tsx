import { useState } from 'react';

export type ProviderMap = Record<
  string,
  {
    value: boolean
    label: string
    key: string
  }
>

export const useCertificationFilters = (providersMap: ProviderMap) => {
  const [selectedProviders, setSelectedProviders] = useState(providersMap)
  const [all, setAll] = useState(true)

  const handleToggleAll = () => {
    if (all) {
      return
    }

    setSelectedProviders(providersMap)
    setAll(true)
  }

  const handleToggleProvider = (providerKey: string) => {
    const content = { ...selectedProviders[providerKey] }
    content.value = !content.value
    const newProviders = { ...selectedProviders, [providerKey]: content }

    const isAllSelected = Object.values(newProviders).every(
      (providerObj) => providerObj.value
    )
    const isNoneSelected = Object.values(newProviders).every(
      (providerObj) => !providerObj.value
    )

    if (isAllSelected) {
      setAll(true)
      setSelectedProviders(providersMap)
      return
    }

    if (isNoneSelected) {
      setAll(true)
      setSelectedProviders(providersMap)
      return
    }

    setAll(false)
    setSelectedProviders(newProviders)
  }

  return {
    selectedProviders,
    all,
    handleToggleAll,
    handleToggleProvider
  }
}

export default useCertificationFilters

