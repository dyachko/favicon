import { useMemo, useRef, useState } from 'react'
import './App.css'
import './index.css'
import Cropper from 'react-easy-crop'

interface CropArea { x: number; y: number; width: number; height: number }

type Locale = 'en' | 'ru' | 'es' | 'fr' | 'pt'
const SUPPORTED: Locale[] = ['en','ru','es','fr','pt']
const MESSAGES: Record<Locale, Record<string, any>> = {
  en: {
    appTitle: 'Favicon Generator',
    infoTooltip: 'All operations run locally in your browser. No files are uploaded to any server.',
    selectImageTitle: 'Choose image',
    imageSelected: 'Image selected. Click to replace.',
    dragOrClick: 'Drag PNG/JPG/SVG here or click to choose',
    cropTitle: 'Crop 1:1',
    cropHint: 'Choose an image to crop.',
    scale: 'Scale',
    exportTitle: 'Export',
    downloadZip: 'Download ZIP',
    downloadIndividually: 'Download individually',
    sizePNG: (s:number)=> `${s}×${s} PNG`,
    purpose_favicon_small: 'Standard favicon (small)',
    purpose_favicon: 'Standard favicon',
    purpose_legacy: 'Legacy/Win',
    purpose_optional: 'Optional',
    purpose_apple: 'Apple Touch Icon',
    purpose_android: 'Android/Chrome',
    purpose_pwa: 'PWA, Splash',
    downloadOne: (n:string)=> `Download ${n}`,
    lang_en: 'English', lang_ru: 'Русский', lang_es: 'Español', lang_fr: 'Français', lang_pt: 'Português',
    icoLabel: 'favicon.ico',
    purpose_ico: 'ICO container (16/32/48)'
  },
  ru: {
    appTitle: 'Генератор фавиконок',
    infoTooltip: 'Все операции выполняются локально. Файлы не загружаются на сервер.',
    selectImageTitle: 'Выбор изображения',
    imageSelected: 'Изображение выбрано. Нажмите, чтобы заменить.',
    dragOrClick: 'Перетащите PNG/JPG/SVG сюда или нажмите для выбора',
    cropTitle: 'Обрезка до квадрата',
    cropHint: 'Выберите изображение, чтобы кропнуть.',
    scale: 'Масштаб',
    exportTitle: 'Экспорт',
    downloadZip: 'Скачать ZIP',
    downloadIndividually: 'Скачать отдельно',
    sizePNG: (s:number)=> `${s}×${s} PNG`,
    purpose_favicon_small: 'Стандартный favicon (малый)',
    purpose_favicon: 'Стандартный favicon',
    purpose_legacy: 'Legacy/Win',
    purpose_optional: 'Опционально',
    purpose_apple: 'Apple Touch Icon',
    purpose_android: 'Android/Chrome',
    purpose_pwa: 'PWA, Splash',
    downloadOne: (n:string)=> `Скачать ${n}`,
    lang_en: 'English', lang_ru: 'Русский', lang_es: 'Español', lang_fr: 'Français', lang_pt: 'Português',
    icoLabel: 'favicon.ico',
    purpose_ico: 'Контейнер ICO (16/32/48)'
  },
  es: {
    appTitle: 'Generador de favicon',
    infoTooltip: 'Todo se procesa localmente en tu navegador. No se suben archivos al servidor.',
    selectImageTitle: 'Elegir imagen',
    imageSelected: 'Imagen seleccionada. Clic para reemplazar.',
    dragOrClick: 'Arrastra PNG/JPG/SVG aquí o haz clic para elegir',
    cropTitle: 'Recorte 1:1',
    cropHint: 'Elige una imagen para recortar.',
    scale: 'Escala',
    exportTitle: 'Exportar',
    downloadZip: 'Descargar ZIP',
    downloadIndividually: 'Descargar individualmente',
    sizePNG: (s:number)=> `${s}×${s} PNG`,
    purpose_favicon_small: 'Favicon estándar (pequeño)',
    purpose_favicon: 'Favicon estándar',
    purpose_legacy: 'Legacy/Win',
    purpose_optional: 'Opcional',
    purpose_apple: 'Apple Touch Icon',
    purpose_android: 'Android/Chrome',
    purpose_pwa: 'PWA, Splash',
    downloadOne: (n:string)=> `Descargar ${n}`,
    lang_en: 'English', lang_ru: 'Русский', lang_es: 'Español', lang_fr: 'Français', lang_pt: 'Português',
    icoLabel: 'favicon.ico',
    purpose_ico: 'Contenedor ICO (16/32/48)'
  },
  fr: {
    appTitle: 'Générateur de favicon',
    infoTooltip: 'Tout s’exécute localement dans votre navigateur. Aucun fichier n’est envoyé.',
    selectImageTitle: 'Choisir une image',
    imageSelected: 'Image sélectionnée. Cliquez pour remplacer.',
    dragOrClick: 'Glissez PNG/JPG/SVG ici ou cliquez pour choisir',
    cropTitle: 'Recadrage 1:1',
    cropHint: 'Choisissez une image à recadrer.',
    scale: 'Échelle',
    exportTitle: 'Exporter',
    downloadZip: 'Télécharger ZIP',
    downloadIndividually: 'Télécharger individuellement',
    sizePNG: (s:number)=> `${s}×${s} PNG`,
    purpose_favicon_small: 'Favicon standard (petit)',
    purpose_favicon: 'Favicon standard',
    purpose_legacy: 'Legacy/Win',
    purpose_optional: 'Optionnel',
    purpose_apple: 'Apple Touch Icon',
    purpose_android: 'Android/Chrome',
    purpose_pwa: 'PWA, Splash',
    downloadOne: (n:string)=> `Télécharger ${n}`,
    lang_en: 'English', lang_ru: 'Русский', lang_es: 'Español', lang_fr: 'Français', lang_pt: 'Português',
    icoLabel: 'favicon.ico',
    purpose_ico: 'Conteneur ICO (16/32/48)'
  },
  pt: {
    appTitle: 'Gerador de favicon',
    infoTooltip: 'Tudo roda localmente no seu navegador. Nenhum arquivo é enviado.',
    selectImageTitle: 'Escolher imagem',
    imageSelected: 'Imagem selecionada. Clique para substituir.',
    dragOrClick: 'Arraste PNG/JPG/SVG aqui ou clique para escolher',
    cropTitle: 'Corte 1:1',
    cropHint: 'Escolha uma imagem para cortar.',
    scale: 'Escala',
    exportTitle: 'Exportar',
    downloadZip: 'Baixar ZIP',
    downloadIndividually: 'Baixar individualmente',
    sizePNG: (s:number)=> `${s}×${s} PNG`,
    purpose_favicon_small: 'Favicon padrão (pequeno)',
    purpose_favicon: 'Favicon padrão',
    purpose_legacy: 'Legacy/Win',
    purpose_optional: 'Opcional',
    purpose_apple: 'Apple Touch Icon',
    purpose_android: 'Android/Chrome',
    purpose_pwa: 'PWA, Splash',
    downloadOne: (n:string)=> `Baixar ${n}`,
    lang_en: 'English', lang_ru: 'Русский', lang_es: 'Español', lang_fr: 'Français', lang_pt: 'Português',
    icoLabel: 'favicon.ico',
    purpose_ico: 'Contêiner ICO (16/32/48)'
  },
}

