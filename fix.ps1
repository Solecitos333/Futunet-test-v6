$files = @(
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\index.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\catalogo.html',
    'c:\Users\Admin\Desktop\Catalogo futune\proyecto_github_pages\js\catalog.js'
)

foreach ($f in $files) {
    $text = [System.IO.File]::ReadAllText($f, [System.Text.Encoding]::UTF8)
    
    $text = $text.Replace("Catǭlogo", "Catálogo")
    $text = $text.Replace("Catlogo", "Catálogo")
    $text = $text.Replace("CatÃ¡logo", "Catálogo")
    $text = $text.Replace("Garanta", "Garantía")
    $text = $text.Replace("tcnico", "técnico")
    $text = $text.Replace("categoras", "categorías")
    $text = $text.Replace("bsqueda", "búsqueda")
    $text = $text.Replace("Subcategoras", "Subcategorías")
    $text = $text.Replace("rea", "Área")
    $text = $text.Replace("ms", "más")
    $text = $text.Replace("especfica", "específica")
    $text = $text.Replace("inters", "interés")
    $text = $text.Replace("seccin", "sección")
    $text = $text.Replace("vaco", "vacío")
    $text = $text.Replace("PAGINACI", "PAGINACIÓN")
    $text = $text.Replace("Tcnica", "Técnica")
    $text = $text.Replace("informacin", "información")
    $text = $text.Replace("tecnologa", "tecnología")
    $text = $text.Replace("Papelera", "Papelería")
    $text = $text.Replace("Energa", "Energía")
    $text = $text.Replace("Climatizacin", "Climatización")
    $text = $text.Replace("Computacin", "Computación")
    $text = $text.Replace("Artculos", "Artículos")
    $text = $text.Replace("cmaras", "cámaras")
    $text = $text.Replace("perifricos", "periféricos")
    $text = $text.Replace("cristalera", "cristalería")
    $text = $text.Replace("cotizacin", "cotización")
    $text = $text.Replace("envame", "envíame")
    $text = $text.Replace("imgenes", "imágenes")
    $text = $text.Replace("Descripcin", "Descripción")
    $text = $text.Replace("Aǧn", "Aún")
    $text = $text.Replace("elǸctrico", "eléctrico")
    $text = $text.Replace("perifǸricos", "periféricos")
    $text = $text.Replace("imǭgenes", "imágenes")
    $text = $text.Replace("Metǭlico", "Metálico")
    $text = $text.Replace("Sofǭ", "Sofá")
    $text = $text.Replace("Repǧblica", "República")

    [System.IO.File]::WriteAllText($f, $text, [System.Text.Encoding]::UTF8)
}
Write-Host "Fixed encoding in all files"