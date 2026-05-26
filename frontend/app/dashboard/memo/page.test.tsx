import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

const {
  mockGetWeeklyMemoPageData,
  mockWeeklyMemoHeader,
  mockWeeklyKpiCards,
  mockTeamLeaderPerformanceTable,
  mockScholarFollowUpTable,
  mockRecognitionBoardSection,
  mockFullAttendanceDetailSection,
  mockFormSubmissionsSection,
} = vi.hoisted(() => ({
  mockGetWeeklyMemoPageData: vi.fn(),
  mockWeeklyMemoHeader: vi.fn(() => React.createElement("section", { "data-testid": "weekly-memo-header" })),
  mockWeeklyKpiCards: vi.fn(() => React.createElement("section", { "data-testid": "weekly-kpi-cards" })),
  mockTeamLeaderPerformanceTable: vi.fn(() =>
    React.createElement("section", { "data-testid": "team-leader-performance-table" })
  ),
  mockScholarFollowUpTable: vi.fn(() => React.createElement("section", { "data-testid": "scholar-follow-up-table" })),
  mockRecognitionBoardSection: vi.fn(() => React.createElement("section", { "data-testid": "recognition-board-section" })),
  mockFullAttendanceDetailSection: vi.fn(() =>
    React.createElement("section", { "data-testid": "full-attendance-detail-section" })
  ),
  mockFormSubmissionsSection: vi.fn(() => React.createElement("section", { "data-testid": "form-submissions-section" })),
}))

vi.mock("./_lib/memo-source", () => ({
  backendMemoSource: {
    getWeeklyMemoPageData: mockGetWeeklyMemoPageData,
  },
}))

vi.mock("./_components/weekly-memo-header", () => ({
  WeeklyMemoHeader: mockWeeklyMemoHeader,
}))

vi.mock("./_components/weekly-kpi-cards", () => ({
  WeeklyKpiCards: mockWeeklyKpiCards,
}))

vi.mock("./_components/team-leader-performance-table", () => ({
  TeamLeaderPerformanceTable: mockTeamLeaderPerformanceTable,
}))

vi.mock("./_components/scholar-follow-up-table", () => ({
  ScholarFollowUpTable: mockScholarFollowUpTable,
}))

vi.mock("./_components/recognition-board-section", () => ({
  RecognitionBoardSection: mockRecognitionBoardSection,
}))

vi.mock("./_components/full-attendance-detail-section", () => ({
  FullAttendanceDetailSection: mockFullAttendanceDetailSection,
}))

vi.mock("./_components/form-submissions-section", () => ({
  FormSubmissionsSection: mockFormSubmissionsSection,
}))

import WeeklyMemoPage from "./page"

type MockMemoData = Awaited<ReturnType<typeof buildMemoData>>

const buildMemoData = async (overrides: Partial<Awaited<ReturnType<typeof buildMemoDataBase>>> = {}) => {
  const base = await buildMemoDataBase()
  return { ...base, ...overrides }
}

const buildMemoDataBase = async () => ({
  scholars: [
    {
      uid: "2024-001",
      scholar_name: "Alice Scholar",
      fd_pct: 95,
      ss_pct: 91,
      fd_required: 120,
      ss_required: 120,
    },
    {
      uid: "2023-010",
      scholar_name: "Bob Scholar",
      fd_pct: 50,
      ss_pct: 70,
      fd_required: 120,
      ss_required: 120,
    },
  ],
  teamLeaders: [],
  pieData: { mcf: 0, wpl: 0, whaf: 0 },
  formCompletionOverall: {
    whaf_completed: 1,
    whaf_required: 2,
    wpl_completed: 2,
    wpl_required: 2,
    mcf_completed: 1,
    mcf_required: 2,
  },
  completedStudy: [
    { scholarName: "Alice Scholar", durationMs: 60 * 60 * 1000 },
    { scholarName: "Bob Scholar", durationMs: 20 * 60 * 1000 },
  ],
  completedFd: [
    { scholarName: "Alice Scholar", durationMs: 90 * 60 * 1000 },
    { scholarName: "Bob Scholar", durationMs: 45 * 60 * 1000 },
  ],
  trafficWeeklyData: [
    { weekNumber: 4, entryCount: 80 },
    { weekNumber: 5, entryCount: 100 },
  ],
  trafficEntryCountForSelectedWeek: 100,
  trafficSessions: [{ id: "session-1" }],
  tutorReports: [{ id: "report-1" }],
  gradeBreakdown: { low: [{ scholar_name: "Bob Scholar" }] },
  whafDonut: { total: 0, completeCount: 0, lateCount: 0, percentComplete: 0 },
  teamLeaderFormStats: [
    {
      name: "TL One",
      mcf_completed: 0,
      mcf_required: 1,
      mcf_late: false,
      wpl_completed: 1,
      wpl_required: 1,
      wpl_late: false,
      whaf_completed: 1,
      whaf_required: 1,
      whaf_late: false,
      whaf_pct: 100,
      wpl_pct: 100,
      mcf_pct: 0,
    },
  ],
  weekLabel: "Apr 1 - Apr 7",
  currentCampusWeek: 6,
  selectedWeekNum: 5,
})

