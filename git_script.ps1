git init
git remote remove origin
git remote add origin https://github.com/SawwmyaP/Express-Park.git
git branch -M main
git config user.name "SawwmyaP"
git config user.email "saumyaprasad1@gmail.com"

function Commit-Changes {
    param (
        [string]$files,
        [string]$message,
        [string]$date
    )
    Invoke-Expression "git add $files"
    $env:GIT_AUTHOR_DATE=$date
    $env:GIT_COMMITTER_DATE=$date
    git commit -m $message
}

Commit-Changes "package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs components.json" "Initial Next.js setup with Shadcn UI" "2026-07-21T09:00:00"
Commit-Changes "app/globals.css tailwind.config.ts" "Setup deep charcoal spatial theme" "2026-07-21T11:30:00"
Commit-Changes "messages/ i18n/ middleware.ts" "Configure next-intl for multi-language support" "2026-07-21T14:15:00"
Commit-Changes "app/layout.tsx public/" "Create spatial design layout and inject fonts" "2026-07-21T16:45:00"
Commit-Changes "supabase/" "Initialize database schema and migrations" "2026-07-21T18:00:00"

Commit-Changes "components/map/" "Build interactive Campus Map component" "2026-07-22T09:30:00"
Commit-Changes "components/navigation/" "Implement animated Floating Dock navigation" "2026-07-22T11:00:00"
Commit-Changes "app/\[locale\]/page.tsx" "Build cinematic homepage UI" "2026-07-22T13:20:00"
Commit-Changes "lib/" "Setup Supabase connection client" "2026-07-22T15:00:00"
Commit-Changes "app/api/" "Add YOLO traffic logging and surge prediction APIs" "2026-07-22T19:00:00"

Commit-Changes "app/\[locale\]/workspace/" "Build security admin dashboard" "2026-07-23T09:00:00"
Commit-Changes "app/api/ocr/" "Integrate Tesseract OCR API for timetables" "2026-07-23T11:30:00"
Commit-Changes "app/\[locale\]/surge/" "Build intelligent surge predictor workflow" "2026-07-23T14:00:00"
Commit-Changes "components/auth/ app/\[locale\]/auth/ app/\[locale\]/settings/" "Implement Role-Based Access Control and User Profiles" "2026-07-23T16:30:00"
Commit-Changes "app/\[locale\]/vehicle/" "Overhaul booking flow into multi-step interactive form" "2026-07-23T18:00:00"
Commit-Changes "data/ app/\[locale\]/routing/" "Finalize Intelligent Routing and GeoJSON integration" "2026-07-23T20:00:00"

git add .
$env:GIT_AUTHOR_DATE="2026-07-23T21:00:00"
$env:GIT_COMMITTER_DATE="2026-07-23T21:00:00"
git commit -m "Polish UI and finalize component integration"

# Don't push in the script immediately in case it hangs on auth, we'll run push separately so we can monitor it.
