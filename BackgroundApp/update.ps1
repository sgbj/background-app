$release = Invoke-RestMethod -Uri https://api.github.com/repos/sgbj/background-app/releases/latest
Invoke-RestMethod -Uri $release.assets[0].browser_download_url -OutFile "$Env:TEMP\publish.zip"
Remove-Item "$Env:TEMP\publish" -Recurse -ErrorAction Ignore
Expand-Archive "$Env:TEMP\publish.zip" -DestinationPath "$Env:TEMP" -Force
Remove-Item "$Env:TEMP\publish.zip" -Recurse -ErrorAction Ignore
Stop-Process -Name BackgroundApp -Force -ErrorAction Ignore
Start-Sleep -Seconds 5
Remove-Item $PSScriptRoot -Recurse -ErrorAction Ignore
Copy-Item -Path "$Env:TEMP\publish\*" -Destination $PSScriptRoot -Recurse -Force
Remove-Item "$Env:TEMP\publish" -Recurse -ErrorAction Ignore
Start-Process -WorkingDirectory $PSScriptRoot -FilePath "BackgroundApp.exe"