function detectLocale(): Locale {
  const prefs = (typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : []) as string[]
  for (const p of prefs) {
    const lower = (p || '').toLowerCase()
    const m = SUPPORTED.find(l => lower.startsWith(l))
    if (m) return m
  }
  return 'en'
}

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [locale, setLocale] = useState<Locale>(detectLocale())

  const t = (key: string, ...args: any[]) => {
    const dict = MESSAGES[locale] ?? MESSAGES.en
    const val = (dict as any)[key]
    return typeof val === 'function' ? val(...args) : val
  }

  const onFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file)
    setImageSrc(dataUrl)
  }

  const onDrop: React.DragEventHandler<HTMLDivElement> = async (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) onFile(f)
  }

  const onSelectFile: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (f) onFile(f)
  }

  const hasImage = !!imageSrc

  return (
    <div className="container">
      <div className="header">
        <div className="brand">
          <img className="avatar" src={`${import.meta.env.BASE_URL}avatar.png`} alt="" />
          <div className="title">{t('appTitle')}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="tooltip">
            <button className="icon-btn help" aria-describedby="tip-local" aria-label={t('infoTooltip')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 10v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="7" r="1.5" fill="currentColor"/>
              </svg>
            </button>
            <div role="tooltip" id="tip-local" className="tooltip-panel">{t('infoTooltip')}</div>
          </div>
          <LangSwitcher locale={locale} setLocale={setLocale} />
        </div>
      </div>

      <div className="grid">
        <div className="card" onDragOver={(e)=>e.preventDefault()} onDrop={onDrop} onClick={()=>fileInputRef.current?.click()} role="button" tabIndex={0} onKeyDown={(e)=>{ if (e.key==='Enter' || e.key===' ') { e.preventDefault(); fileInputRef.current?.click() } }} style={{ cursor: 'pointer' }}>
          <div className="section-title">{t('selectImageTitle')}</div>
          <div className="input">
            {hasImage ? (
              <div>{t('imageSelected')}</div>
            ) : (
              <div>{t('dragOrClick')}</div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*,.svg" onChange={onSelectFile} style={{ display: 'none' }} />
          </div>
        </div>

        <div className="card" style={{ minHeight: 360 }}>
          <div className="section-title">{t('cropTitle')}</div>
          {hasImage ? (
            <div style={{ position: 'relative', width: '100%', height: 300, background: '#000' }}>
              <Cropper
                image={imageSrc!}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels)=> setCroppedAreaPixels(areaPixels as CropArea)}
              />
            </div>
          ) : (
            <div style={{ color: 'var(--muted)' }}>{t('cropHint')}</div>
          )}
          {hasImage && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginTop: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span className="section-title">{t('scale')}</span>
                <input type="range" min={1} max={5} step={0.01} value={zoom} onChange={(e)=> setZoom(Number(e.target.value))} />
              </label>
            </div>
          )}
        </div>

        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="section-title">{t('exportTitle')}</div>
          <ExportButtons imageSrc={imageSrc} cropArea={croppedAreaPixels} locale={locale} />
        </div>
      </div>
    </div>
  )
}

