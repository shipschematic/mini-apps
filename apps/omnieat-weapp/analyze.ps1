$pagesDir = "d:\Liberary\figma\food\src\pages"
$results = @()
$mapping = [ordered]@{
  "Account Screen.png" = "account"
  "Account Verification disable resend.png" = "account-verification-disabled"
  "Account Verification.png" = "account-verification"
  "Add New Card-1.png" = "add-card"
  "Add New Card.png" = "add-card"
  "Add Reviews.png" = "add-reviews"
  "Categories.png" = "all-categories"
  "Comments.png" = "comments"
  "Create Account.png" = "sign-up"
  "Edit Profile.png" = "edit-profile"
  "Explore.png" = "explore"
  "Favorite Screen.png" = "favorite"
  "Finish Cooking Screen.png" = "finish-cooking"
  "Forgot Password.png" = "forgot-password"
  "Frame-1.png" = "unknown"
  "Frame-2.png" = "unknown"
  "Frame-3.png" = "unknown"
  "Frame.png" = "unknown"
  "Home - Scroll.png" = "home"
  "Home.png" = "home"
  "Language screen.png" = "language"
  "Live Collaboration Screen Detail.png" = "live-collaboration"
  "Live Cooking.png" = "live-cooking"
  "Notication Screen.png" = "notifications"
  "Notifications Screen.png" = "notifications"
  "Onboarding Screen-1.png" = "onboarding"
  "Onboarding Screen-2.png" = "onboarding"
  "Onboarding Screen-3.png" = "onboarding"
  "Onboarding Screen.png" = "onboarding"
  "Payment Method.png" = "payment-method"
  "Profile Insights Screen.png" = "profile-insights"
  "Profile Screen - Livestream.png" = "profile-livestream"
  "Profile Screen - Recipe.png" = "profile"
  "Profile User.png" = "profile-user"
  "Recipe Detail - Scroll.png" = "recipe-detail"
  "Recipe Detail - Share.png" = "recipe-detail"
  "Recipe Detail.png" = "recipe-detail"
  "Recipe Screen (Drafts).png" = "recipe-drafts"
  "Recipe Screen (My Recipes).png" = "my-recipes"
  "Recipes For You.png" = "recipes-for-you"
  "Reset Email.png" = "reset-email"
  "Reset Password.png" = "reset-password"
  "Reviews.png" = "reviews"
  "Search - Result.png" = "search-result"
  "Search.png" = "search"
  "Setting Screen.png" = "settings"
  "Sign in.png" = "sign-in"
  "Step by step Screen.png" = "step-by-step"
  "Subscribe.png" = "subscribe"
  "Theme screen.png" = "theme"
  "Upload recipe screen.png" = "upload"
}

foreach ($key in $mapping.Keys) {
  $pageName = $mapping[$key]
  $status = "Not Coded"
  if ($pageName -eq "unknown") {
    $status = "Unknown/Not a page"
  } else {
    $path = "$pagesDir\$pageName\index.tsx"
    if (Test-Path $path) {
      $size = (Get-Item $path).length
      if ($size -lt 500) { $status = "Scaffolding" }
      elseif ($size -lt 1500) { $status = "Partially Coded" }
      else { $status = "Coded" }
    }
  }
  $results += [PSCustomObject]@{
    FigmaFile = $key
    PageFolder = $pageName
    Status = $status
  }
}
$results | ConvertTo-Json -Depth 3 | Out-File -FilePath "d:\Liberary\figma\food\analysis_output.json"
