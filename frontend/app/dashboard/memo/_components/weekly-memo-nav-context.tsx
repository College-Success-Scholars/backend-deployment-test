"use client"

import { createContext, useContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react"

export type WeeklyMemoNavState = {
  weekStartLabel: string | null
  weekEndLabel: string | null
  weekNumber: number | null
  availableWeeks: number[]
  prevWeek: number | null
  nextWeek: number | null
  currentCampusWeek: number | null
}

const defaultState: WeeklyMemoNavState = {
  weekStartLabel: null,
  weekEndLabel: null,
  weekNumber: null,
  availableWeeks: [],
  prevWeek: null,
  nextWeek: null,
  currentCampusWeek: null,
}

const WeeklyMemoNavContext = createContext<WeeklyMemoNavState>(defaultState)
const WeeklyMemoNavSetterContext = createContext<Dispatch<SetStateAction<WeeklyMemoNavState>> | null>(null)

export function WeeklyMemoNavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WeeklyMemoNavState>(defaultState)

  return (
    <WeeklyMemoNavSetterContext.Provider value={setState}>
      <WeeklyMemoNavContext.Provider value={state}>{children}</WeeklyMemoNavContext.Provider>
    </WeeklyMemoNavSetterContext.Provider>
  )
}

export function useWeeklyMemoNav() {
  return useContext(WeeklyMemoNavContext)
}

export type WeeklyMemoNavSyncProps = {
  weekStartLabel: string
  weekEndLabel: string
  weekNumber: number
  availableWeeks: number[]
  prevWeek: number | null
  nextWeek: number | null
  currentCampusWeek: number | null
}

export function WeeklyMemoNavSync({
  weekStartLabel,
  weekEndLabel,
  weekNumber,
  availableWeeks,
  prevWeek,
  nextWeek,
  currentCampusWeek,
}: WeeklyMemoNavSyncProps) {
  const setState = useContext(WeeklyMemoNavSetterContext)

  useEffect(() => {
    setState?.({
      weekStartLabel,
      weekEndLabel,
      weekNumber,
      availableWeeks,
      prevWeek,
      nextWeek,
      currentCampusWeek,
    })
  }, [weekStartLabel, weekEndLabel, weekNumber, availableWeeks, prevWeek, nextWeek, currentCampusWeek, setState])

  return null
}
