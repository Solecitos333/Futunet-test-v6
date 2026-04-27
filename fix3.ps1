$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    $text = $text.Replace('Envos', 'Envíos')
    $text = $text.Replace('gil', 'ágil')
    $text = $text.Replace('Repblica', 'República')
    $text = $text.Replace('tcnico', 'técnico')
    $text = $text.Replace('Acompaamiento', 'Acompañamiento')
    $text = $text.Replace('despus', 'después')
    $text = $text.Replace('instalacin', 'instalación')
    $text = $text.Replace('Garanta', 'Garantía')
    $text = $text.Replace('asesora', 'asesoría')
    $text = $text.Replace('Atencin', 'Atención')
    $text = $text.Replace('lucide.createIcons', 'lucide.createIcons')
    $text = $text.Replace('lucide.c?reateIcons', 'lucide.createIcons')

    # Wait, the ` might literally be the character  (U+FFFD).
    # It might also be encoded differently. Let's do regex matching if needed.
    
    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed U+FFFD corruptions"