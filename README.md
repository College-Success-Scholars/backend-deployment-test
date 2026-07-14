# CSS Atlas

Full-stack scholar-management platform (Express API + Next.js frontend + shared TypeScript library).

**Developer handbook (GitHub Pages):** after the Docs workflow deploys, browse the published site (repo Settings → Pages). Source markdown lives in [`docs/dev/`](docs/dev/README.md). Local preview:

```bash
npm ci
pip install -r requirements-docs.txt
npm run docs:serve
```

**Enable Pages once:** Settings → Pages → Source = **GitHub Actions**. The [Docs](.github/workflows/docs.yml) workflow deploys on pushes to `develop`.

## Packages

| Path | Role |
|------|------|
| [`backend/`](backend/) | Express + TypeScript REST API |
| [`frontend/`](frontend/) | Next.js 16 web app |
| [`shared/`](shared/) | Shared TypeScript utilities |
| [`docs/`](docs/dev/README.md) | Handbook + agent docs |
