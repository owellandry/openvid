# Marketing + Auth (Premium Clean) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediseñar el marketing + auth con estética dark premium y acento ámbar, priorizando el CTA “Subir video”, sin modificar el UI del editor.

**Architecture:** Mantener App Router y componentes existentes, pero reestilizar y re-jerarquizar piezas de marketing (Header/Hero/sections) y auth (Login/Donate/Legal). Introducir un nuevo variant de Button para marketing (accent ámbar) para no impactar el editor.

**Tech Stack:** Next.js App Router, React 19, next-intl, Tailwind CSS v4, shadcn/ui (button + tokens CSS).

---

## 0) Preparación y verificación base

### Task 0: Confirmar baseline y herramientas

**Files:** (sin cambios)

- [ ] **Step 1: Instalar deps**

Run:

```bash
bun install
```

Expected: exit code 0.

- [ ] **Step 2: Correr el proyecto**

Run:

```bash
bun run dev --port 3000
```

Expected: server listo en http://localhost:3000.

- [ ] **Step 3: Verificar build/lint (baseline)**

Run:

```bash
bun run lint
bun run build
```

Expected: exit code 0 en ambos.

---

## 1) Foundation: CTA ámbar sin afectar editor

### Task 1: Agregar variant `accent` al Button (marketing)

