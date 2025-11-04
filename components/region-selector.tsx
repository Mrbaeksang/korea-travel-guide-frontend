'use client'

import { useState, useMemo } from 'react'
import { REGIONS, type RegionValue, getRegionDisplayName } from '@/lib/regions'

interface RegionSelectorProps {
  value: RegionValue | string | null
  onChange: (value: RegionValue) => void
  disabled?: boolean
}

export function RegionSelector({ value, onChange, disabled = false }: RegionSelectorProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // 검색 필터링
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) {
      return REGIONS
    }

    const query = searchQuery.toLowerCase()
    return REGIONS.map((group) => ({
      ...group,
      regions: group.regions.filter(
        (region) =>
          region.displayName.toLowerCase().includes(query) ||
          group.province.toLowerCase().includes(query)
      ),
    })).filter((group) => group.regions.length > 0)
  }, [searchQuery])

  // 현재 선택된 지역의 시/도 찾기
  const currentProvince = useMemo(() => {
    if (!value) return null
    for (const group of REGIONS) {
      if (group.regions.some((r) => r.value === value)) {
        return group.province
      }
    }
    return null
  }, [value])

  // 표시할 지역 그룹 결정
  const displayGroups = useMemo(() => {
    if (searchQuery.trim()) {
      return filteredGroups
    }
    if (selectedProvince) {
      return REGIONS.filter((g) => g.province === selectedProvince)
    }
    return []
  }, [searchQuery, selectedProvince, filteredGroups])

  return (
    <div className="space-y-4">
      {/* 검색 */}
      <div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="지역 검색 (예: 서울, 경기, 부산...)"
          disabled={disabled}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        />
      </div>

      {/* 현재 선택된 값 표시 */}
      {value && !searchQuery && !selectedProvince && (
        <div className="rounded-lg bg-blue-50 p-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">현재 선택:</span>{' '}
            <span className="font-semibold text-blue-700">{getRegionDisplayName(value)}</span>
            {currentProvince && <span className="text-gray-600"> ({currentProvince})</span>}
          </p>
        </div>
      )}

      {/* 검색 결과가 없을 때 시/도 선택 */}
      {!searchQuery && !selectedProvince && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-gray-700">시/도 선택</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {REGIONS.map((group) => (
              <button
                key={group.province}
                onClick={() => setSelectedProvince(group.province)}
                disabled={disabled}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  currentProvince === group.province
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {group.province}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 지역 선택 */}
      {(selectedProvince || searchQuery) && displayGroups.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">
              {searchQuery ? `검색 결과 (${filteredGroups.reduce((sum, g) => sum + g.regions.length, 0)}개)` : '지역 선택'}
            </h3>
            {selectedProvince && !searchQuery && (
              <button
                onClick={() => setSelectedProvince(null)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ← 시/도 다시 선택
              </button>
            )}
          </div>

          <div className="space-y-4">
            {displayGroups.map((group) => (
              <div key={group.province}>
                {searchQuery && (
                  <h4 className="mb-2 text-xs font-semibold text-gray-500">{group.province}</h4>
                )}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {group.regions.map((region) => (
                    <button
                      key={region.value}
                      onClick={() => {
                        onChange(region.value)
                        setSelectedProvince(null)
                        setSearchQuery('')
                      }}
                      disabled={disabled}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        value === region.value
                          ? 'border-blue-500 bg-blue-600 font-semibold text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                      } disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {region.displayName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색 결과 없음 */}
      {searchQuery && filteredGroups.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">
            &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다.
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700"
          >
            검색 초기화
          </button>
        </div>
      )}
    </div>
  )
}
