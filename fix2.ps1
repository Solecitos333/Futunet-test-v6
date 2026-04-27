$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\home_showcase.js'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    # Revert specific corruptions
    $text = $text -replace 'createIcons', 'createIcons'
    $text = $text -replace 'Catǭlogo', 'Catálogo'
    $text = $text -replace 'Catlogo', 'Catálogo'
    $text = $text -replace 'Ã¡', 'á'
    $text = $text -replace 'Ã©', 'é'
    $text = $text -replace 'Ã­', 'í'
    $text = $text -replace 'Ã³', 'ó'
    $text = $text -replace 'Ãº', 'ú'
    $text = $text -replace 'Ã±', 'ñ'
    $text = $text -replace 'Ã\x81', 'Á'
    $text = $text -replace 'Ã\x89', 'É'
    $text = $text -replace 'Ã\x8D', 'Í'
    $text = $text -replace 'Ã\x93', 'Ó'
    $text = $text -replace 'Ã\x9A', 'Ú'
    $text = $text -replace 'Ã\x91', 'Ñ'
    
    # Generic specific words (using simple string replace to avoid regex issues with weird chars)
    $text = $text.Replace('EnvÃos', 'Envíos')
    $text = $text.Replace('tÃ©cnico', 'técnico')
    $text = $text.Replace('GarantÃa', 'Garantía')
    $text = $text.Replace('AtenciÃ³n', 'Atención')
    $text = $text.Replace('RepÃºblica', 'República')
    $text = $text.Replace('Ã¡gil', 'ágil')
    $text = $text.Replace('AcompaÃ±amiento', 'Acompañamiento')
    $text = $text.Replace('despuÃ©s', 'después')
    $text = $text.Replace('instalaciÃ³n', 'instalación')
    $text = $text.Replace('asesorÃa', 'asesoría')

    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed encoding comprehensively"