**Files:**
- Modify: [button.tsx](file:///workspace/components/ui/button.tsx)

- [ ] **Step 1: Actualizar `buttonVariants` para incluir `accent`**

Reemplazar el objeto `variant` agregando `accent` (y mantener el resto igual):

```ts
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap squircle-element text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        primary: "bg-gradient-primary text-primary hover:bg-bg-gradient-primary/90 dark:hover:bg-gradient-primary/50",
        accent: "bg-amber-500 text-black hover:bg-amber-400 focus-visible:ring-amber-400/40",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 squircle-element px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 squircle-element gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 squircle-element px-6 has-[>svg]:px-4",
        xl: "h-14 squircle-element px-10 has-[>svg]:px-8",
        icon: "size-9",
        "icon-xs": "size-6 squircle-element [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

- [ ] **Step 2: Verificar TypeScript/build**

Run:

```bash
bun run build
```

Expected: build OK.

- [ ] **Step 3: Commit**

```bash
git add components/ui/button.tsx
git commit -m "feat(ui): add accent button variant for marketing"
```

---

## 2) Header: jerarquía de acciones (Subir video primero)

### Task 2: Rediseñar Header (marketing) con CTA “Subir video” + secundario “Grabar pantalla”

**Files:**
- Modify: [Header.tsx](file:///workspace/app/components/common/Header.tsx)
- Modify: [es.json](file:///workspace/messages/es.json)
- Modify: [en.json](file:///workspace/messages/en.json)

- [ ] **Step 1: Agregar traducción para CTA de upload en header**

En `messages/es.json` dentro de `header`, agregar:

```json
"upload": "Subir video"
```

En `messages/en.json` dentro de `header`, agregar:

```json
"upload": "Upload video"
```

- [ ] **Step 2: Reestructurar Header para incluir botón `upload` con file picker**

Objetivo: el botón “Subir video” en el header debe:
1) abrir file picker de video  
2) guardar en cache (`saveUploadedVideo`)  
3) navegar a `/editor?mode=video`

Reemplazar el archivo completo por esta versión:

```tsx
"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { UserMenu } from "./UserMenu";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslations } from "next-intl";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { useRecording } from "@/hooks/RecordingContext";
import RecordingSetupDialog from "../ui/RecordingSetupDialog";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { saveUploadedVideo } from "@/lib/video-upload-cache";

export default function Header() {
  const t = useTranslations("header");
  const tRecording = useTranslations("recording.steps");

  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { startCountdown, stopRecording, isIdle, isRecording, isCountdown, isProcessing } = useRecording();
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [showMobileAlert, setShowMobileAlert] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleUploadClick = () => {
    if (isUploadingVideo) return;
    videoInputRef.current?.click();
  };

  const handleVideoFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) return;
      setIsUploadingVideo(true);
      try {
        await saveUploadedVideo(file);
        router.push("/editor?mode=video");
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [router]
  );

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
    e.target.value = "";
  };

  const handleRecordClick = () => {
    if (isRecording) {
      stopRecording();
      return;
    }

    const isMobile =
      typeof window !== "undefined" &&
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768);

    if (isMobile) {
      setShowMobileAlert(true);
      setTimeout(() => setShowMobileAlert(false), 5000);
    } else {
      setSetupDialogOpen(true);
    }
  };

  const getRecordButtonIcon = () => {
    if (isCountdown || isProcessing) {
      return <Icon icon="eos-icons:loading" className="w-4 h-4 animate-spin" />;
    }
    if (isRecording) {
      return <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />;
    }
    return <Icon icon="material-symbols:cast-outline-rounded" className="w-4 h-4" />;
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled ? "border-b border-white/10 bg-[#050505]/75 backdrop-blur-xl py-0" : "bg-transparent border-transparent py-2"
        )}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/svg/logo-openvid.svg" alt="Logo" width={50} height={50} style={{ height: "auto" }} />
            <Image src="/svg/openvid.svg" alt="Logo" width={100} height={50} className="hidden sm:flex" style={{ height: "auto" }} />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-md font-medium text-neutral-400">
            <a href="#docs" className="hover:text-white transition-colors">
              {t("docs")}
            </a>
            <Link href="/donate" target="_blank" className="hover:text-white transition-colors">
              {t("donate")}
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="accent"
              onClick={handleUploadClick}
              disabled={isUploadingVideo}
              className="hidden sm:flex"
            >
              {isUploadingVideo ? <Icon icon="eos-icons:loading" className="w-4 h-4 animate-spin" /> : <Icon icon="mage:video-upload" className="w-4 h-4" />}
              <span className="text-xs font-bold tracking-tight">{t("upload")}</span>
            </Button>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
              className="hidden"
              onChange={handleVideoFileChange}
            />

            <Button
              variant="outline"
              onClick={handleRecordClick}
              disabled={!isIdle || isCountdown || isProcessing}
              className={cn("transition-all hidden sm:flex", isRecording && "border-red-500/50 text-red-400 hover:bg-red-500/5")}
            >
              {getRecordButtonIcon()}
              <span className="text-xs font-bold tracking-tight">{isRecording ? tRecording("step4.visual.stop") : t("screen")}</span>
              {!isRecording && (
                <kbd className="hidden lg:flex items-center ml-1 px-1.5 py-0.5 rounded bg-black/20 border border-white/20 text-[9px] font-black text-white/80 uppercase">
                  Alt + S
                </kbd>
              )}
            </Button>

            <div className="flex items-center gap-2">
              {!isMounted ? <div className="w-25 h-9 rounded-md bg-white/10 animate-pulse border border-white/5"></div> : <LanguageSwitcher />}
              <div className="block">
                {!isMounted ? (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse border border-white/5"></div>
                    <div className="w-24 h-4 rounded-md bg-white/10 animate-pulse"></div>
                  </div>
                ) : (
                  <UserMenu />
                )}
              </div>
              {!isMounted ? <div className="w-9 h-9 rounded-md bg-white/10 animate-pulse border border-white/5"></div> : <MobileMenu />}
            </div>
          </div>
        </div>

        {showMobileAlert && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
            <Alert variant="warning" className="bg-[#0A0A0A] border-yellow-500/50">
              <Icon icon="solar:laptop-minimalistic-broken" className="text-xl" />
              <AlertTitle>{tRecording("step1.permissionRequired")}</AlertTitle>
              <AlertDescription>{tRecording("step1.mobileAlert")}</AlertDescription>
            </Alert>
          </div>
        )}
      </header>

      <RecordingSetupDialog open={setupDialogOpen} onClose={() => setSetupDialogOpen(false)} onStart={(config) => startCountdown(config)} />
    </>
  );
}
```

- [ ] **Step 3: Verificar en navegador**

Acciones:
- abrir home
- confirmar que el header muestra “Subir video” (desktop)
- click en “Subir video” abre file picker
- seleccionar un video navega a `/editor?mode=video` (no requiere login)

- [ ] **Step 4: Verificar build**

Run:

```bash
bun run build
```

- [ ] **Step 5: Commit**

```bash
git add app/components/common/Header.tsx messages/es.json messages/en.json
git commit -m "feat(marketing): header upload CTA and actions hierarchy"
```

---

## 3) Home: Hero “Premium Clean” (menos ruido, CTA dominante)

### Task 3: Simplificar Hero para un CTA dominante “Subir video”

**Files:**
- Modify: [Hero.tsx](file:///workspace/app/components/ui/Hero.tsx)
- Modify: [es.json](file:///workspace/messages/es.json)
- Modify: [en.json](file:///workspace/messages/en.json)

- [ ] **Step 1: Ajustar copy del hero (más directo)**

Actualizar `hero.title` y `hero.titleHighlight`:

`messages/es.json`:

```json
"title": "Crea demos profesionales",
"titleHighlight": "en 4K, directo en tu navegador"
```

`messages/en.json`:

```json
"title": "Create professional demos",
"titleHighlight": "in 4K, right in your browser"
```

- [ ] **Step 2: Reemplazar Hero por versión clean (solo video como CTA fuerte)**

Reemplazar el archivo completo por:

```tsx
"use client";
import { Icon } from "@iconify/react";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { saveUploadedVideo } from "@/lib/video-upload-cache";
import { saveUploadedImage } from "@/lib/image-upload-cache";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  onVideoUpload?: (file: File) => void;
  onPhotoUpload?: (file: File) => void;
}

