"""Download exact-model laptop photos and prepare Futunet-branded galleries."""

from __future__ import annotations

import html
import io
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageOps


ROOT = Path(__file__).resolve().parents[1]
IMAGE_DIR = ROOT / "img" / "productos" / "laptops"
SOURCE_LOG = IMAGE_DIR / "image-sources.json"
LOGO_PATH = ROOT / "img" / "logo-navbar.webp"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36"
)

MODELS = [
    {"key": "latitude-5410", "query": "Dell Latitude 5410 laptop product photo", "main": "01-dell-latitude-5410.webp"},
    {"key": "latitude-7400", "query": "Dell Latitude 7400 laptop product photo", "main": "02-dell-latitude-7400.webp"},
    {"key": "latitude-5330", "query": "Dell Latitude 5330 laptop product photo", "main": "03-dell-latitude-5330.webp"},
    {"key": "latitude-5490", "query": "Dell Latitude 5490 laptop product photo", "main": "04-dell-latitude-5490-gen8.webp"},
    {"key": "latitude-7390", "query": "Dell Latitude 7390 laptop product photo", "main": "05-dell-latitude-7390.webp"},
    {"key": "latitude-5401", "query": "Dell Latitude 5401 laptop product photo", "main": "07-dell-latitude-5401.webp"},
    {"key": "latitude-3380", "query": "Dell Latitude 3380 laptop product photo", "main": "08-dell-latitude-3380.webp"},
    {"key": "precision-7510", "query": "Dell Precision 7510 mobile workstation product photo", "main": "09-dell-precision-7510.webp"},
    {"key": "zbook-15-g5", "query": "HP ZBook 15 G5 laptop product photo", "main": "10-hp-zbook-15-g5.webp"},
    {"key": "thinkpad-p53s", "query": "Lenovo ThinkPad P53s laptop product photo", "main": "11-lenovo-thinkpad-p53s.webp"},
    {"key": "latitude-5400", "query": "Dell Latitude 5400 laptop product photo", "main": "12-dell-latitude-5400.webp"},
    {"key": "x1-carbon-gen6", "query": "Lenovo ThinkPad X1 Carbon Gen 6 product photo", "main": "13-lenovo-x1-carbon-gen6.webp"},
    {"key": "latitude-e5450", "query": "Dell Latitude E5450 laptop product photo", "main": "14-dell-latitude-e5450.webp"},
    {"key": "thinkpad-p50", "query": "Lenovo ThinkPad P50 laptop product photo", "main": "15-lenovo-thinkpad-p50.webp"},
    {"key": "latitude-e5570", "query": "Dell Latitude E5570 laptop product photo", "main": "16-dell-latitude-e5570.webp"},
    {"key": "latitude-5480", "query": "Dell Latitude 5480 laptop product photo", "main": "17-dell-latitude-5480.webp"},
    {"key": "chromebook-3180", "query": "Dell Chromebook 11 3180 product photo", "main": "18-dell-chromebook-3180.webp"},
    {"key": "x380-yoga", "query": "Lenovo ThinkPad X380 Yoga product photo", "main": "19-lenovo-x380-yoga.webp"},
    {"key": "thinkpad-e14", "query": "Lenovo ThinkPad E14 Gen 1 product photo", "main": "20-lenovo-thinkpad-e14.webp"},
]


def fetch(url: str, *, referer: str | None = None, timeout: int = 25) -> bytes:
    headers = {"User-Agent": USER_AGENT, "Accept": "*/*"}
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return response.read()


def brave_results(query: str) -> list[dict]:
    encoded = urllib.parse.quote(query)
    page_url = f"https://search.brave.com/images?q={encoded}"
    page = subprocess.run(
        ["curl.exe", "-L", "-s", "--fail", "-A", USER_AGENT, page_url],
        check=True,
        capture_output=True,
    ).stdout.decode("utf-8", "ignore")
    found = re.findall(
        r"https?:\\?/\\?/[^\"'\s<>]+?\.(?:jpg|jpeg|png|webp)(?:\?[^\"'\s<>]*)?",
        page,
        flags=re.I,
    )
    results = []
    seen = set()
    for raw_url in found:
        image_url = html.unescape(raw_url.replace("\\/", "/"))
        domain = urllib.parse.urlparse(image_url).netloc.lower()
        if (
            image_url in seen
            or "search.brave.com" in domain
            or "gstatic.com" in domain
            or "i.pcmag.com" in domain
            or "legacy-us-images.foundryco.app" in domain
            or "peachtreecomputers.net" in domain
            or "favicon" in image_url.lower()
            or re.search(r"(?:s-l|w=|width=)(?:1|2|3)\d\d(?:\D|$)", image_url, re.I)
        ):
            continue
        seen.add(image_url)
        results.append({"title": query, "image": image_url, "url": page_url})
    return results


def significant_tokens(query: str) -> list[str]:
    normalized = re.sub(r"[^a-z0-9]+", " ", query.lower())
    ignored = {"laptop", "product", "photo", "mobile", "workstation"}
    return [token for token in normalized.split() if token not in ignored]


