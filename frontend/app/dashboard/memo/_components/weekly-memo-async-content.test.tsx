import React from "react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

const {
  mockGetWeeklyMemoPageData,
  mockWeeklyMemoNavSync,
  mockWeeklyKpiCards,
  mockTeamLeaderPerformanceTable,
  mockScholarFollowUpTable,
  mockRecognitionBoardSection,
  mockFullAttendanceDetailSection,
  mockFormSubmissionsSection,
} = vi.hoisted(() => ({
  mockGetWeeklyMemoPageData: vi.fn(),
  mockWeeklyMemoNavSync: vi.fn(() => null),
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

vi.mock("../_lib/memo-source", () => ({
  backendMemoSource: {
    getWeeklyMemoPageData: mockGetWeeklyMemoPageData,
  },
}))

vi.mock("./weekly-memo-nav-context", () => ({
  WeeklyMemoNavSync: mockWeeklyMemoNavSync,
}))

vi.mock("./weekly-kpi-cards", () => ({
  WeeklyKpiCards: mockWeeklyKpiCards,
}))

vi.mock("./team-leader-performance-table", () => ({
  TeamLeaderPerformanceTable: mockTeamLeaderPerformanceTable,
}))

vi.mock("./scholar-follow-up-table", () => ({
  ScholarFollowUpTable: mockScholarFollowUpTable,
}))

vi.mock("./recognition-board-section", () => ({
  RecognitionBoardSection: mockRecognitionBoardSection,
}))

vi.mock("./full-attendance-detail-section", () => ({
  FullAttendanceDetailSection: mockFullAttendanceDetailSection,
}))

vi.mock("./form-submissions-section", () => ({
  FormSubmissionsSection: mockFormSubmissionsSection,
}))

import { WeeklyMemoAsyncContent } from "./weekly-memo-async-content"

const renderAsyncContent = async (props: { weekParam?: string } = {}) => {
  const element = await WeeklyMemoAsyncContent(props)
  renderToStaticMarkup(element)
}

const buildMemoData = (overrides: Record<string, unknown> = {}) => ({
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
  ...overrides,
})

describe("WeeklyMemoAsyncContent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("calls memo source with week param", async () => {
    mockGetWeeklyMemoPageData.mockResolvedValue(buildMemoData())

    await WeeklyMemoAsyncContent({ weekParam: "7" })
    await WeeklyMemoAsyncContent({ weekParam: undefined })

    expect(mockGetWeeklyMemoPageData).toHaveBeenNthCalledWith(1, "7")
    expect(mockGetWeeklyMemoPageData).toHaveBeenNthCalledWith(2, undefined)
  })

  it("syncs sparse week navigation metadata to header context", async () => {
    mockGetWeeklyMemoPageData.mockResolvedValue(
      buildMemoData({
        selectedWeekNum: 5,
        currentCampusWeek: 7,
        trafficWeeklyData: [
          { weekNumber: 4, entryCount: 70 },
          { weekNumber: 6, entryCount: 90 },
        ],
      })
    )

    await renderAsyncContent({})

    expect(mockWeeklyMemoNavSync).toHaveBeenCalledWith(
      expect.objectContaining({
        weekNumber: 5,
        weekStartLabel: "Apr 1",
        weekEndLabel: "Apr 7",
        availableWeeks: [4, 5, 6, 7],
        prevWeek: 4,
        nextWeek: 6,
        currentCampusWeek: 7,
      }),
      undefined
    )
  })

  it("passes transformed props to section components", async () => {
    mockGetWeeklyMemoPageData.mockResolvedValue(buildMemoData())

    await renderAsyncContent({})

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
