"""Build a temporary contact sheet for visual QA of laptop galleries."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "img" / "productos" / "laptops"
OUTPUT = ROOT / "tmp" / "laptop-gallery-contact.webp"

files = sorted(
    path for path in IMAGE_DIR.glob("*.webp")
    if "-02" in path.stem or "-03" in path.stem or not path.stem.endswith(("gen7", "touch"))
)
thumb_w, thumb_h, label_h = 240, 180, 28
columns = 4
rows = (len(files) + columns - 1) // columns
sheet = Image.new("RGB", (columns * thumb_w, rows * (thumb_h + label_h)), "white")
draw = ImageDraw.Draw(sheet)

for index, path in enumerate(files):
    image = Image.open(path).convert("RGB")
    thumb = ImageOps.fit(image, (thumb_w, thumb_h), method=Image.Resampling.LANCZOS)
    x = (index % columns) * thumb_w
    y = (index // columns) * (thumb_h + label_h)
    sheet.paste(thumb, (x, y))
    draw.text((x + 6, y + thumb_h + 6), path.stem[:35], fill="#0a3550")

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUTPUT, "WEBP", quality=86, method=6)
print(OUTPUT)
