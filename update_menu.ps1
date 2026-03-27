$path = "src\components\admin\Tabs\DashboardTab.jsx"
$content = Get-Content $path
$newContent = @()
foreach ($line in $content) {
    if ($line -match "id: 'user-creation', name: 'User Creation'") {
        $newContent += $line -replace "User Creation", "Users" -replace "UserPlus", "Users"
    } elseif ($line -match "id: 'user-list', name: 'User List'") {
        # Skip user-list line
    } else {
        $newContent += $line
    }
}
$newContent | Set-Content $path -Encoding utf8
