import { useCallback, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { createTheme } from '@tarojs/taro'

export enum EisenhowerQuadrant {
  UrgentImportant = 'urgentImportant',
  NotUrgentImportant = 'notUrgentImportant',
  UrgentNotImportant = 'urgentNotImportant',
  NotUrgentNotImportant = 'notUrgentNotImportant'
}

export const quadrantNames: Record<EisenhowerQuadrant, string> = {
  [EisenhowerQuadrant.UrgentImportant]: 'Do First',
  [EisenhowerQuadrant.NotUrgentImportant]: 'Schedule',
  [EisenhowerQuadrant.UrgentNotImportant]: 'Delegate',
  [EisenhowerQuadrant.NotUrgentNotImportant]: 'Eliminate'
}

export const quadrantDescriptions: Record<EisenhowerQuadrant, string> = {
  [EisenhowerQuadrant.UrgentImportant]: 'Urgent & Important',
  [EisenhowerQuadrant.NotUrgentImportant]: 'Not Urgent & Important',
  [EisenhowerQuadrant.UrgentNotImportant]: 'Urgent & Not Important',
  [EisenhowerQuadrant.NotUrgentNotImportant]: 'Not Urgent & Not Important'
}

export const quadrantChartColors: Record<EisenhowerQuadrant, string> = {
  [EisenhowerQuadrant.UrgentImportant]: '#432818',
  [EisenhowerQuadrant.NotUrgentImportant]: '#6F1D1B',
  [EisenhowerQuadrant.UrgentNotImportant]: '#99582A',
  [EisenhowerQuadrant.NotUrgentNotImportant]: '#BB9457'
}

export function getQuadrantName(quadrant: EisenhowerQuadrant): string {
  return quadrantNames[quadrant] ?? 'Unknown'
}

export function getQuadrantDescription(quadrant: EisenhowerQuadrant): string {
  return quadrantDescriptions[quadrant] ?? 'Unknown'
}

export function getQuadrantColor(quadrant: EisenhowerQuadrant): string {
  switch (quadrant) {
    case EisenhowerQuadrant.UrgentImportant: return '#432818'
    case EisenhowerQuadrant.NotUrgentImportant: return '#6F1D1B'
    case EisenhowerQuadrant.UrgentNotImportant: return '#99582A'
    case EisenhowerQuadrant.NotUrgentNotImportant: return '#BB9457'
  }
  return '#99582A'
}

export function getQuadrantInkColor(quadrant: EisenhowerQuadrant): string {
  return quadrant === EisenhowerQuadrant.NotUrgentNotImportant ? '#432818' : '#FFFFFF'
}

export function getQuadrantChartColor(quadrant: EisenhowerQuadrant): string {
  return quadrantChartColors[quadrant] ?? '#99582A'
}

export function getQuadrantFromFlags(isUrgent: boolean, isImportant: boolean): EisenhowerQuadrant {
  if (isUrgent && isImportant) return EisenhowerQuadrant.UrgentImportant
  if (!isUrgent && isImportant) return EisenhowerQuadrant.NotUrgentImportant
  if (isUrgent && !isImportant) return EisenhowerQuadrant.UrgentNotImportant
  return EisenhowerQuadrant.NotUrgentNotImportant
}

export function getFlagsFromQuadrant(quadrant: EisenhowerQuadrant): [boolean, boolean] {
  switch (quadrant) {
    case EisenhowerQuadrant.UrgentImportant: return [true, true]
    case EisenhowerQuadrant.NotUrgentImportant: return [false, true]
    case EisenhowerQuadrant.UrgentNotImportant: return [true, false]
    case EisenhowerQuadrant.NotUrgentNotImportant: return [false, false]
  }
}

export function useTheme() {
  const systemInfo = Taro.getSystemInfoSync()
  const isDarkMode = systemInfo.theme === 'dark'

  const colors = useMemo(() => {
    if (isDarkMode) {
      return {
        primary: '#BB9457',
        onPrimary: '#432818',
        secondary: '#99582A',
        onSecondary: '#F5EFE7',
        background: '#262729',
        surface: '#1B1B1C',
        surfaceContainer: '#231A14',
        onSurface: '#F5EFE7',
        onSurfaceVariant: '#D7C9B6',
        outline: '#393A41',
        error: '#8F2724',
        onError: '#F5EFE7',
        warning: '#FF9800',
        onWarning: '#432818'
      }
    } else {
      return {
        primary: '#6F1D1B',
        onPrimary: '#EFE3D2',
        secondary: '#99582A',
        onSecondary: '#FFFFFF',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        surfaceContainer: '#EFE3D2',
        onSurface: '#2A1A10',
        onSurfaceVariant: '#3A2A1F',
        outline: '#DDDDDD',
        error: '#6F1D1B',
        onError: '#EFE3D2',
        warning: '#FF9800',
        onWarning: '#432818'
      }
    }
  }, [isDarkMode])

  return { isDarkMode, colors }
}