function LangSwitcher({ locale, setLocale }: { locale: Locale; setLocale: (l: Locale)=> void }) {
  const items = SUPPORTED
  return (
    <div className="dropdown" onClick={(e)=>{ const el=e.currentTarget; el.classList.toggle('open') }}>
      <button className="icon-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Language" onClick={(e)=> e.preventDefault()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 3a9 9 0 100 18 9 9 0 000-18Zm0 0c2.5 0 4.5 4 4.5 9s-2 9-4.5 9-4.5-4-4.5-9 2-9 4.5-9Zm-7.5 9h15M4.5 9h15M4.5 15h15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div className="menu-panel" role="menu">
        {items.map((l)=> (
          <button key={l} role="menuitem" className={"menu-item" + (l===locale?" active":"")} onClick={(e)=>{ e.stopPropagation(); setLocale(l); (e.currentTarget.closest('.dropdown') as HTMLElement)?.classList.remove('open') }}>
            <span className="code">{l.toUpperCase()}</span>
            <span className="name">{MESSAGES[l][`lang_${l}`]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CanvasThumb({ src, size, cropArea }: { src: string; size: number; cropArea: CropArea | null }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useMemo(()=>{ renderToCanvas(ref.current, src, size, cropArea) }, [src, size, cropArea])
  return <canvas ref={ref} width={size} height={size} style={{ width: Math.min(size, 128), height: Math.min(size, 128), imageRendering: 'pixelated', borderRadius: 8, border: '1px solid var(--border)' }} />
}

function ExportButtons({ imageSrc, cropArea, locale }: { imageSrc: string | null; cropArea: CropArea | null; locale: Locale }) {
  const t = (key: string, ...args: any[]) => {
    const dict = MESSAGES[locale] ?? MESSAGES.en
    const val = (dict as any)[key]
    return typeof val === 'function' ? val(...args) : val
  }

  const onZip = async () => {
    if (!imageSrc) return
    const files = await generateCorePngs(imageSrc, cropArea)
    const ico = await generateFaviconIco(imageSrc, cropArea, [16,32,48])
    files.push({ name: 'favicon.ico', blob: ico })
    const zipBlob = await importZip(files)
    downloadBlob(zipBlob, `favicons-${timestamp()}.zip`)
  }

  const items = useMemo(() => (
    [
      { size: 16, name: 'favicon-16x16.png', purpose: t('purpose_favicon_small') },
      { size: 32, name: 'favicon-32x32.png', purpose: t('purpose_favicon') },
      { size: 48, name: 'favicon-48x48.png', purpose: t('purpose_legacy') },
      { size: 64, name: 'favicon-64x64.png', purpose: t('purpose_optional') },
      { size: 180, name: 'apple-touch-icon.png', purpose: t('purpose_apple') },
      { size: 192, name: 'android-chrome-192x192.png', purpose: t('purpose_android') },
      { size: 512, name: 'android-chrome-512x512.png', purpose: t('purpose_pwa') },
    ]
  ), [locale])

  const onIco = async () => {
    if (!imageSrc) return
    const ico = await generateFaviconIco(imageSrc, cropArea, [16,32,48])
    downloadBlob(ico, 'favicon.ico')
  }

  const downloadOne = async (size: number, name: string) => {
    if (!imageSrc) return
    const blob = await generatePngOfSize(imageSrc, cropArea, size)
    downloadBlob(blob, name)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display:'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button onClick={onZip} disabled={!imageSrc} style={{ height: 44, padding: '0 18px', fontSize: 15, borderRadius: 12 }}>{t('downloadZip')}</button>
      </div>
      {imageSrc && (
        <>
          <div className="section-title">{t('downloadIndividually')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CanvasThumb src={imageSrc} size={32} cropArea={cropArea} />
                <div>
                  <div style={{ fontWeight: 600 }}>{t('icoLabel')}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 12 }}>{t('purpose_ico')}</div>
                </div>
              </div>
              <button onClick={onIco} aria-label={t('icoLabel')} title={t('icoLabel')} style={{ height: 36, width: 36, display: 'grid', placeItems: 'center', padding: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 21H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            {items.map((it) => (
              <div key={it.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, border: '1px solid var(--border)', borderRadius: 12, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <CanvasThumb src={imageSrc} size={it.size} cropArea={cropArea} />
                  <div>
                    <div style={{ fontWeight: 600 }}>{t('sizePNG', it.size)}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>{it.name} · {it.purpose}</div>
                  </div>
                </div>
                <button onClick={() => downloadOne(it.size, it.name)} aria-label={t('downloadOne', it.name)} title={t('downloadOne', it.name)} style={{ height: 36, width: 36, display: 'grid', placeItems: 'center', padding: 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3v10m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 21H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// utils
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject)=>{
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

async function renderToCanvas(canvas: HTMLCanvasElement | null, src: string, size: number, cropArea: CropArea | null) {
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0,0,canvas.width, canvas.height)

  const img = await createImageBitmap(await (await fetch(src)).blob())
  const source = computeSourceRect(img.width, img.height, cropArea)
  ctx.drawImage(img, source.x, source.y, source.width, source.height, 0, 0, size, size)
}

function computeSourceRect(w: number, h: number, area: CropArea | null) {
  if (!area) {
    const side = Math.min(w, h)
    return { x: (w - side)/2, y: (h - side)/2, width: side, height: side }
  }
  return area
}

async function generateCorePngs(src: string, area: CropArea | null): Promise<Array<{ name: string; blob: Blob }>> {
  const sizes = [16,32,48,64,180,192,512]
  const results: Array<{ name: string; blob: Blob }> = []
  const imgEl = await loadImageElement(src)
  for (const s of sizes) {
    const blob = await renderToPngBlobFromEl(imgEl, area, s)
    const name = nameForSize(s)
    results.push({ name, blob })
  }
  return results
}

async function generatePngOfSize(src: string, area: CropArea | null, size: number): Promise<Blob> {
  const imgEl = await loadImageElement(src)
  return renderToPngBlobFromEl(imgEl, area, size)
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    // best effort for CORS if src is http(s)
    if (/^https?:/i.test(src)) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

async function renderToPngBlobFromEl(img: HTMLImageElement, area: CropArea | null, size: number): Promise<Blob> {
  const source = computeSourceRect(img.naturalWidth, img.naturalHeight, area)
  // Fallback for browsers without OffscreenCanvas
  if (typeof (globalThis as any).OffscreenCanvas === 'undefined') {
    const cnv = document.createElement('canvas')
    cnv.width = size; cnv.height = size
    const ctx = cnv.getContext('2d')!
    ctx.drawImage(img, source.x, source.y, source.width, source.height, 0, 0, size, size)
    const blob = await new Promise<Blob>((resolve) => cnv.toBlob(b => resolve(b!), 'image/png'))
    return blob
  }
  const cnv = new OffscreenCanvas(size, size)
  const ctx = cnv.getContext('2d')!
  ctx.drawImage(img as any, source.x, source.y, source.width, source.height, 0, 0, size, size)
  return await cnv.convertToBlob({ type: 'image/png' })
}


function nameForSize(s: number) {
  if (s === 180) return 'apple-touch-icon.png'
  if (s === 192) return 'android-chrome-192x192.png'
  if (s === 512) return 'android-chrome-512x512.png'
  if (s === 16) return 'favicon-16x16.png'
  if (s === 32) return 'favicon-32x32.png'
  if (s === 48) return 'favicon-48x48.png'
  if (s === 64) return 'favicon-64x64.png'
  return `icon-${s}x${s}.png`
}

async function importZip(files: Array<{ name: string; blob: Blob }>): Promise<Blob> {
  const { zipSync } = await import('fflate')
  const fileMap: Record<string, Uint8Array> = {}
  for (const f of files) {
    const buf = new Uint8Array(await f.blob.arrayBuffer())
    fileMap[f.name] = buf
  }
  const zipped = zipSync(fileMap, { level: 9 })
  return new Blob([zipped], { type: 'application/zip' })
}


// Build favicon.ico by embedding PNG images for sizes (16/32/48/64)
async function generateFaviconIco(src: string, area: CropArea | null, sizes: number[] = [16,32,48,64]): Promise<Blob> {
  const images: { size: number; data: Uint8Array }[] = []
  for (const s of sizes) {
    const blob = await generatePngOfSize(src, area, s)
    const buf = new Uint8Array(await blob.arrayBuffer())
    images.push({ size: s, data: buf })
  }
  const n = images.length
  const headerSize = 6
  const dirSize = 16 * n
  const totalImageBytes = images.reduce((acc, im) => acc + im.data.byteLength, 0)
  const totalSize = headerSize + dirSize + totalImageBytes
  const out = new Uint8Array(totalSize)
  const view = new DataView(out.buffer)

  // Header
  view.setUint16(0, 0, true) // reserved
  view.setUint16(2, 1, true) // ICO type
  view.setUint16(4, n, true) // number of images

  // Directory entries
  let offset = headerSize + dirSize
  for (let i = 0; i < n; i++) {
    const { size, data } = images[i]
    const base = headerSize + i * 16
    out[base + 0] = size === 256 ? 0 : size // width
    out[base + 1] = size === 256 ? 0 : size // height
    out[base + 2] = 0 // color palette
    out[base + 3] = 0 // reserved
    view.setUint16(base + 4, 1, true) // color planes
    view.setUint16(base + 6, 32, true) // bits per pixel
    view.setUint32(base + 8, data.byteLength, true) // size of data
    view.setUint32(base + 12, offset, true) // offset of data
    out.set(data, offset)
    offset += data.byteLength
  }

  return new Blob([out], { type: 'image/x-icon' })
}

let __downloadAnchor: HTMLAnchorElement | null = null
function ensureDownloadAnchor(): HTMLAnchorElement {
  if (!__downloadAnchor) {
    __downloadAnchor = document.createElement('a')
    __downloadAnchor.style.display = 'none'
    document.body.appendChild(__downloadAnchor)
  }
  return __downloadAnchor
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = ensureDownloadAnchor()
  a.href = url
  a.download = filename
  a.click()
  // Revoke with a small delay to ensure the download starts reliably across browsers
  setTimeout(() => URL.revokeObjectURL(url), 500)
}

function timestamp() {
  const d = new Date()
  const p = (n: number, l: number)=> String(n).padStart(l, '0')
  return `${d.getFullYear()}${p(d.getMonth()+1,2)}${p(d.getDate(),2)}-${p(d.getHours(),2)}${p(d.getMinutes(),2)}`
}

export default App
