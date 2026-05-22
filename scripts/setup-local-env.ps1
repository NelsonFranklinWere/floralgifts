# Optional: only use if you prefer .env.local over .env (Next.js loads both; .env.local wins).
# Default: keep all variables in .env at the project root.
Write-Host "Use .env in the project root (already supported). Restart after edits: npm run dev"
Write-Host "For local-only URL override, create .env.local with a single line:"
Write-Host "  NEXT_PUBLIC_BASE_URL=http://localhost:3000"