export default function Hero({ onVideoUpload, onPhotoUpload }: HeroProps) {
  const t = useTranslations("hero");
  const router = useRouter();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingVideo, setIsDraggingVideo] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleVideoFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("video/")) return;
      setIsUploadingVideo(true);
      try {
        await saveUploadedVideo(file);
        if (onVideoUpload) onVideoUpload(file);
        router.push("/editor?mode=video");
      } finally {
        setIsUploadingVideo(false);
      }
    },
    [onVideoUpload, router]
  );

  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleVideoFile(file);
    e.target.value = "";
  };

  const handleVideoDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(true);
  };

  const handleVideoDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
  };

  const handleVideoDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingVideo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleVideoFile(file);
  };

  const photoInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) return;
      setIsUploadingPhoto(true);
      try {
        await saveUploadedImage(file);
        if (onPhotoUpload) onPhotoUpload(file);
        router.push("/editor?mode=photo");
      } finally {
        setIsUploadingPhoto(false);
      }
    },
    [onPhotoUpload, router]
  );

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handlePhotoFile(file);
    e.target.value = "";
  };

  return (
    <>
      <h1 className="animate-reveal text-5xl md:text-7xl font-semibold text-white tracking-tight mb-5 leading-[1.05]">
        {t("title")}
        <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-200 via-neutral-400 to-amber-300">
          {t("titleHighlight")}
        </span>
      </h1>

      <p className="animate-reveal [animation-delay:150ms] text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
        {t("description")}
      </p>

      <div className="animate-reveal [animation-delay:300ms] flex flex-col items-center justify-center gap-3">
        <div
          onDragOver={handleVideoDragOver}
          onDragLeave={handleVideoDragLeave}
          onDrop={handleVideoDrop}
          onClick={() => !isUploadingVideo && videoInputRef.current?.click()}
          className={[
            "w-full max-w-md",
            "relative flex items-center justify-center px-6 h-14",
            "rounded-2xl border cursor-pointer transition-all duration-200",
            isDraggingVideo ? "border-amber-400/60 bg-amber-500/10" : "border-white/15 bg-white/5 hover:bg-white/8 hover:border-white/25",
            isUploadingVideo ? "opacity-60 cursor-not-allowed" : "",
          ].join(" ")}
        >
          <div className="flex items-center justify-center gap-3 pointer-events-none w-full">
            {isUploadingVideo ? (
              <>
                <Icon icon="eos-icons:loading" className="w-5 h-5 animate-spin text-amber-300" />
                <span className="text-sm font-semibold text-white/80">{t("uploadButtonUploading")}</span>
              </>
            ) : isDraggingVideo ? (
              <>
                <Icon icon="ph:arrow-fat-down-bold" className="w-5 h-5 text-amber-300" />
                <span className="text-sm font-semibold text-white/80">{t("uploadButtonDragging")}</span>
              </>
            ) : (
              <>
                <Icon icon="mage:video-upload" className="w-5 h-5 text-amber-300" />
                <span className="text-sm font-semibold text-white">{t("uploadButton")}</span>
                <span className="text-xs text-white/40 hidden sm:inline">MP4, WebM, MOV</span>
              </>
            )}
          </div>
        </div>

        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
          className="hidden"
          onChange={handleVideoFileChange}
        />

        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Button variant="outline" asChild className="w-full sm:w-auto">
            <a href="#docs">{t("recordButton")}</a>
          </Button>

          <button
            type="button"
            onClick={() => !isUploadingPhoto && photoInputRef.current?.click()}
            disabled={isUploadingPhoto}
            className="text-sm text-white/60 hover:text-white/85 transition-colors underline decoration-white/20 underline-offset-4 disabled:opacity-50"
          >
            {t("uploadPhotoButton")}
          </button>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handlePhotoFileChange}
          />
        </div>

        <Link href="/editor?mode=video" className="text-sm text-white/50 hover:text-white/75 transition-colors mt-2">
          {t("goToVideoEditor")}
        </Link>
      </div>
    </>
  );
}
```

- [ ] **Step 3: Verificar hero en browser**

Checklist:
- H1 más simple
- CTA “Subir video” visualmente dominante
- Click en dropzone abre file picker y navega al editor
- “Grabar pantalla” manda a `#docs`

