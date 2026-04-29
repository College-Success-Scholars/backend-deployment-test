# Ubiquitous Language

## Program mission and scope

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Program** | A University of Maryland support program for Latino, Black, and first-generation undergraduates focused on academic, professional, and personal development. | Initiative |
| **Weekly operational signals** | Weekly data points used to detect risk early and guide interventions, including WAHF, WPL, MCF, attendance, tutoring, and traffic. | Metrics, telemetry |
| **Intervention** | A documented support action taken in response to scholar risk signals. | Outreach, check-in action |
| **Resource support** | Program-provided help that enables scholar success in a university environment. | Services, aid |

## Roles and identities

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Scholar** | Any undergraduate program member, regardless of academic year, tracked for weekly outcomes and support needs. | Student |
| **Team Leader** | A paid program employee role, held by a scholar, responsible for mentee support and weekly leadership compliance duties. | TL |
| **Developer** | A specialized Team Leader role responsible for building and maintaining CSS Atlas. | Engineer-only role |
| **Program Admin** | A program operator who manages team leaders and runs meetings, without weekly scholar form obligations. | Admin lead |
| **Primary Team Leader** | The single accountable Team Leader assigned to a scholar for a given campus week. | Co-owner |
| **Mentee** | A scholar in the context of being supported by a Team Leader through mentorship and MCF reporting. | Student (generic) |

## Weekly memo reporting

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Weekly Memo** | The weekly dashboard view summarizing scholar outcomes, team-leader form compliance, and attendance completion for a selected campus week. | Weekly report, snapshot |
| **Campus Week** | The canonical numbered week used to select and compare weekly operational data. | Sprint week, report period |
| **KPI card** | A metric tile showing a weekly performance indicator and optional trend/substats. | Stat box, widget |
| **Scholar follow-up** | A prioritized scholar row with risk flags and completion percentages that indicates intervention need. | Student risk list, action list |
| **Recognition board** | A curated list of scholars and team leaders highlighted for strong weekly performance. | Shout-outs, highlights |
| **Attendance detail** | Tabular minutes-based completion details by scholar for front desk and study session requirements. | Attendance table, minutes log |
| **Form submissions** | Weekly status summary for required forms across on-time, late, and missing states. | Form compliance, forms status |
| **Scholar follow-up risk** | The finalized weekly decision that a scholar requires active support follow-up. | Risk list |

## Compliance and data terms

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Program member** | A scholar identity enrolled in the program and subject to required weekly policies. | Participant |
| **Front desk completion** | The percentage of required front desk minutes completed by a scholar in the selected week. | FD percent, desk attendance |
| **Study session completion** | The percentage of required study session minutes completed by a scholar in the selected week. | SS percent, study attendance |
| **Form status** | The normalized state of a required form submission: on-time, late, or missing. | Submission state, compliance status |
| **WAHF** | Weekly Academic Honors Form required from all program members that records scholar grade performance. | WHAF, honors form |
| **WPL** | Weekly Project List documenting team-leader hours worked and the work completed during the week. | Project log, work log |
| **MCF** | Mentee Check-in Form submitted by a Team Leader to document a mentee's academic, professional, and personal status and perceived support need. | Check-in note, mentee report |
| **MCF support rating** | A Team Leader's 1-5 rating indicating perceived support need for a mentee, where 3 or higher requires active follow-up. | Risk score |
| **Flag** | A concise risk signal attached to a scholar follow-up row (for example low completion or low grade). | Warning, note |
| **Low-grade alert** | A scholar risk signal indicating academic performance in the low-grade band for the week. | Grade warning, poor grade |
| **Scholar ID** | The canonical scholar identity key (University ID) used across systems, sometimes represented as `uid`. | Name-only identity |

## Time and compliance windows

| Term | Definition | Aliases to avoid |
| --- | --- | --- |
| **Campus Week** | Monday 12:00 AM through Sunday 11:59:59 PM in America/New_York. | Reporting period |
| **WAHF deadline** | Thursday at 11:59 PM America/New_York each campus week. | End-of-week form deadline |
| **WPL deadline** | Friday at 5:00 PM America/New_York each campus week. | Team leader form deadline |
| **MCF deadline** | Friday at 5:00 PM America/New_York each campus week. | Check-in deadline |
| **On-time** | A valid submission received by the form's weekly deadline. | Complete |
| **Late** | A valid submission received after deadline but before the next campus week begins. | Delayed |
| **Missing** | No valid submission received by the campus-week rollover or report cutoff. | Not submitted |

## Relationships

- A **Weekly Memo** is scoped to exactly one **Campus Week**.
- A **Weekly Memo** contains multiple **KPI cards**, one **Recognition board**, one **Attendance detail** section, and one **Form submissions** section.
- A **Scholar** has exactly one **Primary Team Leader** per **Campus Week**, except Team Leaders do not have mentors.
- A **Team Leader** is also a **Scholar** identity but is exempt from required front desk and study-session hours while active in the Team Leader role.
- Every **Program member** must submit **WAHF** each **Campus Week**.
- Every **Team Leader** must submit one weekly **WPL** and one **MCF** per assigned mentee each **Campus Week**.
- **Front desk completion** and **Study session completion** apply to non-Team-Leader freshmen and sophomores.
- **Form submissions** aggregate **Form status** counts for **WAHF**, **WPL**, and **MCF** using timezone-aware ET deadlines.
- If multiple MCFs exist for one scholar in one week, the latest submitted MCF is canonical for current status.
- Missing **MCF** is always a Team Leader compliance issue and is not by itself automatic **Scholar follow-up risk**.
- **Scholar follow-up risk** uses a hybrid model: system-derived baseline plus Team Leader judgment.
- **MCF support rating** of 3, 4, or 5 requires active follow-up for that week.
- Source conflicts resolve by precedence: latest valid record, then approved admin correction, then source-of-record, with full audit history retained.
- A **Low-grade alert** is represented as a **Flag** on **Scholar follow-up**.

## Example dialogue

> **Dev:** "A scholar submitted **WAHF** Thursday at 11:58 PM ET, and their Team Leader submitted **MCF** Friday at 7:10 PM ET with support rating 4. How should this week classify?"
>
> **Domain expert:** "**WAHF** is on-time, **MCF** is late, and the latest MCF support rating triggers **Scholar follow-up risk** because it's 3 or higher."
>
> **Dev:** "If MCF were missing entirely, would that always flag the scholar?"
>
> **Domain expert:** "No. Missing MCF is always a Team Leader compliance issue, but scholar risk still follows the hybrid model."
>
> **Dev:** "And if two MCFs exist this week?"
>
> **Domain expert:** "Use the latest valid submission as canonical and keep history for audit."

## Flagged ambiguities

- "student" and "scholar" are often used interchangeably; use **Scholar** as the canonical term.
- "attendance" is overloaded; specify **Front desk completion** or **Study session completion** explicitly and only when requirement applies.
- "forms" is too broad; name **WAHF**, **WPL**, and/or **MCF** when discussing compliance.
- "WHAF" appears as a variant spelling in code; use **WAHF** as the canonical domain term.
- "scholar_id", "uid", and "University ID" are the same identity concept; standardize on **Scholar ID** in domain language.
