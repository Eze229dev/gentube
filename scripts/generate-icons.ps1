Add-Type -AssemblyName System.Drawing

$ErrorActionPreference = "Stop"
$outDir = Join-Path $PSScriptRoot "..\public\icons"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$bg = [System.Drawing.Color]::FromArgb(255, 15, 23, 42)
$fg = [System.Drawing.Color]::FromArgb(255, 255, 255, 255)

function Save-AppIcon {
  param(
    [int]$Size,
    [string]$Path,
    [double]$Scale = 0.62
  )

  $bmp = New-Object System.Drawing.Bitmap $Size, $Size
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $g.Clear($bg)

  $fontSize = [Math]::Max(8, [int]($Size * $Scale))
  $style = [System.Drawing.FontStyle]::Bold
  $unit = [System.Drawing.GraphicsUnit]::Pixel
  $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, $style, $unit)
  $brush = New-Object System.Drawing.SolidBrush $fg
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
  $g.DrawString("R", $font, $brush, $rect, $format)

  $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)

  $g.Dispose()
  $bmp.Dispose()
  $font.Dispose()
  $brush.Dispose()
  $format.Dispose()
}

Save-AppIcon -Size 192 -Path (Join-Path $outDir "icon-192.png") -Scale 0.62
Save-AppIcon -Size 512 -Path (Join-Path $outDir "icon-512.png") -Scale 0.62
Save-AppIcon -Size 192 -Path (Join-Path $outDir "maskable-192.png") -Scale 0.42
Save-AppIcon -Size 512 -Path (Join-Path $outDir "maskable-512.png") -Scale 0.42
Save-AppIcon -Size 180 -Path (Join-Path $outDir "apple-touch-icon.png") -Scale 0.58

Write-Output "Icons written to $outDir"