const renderPage = async (searchParams: { week?: string }) => {
  const page = await WeeklyMemoPage({ searchParams: Promise.resolve(searchParams) })
  return renderToStaticMarkup(page)
}

describe("dashboard memo page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("calls backendGet with base endpoint and weekNum query when provided", async () => {
    const data = await buildMemoData()
    mockGetWeeklyMemoPageData.mockResolvedValue(data)

    await renderPage({ week: "7" })
    await renderPage({})

    expect(mockGetWeeklyMemoPageData).toHaveBeenNthCalledWith(1, "7")
    expect(mockGetWeeklyMemoPageData).toHaveBeenNthCalledWith(2, undefined)
  })

  it("passes invalid week query values through to source adapter", async () => {
    const data = await buildMemoData()
    mockGetWeeklyMemoPageData.mockResolvedValue(data)

    await renderPage({ week: "abc" })

    expect(mockGetWeeklyMemoPageData).toHaveBeenCalledWith("abc")
  })

  it("computes previous and next week navigation for the header", async () => {
    const data = await buildMemoData({
      selectedWeekNum: 5,
      currentCampusWeek: 7,
      trafficWeeklyData: [
        { weekNumber: 4, entryCount: 70 },
        { weekNumber: 6, entryCount: 90 },
      ],
    })
    mockGetWeeklyMemoPageData.mockResolvedValue(data)

    await renderPage({})

    expect(mockWeeklyMemoHeader).toHaveBeenCalledTimes(1)
    expect(mockWeeklyMemoHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        weekNumber: 5,
        prevWeek: 4,
        nextWeek: 6,
      }),
      undefined
    )
  })

  it("uses currentCampusWeek as nextWeek when it is beyond traffic weeks", async () => {
    const data = await buildMemoData({
      selectedWeekNum: 6,
      currentCampusWeek: 7,
      trafficWeeklyData: [{ weekNumber: 5, entryCount: 90 }],
    })
    mockGetWeeklyMemoPageData.mockResolvedValue(data)

    await renderPage({})

    expect(mockWeeklyMemoHeader).toHaveBeenCalledWith(
      expect.objectContaining({
        weekNumber: 6,
        prevWeek: 5,
        nextWeek: 7,
      }),
      undefined
    )
  })

  it("adapts memo data and passes transformed props to section components", async () => {
    const data: MockMemoData = await buildMemoData()
    mockGetWeeklyMemoPageData.mockResolvedValue(data)

    await renderPage({})

    expect(mockWeeklyKpiCards).toHaveBeenCalledWith(
      expect.objectContaining({
        cards: expect.arrayContaining([
          expect.objectContaining({ title: "Visits this week", primaryValue: "100" }),
          expect.objectContaining({ title: "Front desk completion", primaryValue: "67%" }),
        ]),
      }),
      undefined
    )

    expect(mockTeamLeaderPerformanceTable).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: [expect.objectContaining({ leaderName: "TL One", mcf: "missing", wpl: "on-time", wahf: "on-time" })],
      }),
      undefined
    )

    expect(mockScholarFollowUpTable).toHaveBeenCalledWith(
      expect.objectContaining({
        rows: [
          expect.objectContaining({
            scholarName: "Bob Scholar",
            flags: expect.arrayContaining(["Low front desk completion", "Low study session completion", "Low grade"]),
          }),
        ],
      }),
      undefined
    )

    expect(mockRecognitionBoardSection).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          items: expect.arrayContaining(["Alice Scholar - Strong completion this week"]),
        }),
      }),
      undefined
    )

    expect(mockFullAttendanceDetailSection).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tabs: expect.arrayContaining([
            expect.objectContaining({ id: "front-desk" }),
            expect.objectContaining({ id: "study-sessions" }),
          ]),
        }),
      }),
      undefined
    )

    expect(mockFormSubmissionsSection).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          summaries: expect.arrayContaining([expect.objectContaining({ form: "MCF", missing: 1 })]),
        }),
      }),
      undefined
    )
  })
})