def candidate_results(model: dict) -> list[dict]:
    if model["key"] == "x380-yoga":
        manual_urls = [
            "https://www.notebookcheck.net/uploads/tx_nbc2/LenovoThinkPadX380Yoga__6__01.JPG",
            "https://i.pcmag.com/imagery/reviews/02C1t0ewRwNQL5UxxA0l0bB-1.fit_lim.size_810x456.v_1569469936.jpg",
            "https://c1.neweggimages.com/productimage/nb640/A6ABD21102111ZT80.jpg",
        ]
        return [{"title": model["query"], "image": url, "url": model["query"]} for url in manual_urls]
    tokens = significant_tokens(model["query"])
    ranked: list[tuple[int, dict]] = []
    for result in brave_results(model["query"]):
        title = html.unescape(str(result.get("title", ""))).lower()
        image_url = str(result.get("image", ""))
        if model["key"] == "x380-yoga" and (
            "peachtreecomputers.net" in image_url.lower()
            or "m.media-amazon.com" in image_url.lower()
            or "irentmo.com" in image_url.lower()
            or "eazypc.in" in image_url.lower()
        ):
            continue
        if not image_url.startswith(("http://", "https://")):
            continue
        hits = len(tokens)
        penalty = 2 if any(word in title for word in ("battery", "keyboard", "screen replacement", "charger")) else 0
        ranked.append((hits - penalty, result))
    ranked.sort(key=lambda item: item[0], reverse=True)
    return [item[1] for item in ranked]


def decode_image(payload: bytes) -> Image.Image:
    image = Image.open(io.BytesIO(payload))
    image.load()
    if image.width < 500 or image.height < 350:
        raise ValueError(f"Image too small: {image.width}x{image.height}")
    return ImageOps.exif_transpose(image).convert("RGBA")


def add_futunet_brand(source: Image.Image, logo: Image.Image) -> Image.Image:
    canvas = Image.new("RGBA", (1200, 900), (247, 250, 252, 255))
    fitted = ImageOps.contain(source, (1120, 820), Image.Resampling.LANCZOS)
    x = (canvas.width - fitted.width) // 2
    y = (canvas.height - fitted.height) // 2
    if fitted.mode == "RGBA":
        canvas.alpha_composite(fitted, (x, y))
    else:
        canvas.paste(fitted, (x, y))

    logo_copy = logo.copy().convert("RGBA")
    logo_copy.thumbnail((205, 64), Image.Resampling.LANCZOS)
    badge = Image.new("RGBA", (logo_copy.width + 36, logo_copy.height + 28), (255, 255, 255, 224))
    mask = Image.new("L", badge.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, badge.width - 1, badge.height - 1), radius=16, fill=238)
    badge.putalpha(mask)
    badge.alpha_composite(logo_copy, (18, 14))
    canvas.alpha_composite(badge, (28, 28))

    border = ImageDraw.Draw(canvas)
    border.rounded_rectangle((1, 1, 1198, 898), radius=20, outline=(219, 229, 238, 255), width=2)
    return canvas.convert("RGB")


def output_names(main_name: str) -> list[str]:
    stem = Path(main_name).stem
    return [main_name, f"{stem}-02.webp", f"{stem}-03.webp"]


def process_model(model: dict, logo: Image.Image) -> dict:
    candidates = candidate_results(model)
    selected: list[dict] = []
    domains: set[str] = set()
    for result in candidates:
        if len(selected) == 3:
            break
        url = result["image"]
        domain = urllib.parse.urlparse(url).netloc.lower()
        try:
            image = decode_image(fetch(url, referer=result.get("url") or "https://duckduckgo.com/"))
        except Exception as exc:
            print(f"  skip {model['key']}: {domain} ({exc})")
            continue
        if domain in domains and len(candidates) > 4:
            continue
        selected.append({"result": result, "image": image})
        domains.add(domain)

    if len(selected) < 3:
        raise RuntimeError(f"Only {len(selected)} usable images found for {model['query']}")

    filenames = output_names(model["main"])
    sources = []
    for filename, item in zip(filenames, selected):
        branded = add_futunet_brand(item["image"], logo)
        branded.save(IMAGE_DIR / filename, "WEBP", quality=90, method=6)
        result = item["result"]
        sources.append({
            "file": f"img/productos/laptops/{filename}",
            "imageUrl": result["image"],
            "pageUrl": result.get("url", ""),
            "title": html.unescape(str(result.get("title", ""))),
        })
    return {"key": model["key"], "query": model["query"], "sources": sources}


def main() -> None:
    IMAGE_DIR.mkdir(parents=True, exist_ok=True)
    SOURCE_LOG.parent.mkdir(parents=True, exist_ok=True)
    logo = Image.open(LOGO_PATH).convert("RGBA")
    existing = {"models": [], "failures": []}
    if SOURCE_LOG.exists():
        existing = json.loads(SOURCE_LOG.read_text(encoding="utf-8"))
    report_by_key = {item["key"]: item for item in existing.get("models", [])}
    failures = []
    requested = set(sys.argv[1:])
    models = [model for model in MODELS if not requested or model["key"] in requested]
    for index, model in enumerate(models, start=1):
        print(f"[{index}/{len(models)}] {model['query']}")
        try:
            report_by_key[model["key"]] = process_model(model, logo)
        except Exception as exc:
            failures.append({"key": model["key"], "error": str(exc)})
            print(f"  ERROR: {exc}")
        time.sleep(0.25)
    ordered_report = [report_by_key[model["key"]] for model in MODELS if model["key"] in report_by_key]
    SOURCE_LOG.write_text(json.dumps({"models": ordered_report, "failures": failures}, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Completed: {len(ordered_report)} models; failures: {len(failures)}")
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
