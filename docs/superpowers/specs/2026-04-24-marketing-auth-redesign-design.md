# Rediseño Marketing + Auth (Premium Clean)

**Proyecto:** openvid  
**Fecha:** 2026-04-24  
**Alcance:** Marketing + Auth (excluye editor)  
**Dirección visual:** Dark premium + acento ámbar  
**CTA principal:** Subir video

## 1) Contexto

El producto es un editor de demos/mockups in-browser (Next.js App Router + next-intl + Tailwind v4 + shadcn/ui). La home actual combina un hero con dropzones, sección de pasos, donación, y preview del editor. Auth incluye login con proveedores OAuth (Supabase).

Este documento define el rediseño completo del **marketing y auth** para lograr una estética más “premium clean”: menos ruido visual, jerarquía tipográfica más clara, mejor foco en el CTA principal (Subir video) y un acento ámbar que diferencie la marca.

## 2) Objetivos

- Aumentar claridad del producto “en 5 segundos”: qué hace openvid y qué hacer primero.
- Priorizar el CTA principal “Subir video” sin eliminar el flujo de “Grabar pantalla”.
- Consolidar un sistema visual coherente (dark premium + ámbar) sin introducir deuda visual.
- Mantener compatibilidad con i18n (es/en) y accesibilidad básica (contraste, foco, tamaños).
- Mantener rendimiento (evitar exceso de imágenes pesadas/blur/overlays innecesarios).

## 3) No objetivos

- No rediseñar el editor (topbar/sidebar/timeline/canvas).
- No cambiar la arquitectura de auth ni flujos Supabase (solo UI).
- No crear nuevas features de producto; solo reorganizar y pulir presentación.

## 4) IA / Navegación

### Header (global, marketing)

- **Izquierda:** Logo (link a home).
- **Centro (desktop):** Links: “Docs” (anchor) y “Donate”.
- **Derecha:** acciones:
  - Primario: “Subir video”
  - Secundario: “Grabar pantalla”
  - “Sign in”/User menu
  - Language switcher
  - Mobile menu

Reglas:
- Header fijo con fondo y blur solo al scrollear (ya existe: mantener pero simplificar).
- El CTA primario se muestra en desktop; en mobile queda como acción principal dentro del menú o un botón compacto.

### Footer (marketing)

- Mantener estructura en 3 columnas (Product / Contact / Legal).
- Reducir ruido: menos iconos sociales “vacíos” y más enlaces reales.

## 5) Sistema visual

### Paleta

- Base: neutrales oscuros (background ≈ neutral-950).
- Primario funcional: neutral/white para texto, bordes sutiles.
- **Acento ámbar:** se usa para CTA primario y highlights.

Reglas:
- El ámbar debe ser “concentrado”: botones primarios, estados, pequeñas señales.
- Evitar ámbar como fondo dominante en secciones grandes.

Propuesta de tokens (orientativa, se ajusta en implementación):
- Accent: amber-400/500 (hover + active).
- Focus ring: amber-400/50.
- Badges: amber-500/10 + border amber-500/20.

### Fondos y gradientes

- Mantener el concepto de gradiente radial, pero con **menor saturación**.
- El gradiente se usa para profundidad y atmósfera (no como protagonista).
- Limitar overlays de “dots grid” y blur intensos a un solo patrón por página.

### Tipografía / Jerarquía

- Unificar jerarquía en marketing:
  - H1: grande, corto, directo (1 idea).
  - Subcopy: 1–2 líneas, máxima claridad.
  - Evitar demasiados elementos flotantes sobre el H1.

### Componentes (estilo)

- Bordes: 1px o 0.5px con opacidad baja.
- Cards: fondos apenas elevados (bg-white/5 o neutral-900/50).
- Sombras: sutiles y consistentes; evitar dropshadows gigantes en marketing.
- “Glass” solo donde aporta (header, algunas cards), no en todos lados.

## 6) Páginas

### 6.1 Home

#### Above the fold

- H1 más corto y contundente.
- Subcopy aclarando: “crea demos profesionales” + “4K, in-browser”.
- **CTA principal:** Subir video (botón sólido con acento ámbar).
- **CTA secundario:** Grabar pantalla (outline/ghost).
- Dropzone: mantener soporte drag & drop, pero reducir texto accesorio y ruido visual.
- GitHub badge: mover a ubicación menos invasiva (o header/secondary area).

#### Sección “Steps”

- Mantener contenido, remaquetar a estilo editorial:
  - Más espacio vertical.
  - Tipos y subheaders más consistentes.
  - Botones alineados a una sola intención (evitar múltiples CTAs compitiendo).

#### Donate

- Convertir a banda discreta:
  - Mensaje corto de soporte.
  - Enlace claro a /donate.
  - No competir visualmente con el CTA principal.

#### Editor preview + bento

- Mantener como prueba visual, pero:
  - Reducir efectos (blur/overlays excesivos).
  - Mejorar consistencia de espaciado y alineación.

### 6.2 Login

- Mantener layout 2 columnas (desktop).
- Ajustar el look a dark premium + ámbar:
  - Botones OAuth consistentes y más limpios.
  - Estados loading/disabled coherentes.
  - Panel derecho: conservar “cinematic”, pero con overlays más sutiles y menos “grid noise”.

Notas:
- Con claves dummy, el login no funcionará en dev; el UI debe renderizar igual sin crashear.

### 6.3 Donate

- Mantener contenido funcional.
- Ajustar estilo a la nueva identidad (cards más limpias, acento ámbar en selección/CTA).

### 6.4 Legal (Privacy/Terms) + Not Found

- Unificar lenguaje visual (mismos fondos, tipografía, links).
- Mejorar legibilidad en textos largos: ancho máximo, interlineado, contraste.

## 7) Responsivo

- Mobile:
  - Header simplificado, CTA principal accesible en menú o botón compacto.
  - Hero: CTA full-width, sin elementos flotantes que tapen texto.
  - Secciones con spacing consistente.
- Desktop:
  - Mantener max-w y centrado (6xl/7xl) con ritmo vertical más limpio.

## 8) Accesibilidad y calidad

- Focus visible claro (ring) en todos los elementos interactivos.
- Contraste suficiente para textos secundarios (evitar grises demasiado oscuros).
- Reducir animaciones por defecto donde distraigan; mantenerlas solo para micro-interacciones.

## 9) Plan de implementación (alto nivel)

- Revisión de Header/Footer: jerarquía de acciones + estilos.
- Rediseño del Hero: copy + CTA principal “Subir video”.
- Ajustes de secciones debajo del fold (steps/donate/preview).
- Ajuste de Login para consistencia con el sistema visual.
- Ajustes de Donate/Legal/NotFound para cohesión.

## 10) Criterios de aceptación

- La home comunica el valor del producto y el CTA “Subir video” es el foco principal.
- Estilo dark premium consistente con acento ámbar (sin sobreuso).
- No se cambia UI del editor.
- i18n se mantiene (es/en).
- No hay regresiones obvias de layout en mobile/desktop.

