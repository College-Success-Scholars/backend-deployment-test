# components/dashboard/roles

**Location:** [`frontend/components/dashboard/roles/`](../../../../../../frontend/components/dashboard/roles/)  
**Docs:** `docs/dev/frontend/components/dashboard/roles/README.md`

## Navigation

[← Root](../../../../README.md) › [Frontend](../../../README.md) › [components](../../README.md) › [dashboard](../README.md) › roles

---

## Files

| File | Description |
|------|-------------|
| `scholar-dashboard.tsx` | Scholar home — charts + activity log |
| `team-leader-dashboard.tsx` | Team leader home |
| `admin-dashboard.tsx` | Admin home |
| `exec-dashboard.tsx` | Executive home |
| `default-dashboard.tsx` | Fallback for unrecognized roles |

---

## Standards

- Selected by `app/dashboard/page.tsx` via `resolveUserRole()`.
- Import widgets from `dashboard/widgets/` and charts from `components/charts/`.
