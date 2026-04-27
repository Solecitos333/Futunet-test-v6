$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Fix corrupted quotes around undefined
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, ".undefined.", "'undefined'")
    
    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed quotes"