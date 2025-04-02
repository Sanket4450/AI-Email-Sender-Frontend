import { useCallback, useEffect, useState } from 'react'
import lodash from 'lodash'
import { VALUES } from '~/lib/values'
import { normalizeString } from '~/lib/utils'

const { debounce } = lodash

export const useDebounce = (text: string) => {
  const [search, setSearch] = useState('')

  const debouncedSearch = useCallback(
    debounce((searchText: string) => {
      setSearch(normalizeString(searchText))
    }, VALUES.SEARCH_DEBOUNCE_DELAY),
    []
  )

  useEffect(() => {
    debouncedSearch(text)
  }, [text])

  return { search }
}