- [ ] **Step 4: Verificar build**

Run:

```bash
bun run build
```

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/Hero.tsx messages/es.json messages/en.json
git commit -m "feat(marketing): simplify hero and prioritize upload CTA"
```

---

## 4) Home: reducir ruido del scroll hero

### Task 4: Reemplazar `HeroScrollMask` por sección más calmada (features strip)

**Files:**
- Create: `app/components/ui/FeaturesStrip.tsx`
- Modify: [page.tsx](file:///workspace/app/%5Blocale%5D/(home)/page.tsx)

- [ ] **Step 1: Crear `FeaturesStrip`**

Crear `app/components/ui/FeaturesStrip.tsx`:

```tsx
"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function FeaturesStrip() {
  const t = useTranslations("demo");
  const features = (t.raw("features") as string[]) || [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!features.length) return;
    const id = setInterval(() => setIndex((v) => (v + 1) % features.length), 2800);
    return () => clearInterval(id);
  }, [features.length]);

  return (
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-xs font-semibold tracking-[0.25em] text-white/40 uppercase mb-4">
            {t("title")}
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            <span className="text-white/60">{t("subtitle")}</span>{" "}
            <span className="text-amber-300">{features[index] || ""}</span>
          </div>
          <div className="mt-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Usar `FeaturesStrip` en la home y remover `HeroScrollMask`**

Actualizar `app/[locale]/(home)/page.tsx` para:
- eliminar el bloque que renderiza `<HeroScrollMask />`
- insertar `<FeaturesStrip />` inmediatamente después del hero

Ejemplo de estructura final (solo el bloque principal, respetar imports):

```tsx
import { BentoDemos } from "@/app/components/ui/BentoDemos";
import DonationCard from "@/app/components/ui/DonationCard";
import EditorPreview from "@/app/components/ui/EditorPreview";
import Hero from "@/app/components/ui/Hero";
import FeaturesStrip from "@/app/components/ui/FeaturesStrip";
import InteractiveRecordingSteps from "@/app/components/ui/RecordingSteps";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden bg-gradient-radial-primary w-full">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-[150%] rounded-[100%] blur-3xl pointer-events-none -z-10"></div>

        <section className="pt-32 pb-6 sm:pb-14 bg-gradient-radial-primary">
          <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
            <Hero />
          </div>
        </section>
      </div>

      <FeaturesStrip />

      <section className="w-full py-16">
        <div className="max-w-6xl mx-auto px-6">
          <InteractiveRecordingSteps />
        </div>
      </section>

      <section className="pt-8 pb-0 sm:py-2 w-full mb-0 sm:mb-42">
        <div className="max-w-xl mx-auto px-6">
          <DonationCard />
        </div>
      </section>

      <div className="relative overflow-hidden bg-gradient-radial-primary w-full py-20 pb-40">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-[150%] rounded-[100%] blur-xl pointer-events-none "></div>
        <section className="w-full">
          <div className="w-full sm:max-w-6xl mx-auto sm:px-6 mb-14">
            <EditorPreview />
          </div>
          <BentoDemos />
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verificar visualmente**

Checklist:
- desaparece el scroll pinned/animación agresiva
- la home queda más “quieta”

- [ ] **Step 4: Verificar build**

```bash
bun run build
```

- [ ] **Step 5: Commit**

```bash
git add app/components/ui/FeaturesStrip.tsx app/[locale]/(home)/page.tsx
git commit -m "feat(marketing): replace scroll hero with calm features strip"
```

---

## 5) Steps (Docs): editorial + consistencia + menos ruido

### Task 5: Ajustar `RecordingSteps` a look premium clean

**Files:**
- Modify: [RecordingSteps.tsx](file:///workspace/app/components/ui/RecordingSteps.tsx)

- [ ] **Step 1: Ajustar heading y acentos al ámbar**

Cambiar el heading principal para remover drop-shadows intensos y usar ámbar:

Reemplazar el bloque del heading (en el return) por:

```tsx
<div className="max-w-3xl mx-auto text-center mb-24 sm:mb-28">
  <h2 className="text-4xl md:text-6xl font-semibold tracking-tighter text-white mb-5 leading-tight">
    {t("title")} <br />
    <span className="text-transparent bg-clip-text bg-linear-to-r from-neutral-200 via-neutral-400 to-amber-300">
      {t("title2")}
    </span>
  </h2>
  <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed mb-8">
    {t("subtitle")}
  </p>
</div>
```

- [ ] **Step 2: Ajustar el botón principal del Step 1 a `accent`**

En `actionButton` del step 1, cambiar:

```tsx
<Button variant="outline" ...>
```

por:

```tsx
<Button variant="accent" ...>
```

- [ ] **Step 3: Verificar build**

```bash
bun run build
```

- [ ] **Step 4: Commit**

```bash
git add app/components/ui/RecordingSteps.tsx
git commit -m "feat(marketing): refine recording steps visuals and amber accents"
```

---

## 6) Donate CTA: convertir la tarjeta en banda discreta

### Task 6: Suavizar `DonationCard` para que no compita con el CTA principal

**Files:**
- Modify: [DonationCard.tsx](file:///workspace/app/components/ui/DonationCard.tsx)

- [ ] **Step 1: Simplificar estilo (menos blur azul, más limpio)**

Reemplazar `className` del anchor principal y remover el blur azul (línea del div absoluto).

Actualizar el componente completo a:

```tsx
"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

export default function DonationCard() {
  const t = useTranslations("donation");

  return (
    <a
      href="/donate"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between w-full overflow-hidden rounded-3xl border border-white/10 bg-white/3 px-6 py-5 transition-all hover:border-white/20 hover:bg-white/5 active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-amber-300 border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
          <Icon icon="carbon:cafe" width="22" height="22" />
        </div>

        <div className="flex flex-col">
          <h4 className="text-base sm:text-lg font-medium text-white tracking-tight">{t("title")}</h4>
          <p className="text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors">{t("description")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-white/30 group-hover:text-amber-300 transition-all">
        <Icon icon="carbon:arrow-right" width="22" height="22" className="transform group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/components/ui/DonationCard.tsx
git commit -m "feat(marketing): make donate card a subtle band"
```

---

## 7) Login: coherencia dark premium + ámbar

### Task 7: Ajustar `login/page.tsx` al nuevo sistema visual

**Files:**
- Modify: [login/page.tsx](file:///workspace/app/%5Blocale%5D/(auth)/login/page.tsx)

- [ ] **Step 1: Cambiar “back to home” y botones a look más limpio**

Reemplazar el archivo completo por:

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

type OAuthProvider = "google" | "github" | "twitch";

interface ProviderConfig {
  name: string;
  icon: string;
  provider: OAuthProvider;
  bgClass: string;
  iconColor?: string;
}

const providers: ProviderConfig[] = [
  {
    name: "Google",
    icon: "material-icon-theme:google",
    provider: "google",
    bgClass: "border-white/10 bg-transparent hover:bg-white/5",
  },
  {
    name: "GitHub",
    icon: "mdi:github",
    provider: "github",
    bgClass: "border-white/10 bg-transparent hover:bg-white/5",
  },
  {
    name: "Twitch",
    icon: "mdi:twitch",
    provider: "twitch",
    bgClass: "border-white/10 bg-transparent hover:bg-white/5",
    iconColor: "text-[#9146FF]",
  },
];

export default function Login() {
  const t = useTranslations("login");
  const [loading, setLoading] = useState<OAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    try {
      setLoading(provider);
      setError(null);

      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (signInError) {
        throw signInError;
      }
    } catch (err) {
      console.error(`Error signing in with ${provider}:`, err);
      setError(err instanceof Error ? err.message : t("errors.generic"));
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030303] grid lg:grid-cols-2 text-white selection:bg-white/30">
      <div className="relative flex flex-col justify-center px-8 sm:px-16 lg:px-24 xl:px-32">
        <div className="absolute top-8 left-8 sm:left-12 lg:left-16">
          <Button variant="ghost" size="sm" className="text-neutral-400 hover:text-white hover:bg-white/5 text-sm" asChild>
            <Link href="/">
              <Icon icon="solar:arrow-left-linear" className="mr-2" width="16" />
              {t("backToHome")}
            </Link>
          </Button>
        </div>

        <div className="w-full max-w-sm mx-auto mt-16 lg:mt-0">
          <div className="mb-10">
            <Image src="/svg/logo-openvid.svg" alt="Logo" width={56} height={56} className="mb-4" />
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">{t("title")}</h1>
            <p className="text-neutral-300 text-md font-light tracking-wide">{t("subtitle")}</p>
          </div>

          <div className="space-y-3">
            {providers.map((providerConfig) => (
              <Button
                key={providerConfig.provider}
                onClick={() => handleOAuthSignIn(providerConfig.provider)}
                disabled={loading !== null}
                variant="outline"
                size="lg"
                className={`w-full h-12 gap-3 text-white transition-all font-light rounded-xl ${providerConfig.bgClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === providerConfig.provider ? (
                  <>
                    <Icon icon="svg-spinners:ring-resize" className="w-5 h-5" />
                    <span>{t("providers.loading")}</span>
                  </>
                ) : (
                  <>
                    <Icon icon={providerConfig.icon} className={`${providerConfig.iconColor || "text-white"} size-5`} />
                    <span>{t(`providers.${providerConfig.provider}`)}</span>
                  </>
                )}
              </Button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <p className="mt-12 text-md text-neutral-300 leading-relaxed font-light">
            {t.rich("disclaimer", {
              terms: (chunks) => (
                <Link href="/terms" target="_blank" className="text-neutral-200 hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">
                  {chunks}
                </Link>
              ),
              privacy: (chunks) => (
                <Link href="/privacy" target="_blank" className="text-neutral-200 hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">
                  {chunks}
                </Link>
              ),
            })}
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative w-full h-full border-l border-white/10 bg-[#020203] overflow-hidden group">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] h-[70%] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none transition-colors duration-1000"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[90px] pointer-events-none transition-colors duration-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] bg-size-[28px_28px] opacity-20 pointer-events-none z-10"></div>
        <div className="absolute inset-0 transition-transform duration-1000 ease-in-out scale-110 group-hover:scale-125">
          <img
            src="/images/pages/openvid-login.webp"
            alt="Cinematic Shot BW"
            className="absolute inset-0 w-full h-full object-contain mix-blend-luminosity opacity-70 transition-all duration-1000 ease-in-out [clip-path:inset(0_0_0_50%)] group-hover:opacity-0"
          />
          <img
            src="/images/pages/openvid-login.webp"
            alt="Cinematic Shot Color"
            className="absolute inset-0 w-full h-full object-contain transition-all duration-1000 ease-in-out [clip-path:inset(0_50%_0_0)] group-hover:[clip-path:inset(0_0_0_0%)]"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/60 pointer-events-none z-10"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-white/10 transition-colors duration-1000 pointer-events-none z-20"></div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/(auth)/login/page.tsx
git commit -m "feat(auth): align login page with premium clean visuals"
```

---

## 8) Donate page: acento ámbar en selección/CTA

### Task 8: Ajustar DonateClient a selección premium clean

**Files:**
- Modify: `app/[locale]/(home)/donate/DonateClient.tsx`

- [ ] **Step 1: Agregar estados `selected` con borde/ring ámbar**

En el map de `methods`, donde está:

```tsx
<div key={method.id} className="border-b border-white/5 last:border-0">
```

cambiar a:

```tsx
<div
  key={method.id}
  className={[
    "border-b border-white/5 last:border-0",
    selected === method.id ? "bg-amber-500/4" : "",
  ].join(" ")}
>
```

Y en el botón:

```tsx
className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-white/5 group"
```

cambiar a:

```tsx
className={[
  "w-full flex items-center justify-between p-5 text-left transition-colors group",
  selected === method.id ? "bg-amber-500/6" : "hover:bg-white/5",
].join(" ")}
```

Y en el contenedor del ícono:

```tsx
className="w-9 h-9 rounded bg-[#1C1C1F] border border-white/10 ..."
```

cambiar a:

```tsx
className={[
  "w-9 h-9 rounded bg-[#1C1C1F] border flex items-center justify-center shrink-0 overflow-hidden transition-colors",
  selected === method.id ? "border-amber-500/40" : "border-white/10 group-hover:border-white/20",
].join(" ")}
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/(home)/donate/DonateClient.tsx
git commit -m "feat(marketing): add amber selection styling to donate page"
```

---

## 9) Legal + Not Found: cohesión visual

### Task 9: Ajustar NotFound al nuevo acento

**Files:**
- Modify: [not-found.tsx](file:///workspace/app/%5Blocale%5D/not-found.tsx)

- [ ] **Step 1: Reemplazar el gradiente azul por ámbar sutil**

Cambiar el background radial:

De:

```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,163,255,0.08)_0%,transparent_60%)] pointer-events-none" />
```

A:

```tsx
<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.10)_0%,transparent_60%)] pointer-events-none" />
```

- [ ] **Step 2: Verificar build**

```bash
bun run build
```

- [ ] **Step 3: Commit**

```bash
git add app/[locale]/not-found.tsx
git commit -m "feat(marketing): align 404 page with amber accent"
```

---

## 10) QA final

### Task 10: Validación final en navegador y build

**Files:** (sin cambios)

- [ ] **Step 1: Verificar páginas clave**

Checklist manual:
- Home: CTA “Subir video” destacado, header limpio
- Login: coherente con dark premium + ámbar
- Donate: selección con ámbar
- Privacy/Terms: legibles, sin romper layout
- Not Found: coherencia visual
- Editor: no se ve afectado por el nuevo variant `accent` (solo se usa en marketing)

- [ ] **Step 2: Lint + Build**

```bash
bun run lint
bun run build
```

Expected: exit code 0.
