$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js'
)

foreach ($f in $files) {
    if (-not (Test-Path $f)) { continue }
    
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)

    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Env.os", "Envíos")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Cobertura .gil", "Cobertura ágil")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Rep.blica", "República")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "t.cnico", "técnico")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Acompa.amiento", "Acompañamiento")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "despu.s", "después")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "instalaci.n", "instalación")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Garant.a", "Garantía")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "asesor.a", "asesoría")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Atenci.n", "Atención")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "lucide.c.reateIcons", "lucide.createIcons")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "Cat.logo", "Catálogo")
    $text = [System.Text.RegularExpressions.Regex]::Replace($text, "cat.logo", "catálogo")

    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed regex corruptions"