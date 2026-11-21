# fix-git-history.ps1
# Run this script from inside any Git repository (or its subfolders) to rewrite history.

# 1. Switch to the folder where the script is located
if ($PSScriptRoot) {
    Set-Location $PSScriptRoot
}

# 2. Check if we are inside a Git repository and find the root path
$gitRoot = git rev-parse --show-toplevel 2>$null
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrEmpty($gitRoot)) {
    Write-Host "Error: Not a Git repository! Run this script from inside a Git project directory." -ForegroundColor Red
    exit 1
}

# 3. Always change location to the Git repository root (required for filter-branch)
Set-Location $gitRoot
Write-Host "Detected Git Repository Root: $gitRoot" -ForegroundColor Gray

$correctName = "shipblueprint"
$correctEmail = "277294256+shipblueprint@users.noreply.github.com"

# Check if there are unstaged changes in tracked files
$dirtyTracked = git status --porcelain | Where-Object { $_ -match '^[ MADRCU]' -or $_ -match '^.[MADRCU]' }
$hasChanges = -not [string]::IsNullOrEmpty($dirtyTracked)

if ($hasChanges) {
    Write-Host "Working directory has unstaged/staged changes. Temporarily stashing them..." -ForegroundColor Yellow
    git stash | Out-Null
}

Write-Host "1. Configuring local repository settings..." -ForegroundColor Cyan
git config user.name $correctName
git config user.email $correctEmail
Write-Host "   Set local user.name to:  $correctName" -ForegroundColor Green
Write-Host "   Set local user.email to: $correctEmail" -ForegroundColor Green

# 4. Identify the active branch
$branch = git branch --show-current
if ([string]::IsNullOrEmpty($branch)) {
    Write-Host "Error: Could not determine current branch. Please ensure you have at least one commit." -ForegroundColor Red
    if ($hasChanges) {
        Write-Host "Restoring stashed changes..." -ForegroundColor Yellow
        git stash pop | Out-Null
    }
    exit 1
}

Write-Host "`n2. Rewriting commit history on branch: $branch..." -ForegroundColor Cyan
# Suppress the deprecation warning for filter-branch
$env:FILTER_BRANCH_SQUELCH_WARNING = 1

# Execute the history rewrite for all commits in all branches/tags
git filter-branch -f --env-filter "
export GIT_AUTHOR_NAME='$correctName'
export GIT_AUTHOR_EMAIL='$correctEmail'
export GIT_COMMITTER_NAME='$correctName'
export GIT_COMMITTER_EMAIL='$correctEmail'
" --tag-name-filter cat -- --branches --tags

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nError: Git history rewrite failed!" -ForegroundColor Red
} else {
    Write-Host "`n3. Verification: Updated commit log (last 5 commits):" -ForegroundColor Cyan
    git log -n 5 --pretty=format:"%h - %an <%ae> : %s"
    Write-Host ""
    Write-Host "🎉 Success! Your repository history has been corrected." -ForegroundColor Green
    Write-Host "To update GitHub, run the following command in your terminal:" -ForegroundColor Yellow
    Write-Host "   git push origin $branch --force --tags`n" -ForegroundColor Cyan
}

# 5. Restore stashed changes if any
if ($hasChanges) {
    Write-Host "4. Restoring stashed changes..." -ForegroundColor Yellow
    git stash pop | Out-Null
}
