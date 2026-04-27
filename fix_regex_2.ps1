$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "categor.as", "categorías")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "b.squeda", "búsqueda")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Subcategor.as", "Subcategorías")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, ".rea ", "Área ")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "m.s ", "más ")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "espec.fica", "específica")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "inter.s", "interés")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "secci.n", "sección")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "vac.o", "vacío")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "PAGINACI.N", "PAGINACIÓN")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "T.cnica", "Técnica")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "informaci.n", "información")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "tecnolog.a", "tecnología")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Papeler.a", "Papelería")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Energ.a", "Energía")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Climatizaci.n", "Climatización")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Computaci.n", "Computación")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Art.culos", "Artículos")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "c.maras", "cámaras")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "perif.ricos", "periféricos")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "cristaler.a", "cristalería")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "cotizaci.n", "cotización")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "env.ame", "envíame")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "im.genes", "imágenes")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Descripci.n", "Descripción")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "el.ctrico", "eléctrico")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Met.lico", "Metálico")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Electr.nica", "Electrónica")

    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed remaining regex corruptions"