'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart3,
  BookOpen,
  Bot,
  CalendarDays,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  FileDown,
  KeyRound,
  Landmark,
  LayoutDashboard,
  LayoutGrid,
  LineChart,
  Map,
  Monitor,
  Settings,
  SquareStack,
  Star,
  X,
} from 'lucide-react';
import { API } from '@/lib/constants';

export type LauncherItem = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconClass: string;
  /** Si existe, se muestra como marca en la tile y en el modal en lugar del ícono Lucide. */
  logoSrc?: string;
  logoAlt?: string;
  href?: string;
  comingSoon?: boolean;
  credentials?: { label: string; value: string }[];
};

type LauncherSection = {
  id: string;
  title?: string;
  items: LauncherItem[];
};

const BASE_SECTIONS: LauncherSection[] = [
  {
    id: 'general',
    items: [
      {
        id: 'simae',
        title: 'SIMAE',
        description:
          'Tablero de experiencia SIMAE (Sistema Integral de monitoreo y analitica electoral).',
        icon: SquareStack,
        iconClass: 'text-violet-600',
        href: 'https://simae.actoreselectorales.com/',
        credentials: [
          { label: 'Contraseña', value: 'Pr351d3nc14*2026' },
        ],
      },
      // https://portafolio-servicios-bi.vercel.app/servicio/reporteria
      {
        id: 'portafolio',
        title: 'Portafolio de Servicios',
        description: 'Portafolio de servicios de la empresa.',
        icon: SquareStack,
        iconClass: 'text-violet-600',
        href: 'https://portafolio-servicios-bi.vercel.app/',
      },
      {
        id: 'appbi',
        title: 'AppBI',
        description:
          'Aplicación transversal de apoyo para las diferentes áreas del proyecto, para gestión administrativa.',
        icon: SquareStack,
        iconClass: 'text-violet-600',
        href: 'https://appbi.actoreselectorales.com/',
        credentials: [
          { label: 'Usuario', value: 'superadmin' },
          { label: 'Contraseña', value: 'Admin123!' },
        ],
      },
      {
        id: 'seguimiento-pmo',
        title: 'Seguimiento Data',
        description: 'Aplicación de monitoreo interno.',
        icon: LineChart,
        iconClass: 'text-emerald-600',
        href: 'https://seguimiento-data.actoreselectorales.com/',
        credentials: [
          { label: 'Usuario', value: 'admin' },
          { label: 'Contraseña', value: 'Admin123!' },
        ],
      },
      {
        id: 'embebido-publico-presidencia-2026',
        title: 'Embebido Público Presidencia 2026',
        description:
          'Aplicación donde se encuentran embebidos los tableros de Power BI, tanto congreso como consulta.',
        icon: LayoutGrid,
        iconClass: 'text-sky-600',
        href: 'https://presidencia2026.actoreselectorales.com/',
        credentials: [{ label: 'Token', value: 'Elecciones2026*' }],
      },
      {
        id: 'sistema-cne-presidencia',
        title: 'Sistema CNE Presidencia',
        description:
          'Portal de autenticación del Consejo Nacional Electoral para actores electorales — línea Presidencia.',
        icon: Monitor,
        iconClass: 'text-indigo-600',
        href: 'https://actoreselectoralespresidencia.cne.gov.co/auth/login',
      },
      {
        id: 'repositorio-tableros',
        title: 'Repositorio de Tableros',
        description:
          'Repositorio centralizado de tableros de Power BI del proyecto.',
        icon: LayoutDashboard,
        iconClass: 'text-yellow-600',
        href: 'https://app.fabric.microsoft.com/view?r=eyJrIjoiMDNhYTFhMDMtZjFlYy00NjY3LThhOGQtMmVjMGY4YmZlMWRmIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
      },
      {
        id: 'bot-trafico',
        title: 'Bot Tráfico',
        description: 'Generador de tráfico para el módulo de capacitaciones.',
        icon: Bot,
        iconClass: 'text-amber-600',
        href: 'https://botbi.actoreselectorales.com/',
        credentials: [{ label: 'Token', value: 'Admin123!' }],
      },
      {
        id: 'descarga-credenciales',
        title: 'Descarga de Credenciales',
        description:
          'Herramienta para la descarga de resoluciones y credenciales del sistema CNE.',
        icon: FileDown,
        iconClass: 'text-teal-600',
        href: 'https://credenciales.actoreselectorales.com/',
        credentials: [{ label: 'Contraseña', value: 'Admin123!' }],
      },
      {
        id: 'documentacion-area',
        title: 'Documentación Área',
        description: 'Documentación técnica del área y sus herramientas utilizadas.',
        icon: BookOpen,
        iconClass: 'text-indigo-600',
        href: 'https://documentacionbi.vercel.app/',
      },
      {
        id: 'actividades-bi',
        title: 'Actividades BI',
        description: 'Cronograma de planeación de las tareas del área.',
        icon: CalendarDays,
        iconClass: 'text-orange-600',
        href: 'https://proyecto-atipicas.github.io/dev-bi-cronograma-actividades-v1/',
      },
      {
        id: 'configuracion',
        title: 'Configuración',
        description: 'En definición.',
        icon: Settings,
        iconClass: 'text-gray-400',
        comingSoon: true,
      },
    ],
  },
  {
    id: 'ojo-aguila',
    title: 'Ojo de Águila',
    items: [
      {
        id: 'analitica-presidencia',
        title: 'Analítica de Presidencia',
        description: 'Herramienta de análisis de elecciones presidenciales históricas.',
        icon: BarChart3,
        iconClass: 'text-rose-600',
        href: 'https://analisis-presidencia-colombia.vercel.app/',
      },
      {
        id: 'analitica-congreso',
        title: 'Analítica Congreso',
        description: 'Herramienta de análisis de elecciones del Congreso.',
        icon: Landmark,
        iconClass: 'text-amber-600',
        comingSoon: true,
      },
      {
        id: 'analitica-territorial',
        title: 'Analítica Territorial',
        description:
          'Vista consolidada electoral, socioeconómica y poblacional a nivel territorial.',
        icon: Map,
        iconClass: 'text-fuchsia-600',
        href: 'https://analitica-palo-viedo.vercel.app/',
      },
    ],
  },
];

/** Lookup plano por id para reutilizar items entre secciones (favoritos, etc.). */
const ITEMS_BY_ID: Record<string, LauncherItem> = Object.fromEntries(
  BASE_SECTIONS.flatMap((s) => s.items).map((i) => [i.id, i])
);

/** IDs de las apps marcadas como favoritas (orden = orden en que se muestran). */
const FAVORITE_IDS = [
  'embebido-publico-presidencia-2026',
  'simae',
  'appbi',
  'portafolio',
  'descarga-credenciales',
  'sistema-cne-presidencia',
];

const SECTIONS: LauncherSection[] = [
  {
    id: 'favoritos',
    title: 'Favoritos',
    items: FAVORITE_IDS.map((id) => ITEMS_BY_ID[id]).filter(
      (i): i is LauncherItem => Boolean(i)
    ),
  },
  ...BASE_SECTIONS,
];

/** Pestañas de navegación. Cada tab mapea a una o más secciones que se renderizan al activarse. */
const TABS = [
  { id: 'favoritos', label: 'Favoritos', icon: Star, sectionIds: ['favoritos'] },
  { id: 'todas', label: 'Todas las apps', icon: LayoutGrid, sectionIds: ['general', 'ojo-aguila'] },
] as const;

type TabId = (typeof TABS)[number]['id'];
const DEFAULT_TAB: TabId = 'favoritos';
const TAB_STORAGE_KEY = 'app-launcher-tab';

type AppLauncherMenuProps = {
  appTitle?: string;
  onLogout?: () => void | Promise<void>;
};

const SENSITIVE_LABELS = new Set(['contraseña', 'token', 'password']);

/**
 * Devuelve la credencial sensible (contraseña/token) preferida para auto-copiar al portapapeles
 * al abrir una app. Prioriza 'contraseña' > 'token' > 'password'.
 */
const SENSITIVE_PRIORITY = ['contraseña', 'token', 'password'];
function getCopyableCredential(item: LauncherItem) {
  if (!item.credentials?.length) return null;
  for (const label of SENSITIVE_PRIORITY) {
    const found = item.credentials.find((c) => c.label.toLowerCase() === label);
    if (found) return found;
  }
  return null;
}

async function copyToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Mapea el color del ícono (text-X-600) a un fondo suave para la "tile" estilo home screen,
 * con su variante para tema oscuro. Mantener clases como literales para que Tailwind no las purgue.
 */
const TILE_BG_BY_ICON: Record<string, string> = {
  'text-violet-600': 'bg-violet-50 dark:bg-violet-500/15',
  'text-emerald-600': 'bg-emerald-50 dark:bg-emerald-500/15',
  'text-sky-600': 'bg-sky-50 dark:bg-sky-500/15',
  'text-amber-600': 'bg-amber-50 dark:bg-amber-500/15',
  'text-yellow-600': 'bg-yellow-50 dark:bg-yellow-500/15',
  'text-teal-600': 'bg-teal-50 dark:bg-teal-500/15',
  'text-rose-600': 'bg-rose-50 dark:bg-rose-500/15',
  'text-indigo-600': 'bg-indigo-50 dark:bg-indigo-500/15',
  'text-orange-600': 'bg-orange-50 dark:bg-orange-500/15',
  'text-fuchsia-600': 'bg-fuchsia-50 dark:bg-fuchsia-500/15',
  'text-gray-400': 'bg-gray-100 dark:bg-gray-800',
};

/** Override de color del ícono en modo oscuro (los `text-X-600` quedan opacos en fondos tintados). */
const ICON_DARK_BY_LIGHT: Record<string, string> = {
  'text-violet-600': 'dark:text-violet-300',
  'text-emerald-600': 'dark:text-emerald-300',
  'text-sky-600': 'dark:text-sky-300',
  'text-amber-600': 'dark:text-amber-300',
  'text-yellow-600': 'dark:text-yellow-300',
  'text-teal-600': 'dark:text-teal-300',
  'text-rose-600': 'dark:text-rose-300',
  'text-indigo-600': 'dark:text-indigo-300',
  'text-orange-600': 'dark:text-orange-300',
  'text-fuchsia-600': 'dark:text-fuchsia-300',
  'text-gray-400': 'dark:text-gray-500',
};

const getTileBg = (iconClass: string) => TILE_BG_BY_ICON[iconClass] ?? 'bg-slate-50 dark:bg-slate-800';
const getIconDark = (iconClass: string) => ICON_DARK_BY_LIGHT[iconClass] ?? 'dark:text-slate-300';

/** Marca visual en tile o modal: logo externo o ícono Lucide (fallback). */
function LauncherMark({
  item,
  variant,
  tileIconClassName,
}: {
  item: LauncherItem;
  variant: 'tile' | 'modal';
  /** Solo para variant tile cuando no hay logo: clases completas del Lucide (hover/scale). */
  tileIconClassName?: string;
}) {
  if (item.logoSrc) {
    const interactiveImg =
      variant === 'tile'
        ? 'motion-reduce:group-hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06] group-active:scale-100'
        : '';
    const sizing =
      variant === 'tile' ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-7 w-7 sm:h-8 sm:w-8';
    return (
      // Dominio oficial CNE; favicon como marca cuando no hay asset local.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.logoSrc}
        alt={item.logoAlt ?? item.title}
        className={`${sizing} ${interactiveImg} rounded-[10px] object-contain`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer-when-downgrade"
      />
    );
  }
  const Icon = item.icon;
  if (variant === 'tile') {
    return <Icon className={tileIconClassName ?? ''} strokeWidth={1.5} />;
  }
  return (
    <Icon
      className={`h-5 w-5 ${item.iconClass} ${getIconDark(item.iconClass)}`}
      strokeWidth={1.5}
    />
  );
}

type Theme = 'light' | 'dark';

/** Lee/escribe el tema en `localStorage` y mantiene la clase `dark` en `<html>`. Por defecto oscuro. */
function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' &&
    !document.documentElement.classList.contains('dark')
      ? 'light'
      : 'dark'
  );

  useEffect(() => {
    const initial: Theme = document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light';
    setTheme(initial);
  }, []);

  const toggle = () => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try {
        localStorage.setItem('theme', next);
      } catch { /* storage no disponible */ }
      return next;
    });
  };

  return { theme, toggle };
}

/** Tab activo con persistencia en `localStorage`. */
function useActiveTab(): { tab: TabId; setTab: (t: TabId) => void } {
  const [tab, setTab] = useState<TabId>(DEFAULT_TAB);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(TAB_STORAGE_KEY) as TabId | null;
      if (stored && TABS.some((t) => t.id === stored)) {
        setTab(stored);
      }
    } catch { /* storage no disponible */ }
  }, []);

  const change = (next: TabId) => {
    setTab(next);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, next);
    } catch { /* storage no disponible */ }
  };

  return { tab, setTab: change };
}

function TabBar({
  activeTab,
  onChange,
}: {
  activeTab: TabId;
  onChange: (t: TabId) => void;
}) {
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.id === activeTab));
  return (
    <div className="mb-8 sm:mb-10">
      <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-3">
        Área de trabajo
      </p>
      <div className="flex justify-center px-1">
        <div
          role="tablist"
          aria-label="Pestañas"
          className="relative flex w-full max-w-md items-center gap-0 rounded-2xl border border-gray-200/90 bg-white/80 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_24px_-8px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-gray-700/90 dark:bg-gray-900/85 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_8px_32px_-12px_rgba(0,0,0,0.55)]"
        >
          {/* Indicador deslizante */}
          <span
            aria-hidden
            className="absolute top-1 bottom-1 left-1 rounded-[14px] bg-gradient-to-b from-white via-white to-slate-50 dark:from-gray-100 dark:via-gray-100 dark:to-gray-200 shadow-[0_1px_2px_rgba(15,23,42,0.08),0_4px_14px_-4px_rgba(15,23,42,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.04] dark:ring-white/10 transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `calc((100% - 0.5rem) / ${TABS.length})`,
              transform: `translateX(calc(${activeIndex} * 100%))`,
            }}
          />

          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={active}
                aria-controls={`tabpanel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => onChange(t.id)}
                className={`relative z-10 flex min-h-11 flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-2.5 text-[13px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 sm:min-h-10 sm:px-4 sm:text-sm ${
                  active
                    ? 'font-semibold text-gray-900 dark:text-gray-900'
                    : 'font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${
                    active
                      ? t.id === 'favoritos'
                        ? 'scale-110 text-violet-600 dark:text-violet-700'
                        : 'scale-110 text-gray-700 dark:text-gray-800'
                      : t.id === 'favoritos'
                        ? 'scale-100 text-violet-500/75 dark:text-violet-400/80'
                        : 'scale-100 text-gray-400 dark:text-gray-500'
                  }`}
                  aria-hidden
                />
                <span className="truncate">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type Toast = { id: number; message: string; tone?: 'info' | 'error' };

/** Toasts efímeros (auto-cierre tras `duration` ms). */
function useToasts(duration = 2500) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (message: string, tone: Toast['tone'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return { toasts, push };
}

function ToastViewport({ toasts }: { toasts: Toast[] }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg border backdrop-blur-md ${
            t.tone === 'error'
              ? 'bg-red-600/95 text-white border-red-500/50'
              : 'bg-gray-900/95 text-white border-white/10 dark:bg-gray-100/95 dark:text-gray-900 dark:border-black/10'
          }`}
          role="status"
        >
          {t.tone === 'error' ? (
            <X className="w-4 h-4" aria-hidden />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" aria-hidden />
          )}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * Modal que se abre al hacer click en una tile: muestra la URL embebida en un iframe
 * y, si el item tiene credenciales, las lista con copia/mostrar-ocultar.
 */
function AppPreviewModal({
  item,
  onClose,
  onOpenExternal,
}: {
  item: LauncherItem | null;
  onClose: () => void;
  onOpenExternal?: () => void;
}) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setRevealed({});
    setCopiedIdx(null);
    setIframeLoaded(false);
  }, [item]);

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, onClose]);

  if (!item || !item.href) return null;

  const credentials = item.credentials ?? [];

  const handleCopy = async (value: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* clipboard not available */ }
  };

  const isSensitive = (label: string) => SENSITIVE_LABELS.has(label.toLowerCase());
  const mask = (value: string) => '•'.repeat(Math.max(value.length, 8));

  const toggleReveal = (idx: number) => {
    setRevealed((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="app-preview-title"
    >
      <div
        className="bg-white dark:bg-gray-900 shadow-2xl w-full h-[100dvh] sm:h-auto sm:max-w-4xl sm:max-h-[92vh] sm:rounded-2xl flex flex-col sm:border sm:border-transparent sm:dark:border-gray-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start sm:items-center justify-between gap-3 px-4 sm:px-5 pt-3 pb-3 sm:pt-4 border-b border-gray-100 dark:border-gray-800"
          style={{ paddingTop: 'max(env(safe-area-inset-top, 0px), 0.75rem)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`shrink-0 w-10 h-10 rounded-xl ${getTileBg(item.iconClass)} border border-black/[0.04] dark:border-white/[0.06] flex items-center justify-center overflow-hidden`}
            >
              <LauncherMark item={item} variant="modal" />
            </div>
            <div className="min-w-0">
              <h3
                id="app-preview-title"
                className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate"
              >
                {item.title}
              </h3>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 truncate block max-w-[42ch] sm:max-w-[60ch] transition-colors"
                title={item.href}
              >
                {item.href}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenExternal?.()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" aria-hidden />
              Abrir en pestaña
            </a>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 sm:w-9 sm:h-9 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Cerrar"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto flex flex-col">
          <div className="px-3 sm:px-5 pt-3 sm:pt-4 flex-1 flex flex-col">
            <div className="relative w-full rounded-none sm:rounded-xl overflow-hidden border-y sm:border border-gray-200 dark:border-gray-800 bg-slate-50 dark:bg-gray-950 flex-1 min-h-[55vh] sm:flex-none sm:aspect-[16/9] sm:min-h-0 -mx-3 sm:mx-0">
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
                  Cargando vista previa…
                </div>
              )}
              <iframe
                title={`Vista previa de ${item.title}`}
                src={item.href}
                onLoad={() => setIframeLoaded(true)}
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                className="absolute inset-0 w-full h-full border-0 bg-white dark:bg-gray-950"
              />
            </div>
            <p className="mt-2 text-[11px] text-gray-400 dark:text-gray-500 text-center">
              Si la vista previa no carga, abre el sitio en una nueva pestaña.
            </p>
          </div>

          {credentials.length > 0 && (
            <div className="px-4 sm:px-5 py-4">
              <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400/95" strokeWidth={2} aria-hidden />
                Credenciales
              </h4>
              <div className="space-y-2">
                {credentials.map((cred, idx) => (
                  <div
                    key={cred.label}
                    className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 rounded-xl px-3.5 py-2.5 border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        {cred.label}
                      </p>
                      <p
                        className={`text-sm font-mono text-gray-800 dark:text-gray-100 mt-0.5 truncate ${
                          isSensitive(cred.label) && !revealed[idx] ? 'select-none' : ''
                        }`}
                      >
                        {isSensitive(cred.label) && !revealed[idx] ? mask(cred.value) : cred.value}
                      </p>
                    </div>
                    {isSensitive(cred.label) && (
                      <button
                        type="button"
                        onClick={() => toggleReveal(idx)}
                        className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all"
                        title={revealed[idx] ? `Ocultar ${cred.label.toLowerCase()}` : `Mostrar ${cred.label.toLowerCase()}`}
                        aria-pressed={!!revealed[idx]}
                      >
                        {revealed[idx] ? (
                          <EyeOff className="w-3.5 h-3.5" aria-hidden />
                        ) : (
                          <Eye className="w-3.5 h-3.5" aria-hidden />
                        )}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleCopy(cred.value, idx)}
                      className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-gray-700 transition-all"
                      title={`Copiar ${cred.label}`}
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div
          className="sm:hidden px-3 pt-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 0.75rem)' }}
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenExternal?.()}
            className="w-full inline-flex items-center justify-center gap-2 px-4 h-11 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" aria-hidden />
            Abrir en nueva pestaña
          </a>
        </div>
      </div>
    </div>
  );
}

/** Partículas mínimas en el fondo (muy baja opacidad). */
function LauncherAmbientParticles() {
  const specs = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        left: `${((i * 41) % 86) + 7}%`,
        top: `${((i * 29) % 72) + 10}%`,
        delay: `${(i % 10) * 0.82}s`,
        duration: `${14 + (i % 9)}s`,
        wh: i % 6 === 0 ? 2 : 1,
      })),
    []
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_85%,transparent)]"
    >
      {specs.map((s, i) => (
        <span
          key={i}
          className="launcher-particle-dot absolute rounded-full bg-violet-400/[0.12] dark:bg-indigo-300/[0.08]"
          style={{
            left: s.left,
            top: s.top,
            width: s.wh,
            height: s.wh,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        />
      ))}
    </div>
  );
}

/** Tooltip elegante para tiles (reemplaza `title` nativo). */
function LauncherTileTooltip({
  id,
  open,
  title,
  description,
}: {
  id: string;
  open: boolean;
  title: string;
  description: string;
}) {
  return (
    <div
      role="tooltip"
      aria-hidden={!open}
      id={id}
      className={`pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 z-[90] w-[min(280px,calc(100vw-2rem))] -translate-x-1/2 transition-[opacity,transform] duration-200 ease-out ${
        open
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none invisible translate-y-1 opacity-0'
      }`}
    >
      <div className="rounded-xl border border-gray-200/80 bg-white/95 px-3.5 py-3 text-center shadow-[0_12px_40px_-12px_rgba(15,23,42,0.2)] ring-1 ring-black/[0.03] backdrop-blur-md dark:border-gray-700/80 dark:bg-gray-900/95 dark:shadow-[0_16px_48px_-16px_rgba(0,0,0,0.65)] dark:ring-white/[0.06]">
        <p className="text-[13px] font-semibold leading-snug tracking-tight text-gray-900 dark:text-gray-50">
          {title}
        </p>
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>
      </div>
      <div
        className="absolute left-1/2 top-full mt-[-5px] h-2.5 w-2.5 -translate-x-1/2 rotate-45 border border-gray-200/80 border-t-0 border-l-0 bg-white/95 dark:border-gray-700/80 dark:bg-gray-900/95"
        aria-hidden
      />
    </div>
  );
}

/** Tile estilo "home screen" de celular: ícono cuadrado grande + nombre debajo. */
function LauncherTile({
  item,
  onOpen,
}: {
  item: LauncherItem;
  onOpen?: () => void;
}) {
  const tooltipId = useId();
  const rippleHostRef = useRef<HTMLSpanElement>(null);
  const tooltipDelayRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const disabled = item.comingSoon || !item.href;
  const tileBg = disabled ? 'bg-gray-100 dark:bg-gray-800' : getTileBg(item.iconClass);
  const iconColor = disabled
    ? 'text-gray-400 dark:text-gray-500'
    : `${item.iconClass} ${getIconDark(item.iconClass)}`;

  const scheduleTooltip = () => {
    clearTimeout(tooltipDelayRef.current);
    tooltipDelayRef.current = setTimeout(() => setTooltipOpen(true), 420);
  };
  const hideTooltip = () => {
    clearTimeout(tooltipDelayRef.current);
    setTooltipOpen(false);
  };

  useEffect(() => () => clearTimeout(tooltipDelayRef.current), []);

  const spawnRipple = (e: React.PointerEvent<HTMLElement>) => {
    if (disabled) return;
    const host = rippleHostRef.current;
    if (!host) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement('span');
    ripple.className = 'launcher-tile-ripple';
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    host.appendChild(ripple);
    window.setTimeout(() => ripple.remove(), 620);
  };

  const glowIdle =
    'shadow-[0_1px_2px_rgba(15,23,42,0.06),0_4px_12px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_8px_20px_-6px_rgba(0,0,0,0.55)]';
  const glowHover =
    'group-hover:shadow-[0_0_36px_-10px_rgba(147,51,234,0.38),0_2px_6px_rgba(15,23,42,0.07),0_14px_36px_-12px_rgba(15,23,42,0.12)] dark:group-hover:shadow-[0_0_42px_-12px_rgba(167,139,250,0.22),0_2px_8px_rgba(0,0,0,0.45),0_18px_40px_-14px_rgba(0,0,0,0.55)]';

  const iconBox = (
    <div className="relative">
      <div
        className={`relative z-[1] flex h-16 w-16 items-center justify-center overflow-hidden rounded-[18px] sm:h-[72px] sm:w-[72px] ${tileBg} ring-1 ring-black/[0.05] ring-offset-0 transition-[transform,box-shadow] duration-300 ease-out dark:ring-white/[0.07] ${glowIdle} ${
          disabled ? '' : `${glowHover} group-hover:-translate-y-1 group-active:translate-y-0 group-active:scale-[0.97]`
        }`}
        aria-hidden
      >
        <span
          className={
            disabled ? 'relative flex items-center justify-center' : 'launcher-tile-mark-pulse relative flex items-center justify-center'
          }
        >
          <LauncherMark
            item={item}
            variant="tile"
            tileIconClassName={`w-8 h-8 sm:w-9 sm:h-9 ${iconColor} motion-reduce:group-hover:scale-100 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-[1.06] group-active:scale-100`}
          />
        </span>
      </div>
      {!!item.credentials?.length && !disabled && (
        <span
          className="pointer-events-none absolute -right-0.5 -top-0.5 z-[110] flex h-[18px] w-[18px] items-center justify-center rounded-md border border-slate-200/95 bg-gradient-to-b from-white to-slate-50/95 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_3px_8px_-2px_rgba(15,23,42,0.12)] ring-1 ring-white/80 backdrop-blur-sm dark:border-slate-600/80 dark:from-slate-800 dark:to-slate-900 dark:shadow-[0_2px_8px_rgba(0,0,0,0.35)] dark:ring-white/5"
          aria-label="Tiene credenciales"
        >
          <KeyRound
            className="h-[11px] w-[11px] shrink-0 text-amber-600 dark:text-amber-400"
            strokeWidth={2.15}
            aria-hidden
          />
        </span>
      )}
    </div>
  );

  const label = (
    <div className="mt-2.5 w-full text-center">
      <p
        className={`text-[11px] sm:text-xs font-medium leading-tight line-clamp-2 ${
          disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-200'
        }`}
      >
        {item.title}
      </p>
      {disabled && (
        <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-200/70 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-500/20">
          Próximamente
        </span>
      )}
    </div>
  );

  const wrapperClass = 'group relative flex w-full flex-col items-center';

  const tooltipEl = (
    <LauncherTileTooltip
      id={tooltipId}
      open={tooltipOpen}
      title={item.title}
      description={item.description}
    />
  );

  if (disabled) {
    return (
      <div
        className={wrapperClass}
        onMouseEnter={scheduleTooltip}
        onMouseLeave={hideTooltip}
      >
        {tooltipEl}
        <div className="flex cursor-not-allowed flex-col items-center opacity-80 select-none" aria-disabled="true">
          {iconBox}
          {label}
        </div>
      </div>
    );
  }

  return (
    <div
      className={wrapperClass}
      onMouseEnter={scheduleTooltip}
      onMouseLeave={hideTooltip}
    >
      {tooltipEl}
      <button
        type="button"
        onClick={onOpen}
        onPointerDown={spawnRipple}
        onFocus={scheduleTooltip}
        onBlur={hideTooltip}
        aria-describedby={tooltipOpen ? tooltipId : undefined}
        className="relative flex w-full cursor-pointer flex-col items-center rounded-2xl border-0 bg-transparent p-0 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950"
      >
        <span
          ref={rippleHostRef}
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl"
          aria-hidden
        />
        <span className="relative z-[1] flex w-full flex-col items-center">
          {iconBox}
          {label}
        </span>
      </button>
    </div>
  );
}

function ThemeSwitch({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === 'dark';
  return (
    <div className="flex items-center gap-2 rounded-full border border-gray-200/70 bg-white/50 hadow-sm backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/40 dark:shadow-none">
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Modo oscuro activo. Cambiar a modo claro' : 'Modo claro activo. Cambiar a modo oscuro'}
        onClick={onToggle}
        suppressHydrationWarning
        className={`relative h-[26px] w-[48px] shrink-0 cursor-pointer rounded-full p-[3px] transition-[background,box-shadow,border-color] duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950 ${
          isDark
            ? 'border border-violet-600/35 bg-gradient-to-b from-violet-500 to-violet-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_1px_2px_rgba(15,23,42,0.08),0_2px_8px_-2px_rgba(91,33,182,0.35)] dark:border-violet-400/25 dark:from-violet-500 dark:to-violet-800 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_2px_10px_-2px_rgba(0,0,0,0.45)]'
            : 'border border-gray-200/90 bg-gradient-to-b from-gray-100 to-gray-200/95 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_1px_2px_rgba(15,23,42,0.05)] dark:border-gray-600/80 dark:from-gray-700 dark:to-gray-800 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_2px_rgba(0,0,0,0.2)]'
        }`}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute left-[3px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-gradient-to-b from-white to-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(15,23,42,0.08),0_2px_6px_-1px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.06] transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)] will-change-transform dark:from-gray-100 dark:to-gray-200 dark:ring-black/20 ${
            isDark ? 'translate-x-[22px]' : 'translate-x-0'
          }`}
        />
        <span className="sr-only">{isDark ? 'Oscuro' : 'Claro'}</span>
      </button>
    </div>
  );
}

export function AppLauncherMenu({ appTitle = 'Herramientas Data BI - CNE', onLogout }: AppLauncherMenuProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [previewItem, setPreviewItem] = useState<LauncherItem | null>(null);
  const { theme, toggle } = useTheme();
  const { toasts, push: pushToast } = useToasts();
  const { tab: activeTab, setTab } = useActiveTab();

  const activeTabDef = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const visibleSections = SECTIONS.filter((s) =>
    (activeTabDef.sectionIds as readonly string[]).includes(s.id)
  );
  const hideSingleSectionTitle =
    visibleSections.length === 1 && visibleSections[0].id === activeTabDef.id;

  /** Índices globales para animación escalonada de tiles al cambiar de pestaña. */
  const sectionsWithStagger = useMemo(() => {
    let tileIdx = 0;
    return visibleSections.map((section, sectionIdx) => ({
      section,
      sectionIdx,
      tileDelays: section.items.map(() => tileIdx++),
    }));
  }, [visibleSections]);

  const handleCerrarSesion = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch(API.logout, { method: 'POST', credentials: 'include' });
    } finally {
      await onLogout?.();
      setLoggingOut(false);
    }
  };

  /**
   * Copia la credencial sensible (si existe) al portapapeles y notifica al usuario.
   * Importante: por seguridad del navegador no podemos auto-completar el formulario
   * del sitio destino, pero sí dejar la contraseña lista para Ctrl+V.
   */
  const autoCopyCredential = async (item: LauncherItem) => {
    const cred = getCopyableCredential(item);
    if (!cred) return;
    const ok = await copyToClipboard(cred.value);
    if (ok) {
      pushToast(`${cred.label} copiada — pega con Ctrl+V en el login`);
    } else {
      pushToast('No se pudo copiar al portapapeles', 'error');
    }
  };

  const handleOpenPreview = (item: LauncherItem) => {
    setPreviewItem(item);
    autoCopyCredential(item);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-auto bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-950 dark:to-black transition-colors">
      {/* Glow decorativos + gradiente en movimiento muy lento */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 min-h-[520px] overflow-hidden z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[460px] w-[860px]">
          <div className="launcher-blob-inner h-full w-full rounded-full bg-purple-300/25 blur-3xl dark:bg-purple-500/15" />
        </div>
        <div className="absolute -top-20 right-[12%] h-[300px] w-[420px]">
          <div className="launcher-blob-inner launcher-blob-inner--b h-full w-full rounded-full bg-sky-300/20 blur-3xl dark:bg-sky-500/10" />
        </div>
        <div className="absolute -top-16 left-[8%] h-[260px] w-[380px]">
          <div className="launcher-blob-inner launcher-blob-inner--c h-full w-full rounded-full bg-rose-300/15 blur-3xl dark:bg-fuchsia-500/10" />
        </div>
      </div>
      <LauncherAmbientParticles />
      <div className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-gray-200/70 dark:border-gray-800/70 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl px-4 sm:px-6">
        <Image
          src="/appbi-logo.svg"
          alt="AppBI"
          width={280}
          height={90}
          className="h-9 w-auto sm:h-10 shrink-0 dark:invert dark:brightness-110"
          priority
        />
        <div className="flex items-center gap-3 shrink-0">
          <ThemeSwitch theme={theme} onToggle={toggle} />
          <button
            type="button"
            onClick={handleCerrarSesion}
            disabled={loggingOut}
            className="border-0 bg-transparent p-0 text-sm font-medium text-slate-600 underline-offset-4 transition-colors hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white disabled:opacity-50 cursor-pointer shrink-0"
          >
            {loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col">
        <header className="px-6 pt-10 pb-5 text-center max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-[28px] font-semibold tracking-tight bg-gradient-to-b from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {appTitle}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Seleccione un módulo. Los enlaces se abren en una nueva pestaña.
          </p>
        </header>

        <div className="max-w-4xl mx-auto w-full flex-1 px-5 sm:px-8 pb-8">
          <TabBar activeTab={activeTab} onChange={setTab} />

          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
          >
            <div key={activeTab} className="launcher-tab-panel-inner space-y-8">
              {sectionsWithStagger.map(({ section, sectionIdx, tileDelays }) => {
                const showTitle = section.title && !hideSingleSectionTitle;
                return (
                  <section
                    key={section.id}
                    aria-labelledby={showTitle ? `section-${section.id}` : undefined}
                  >
                    {showTitle && (
                      <div
                        className="launcher-section-head mb-5 flex items-center gap-3 px-1"
                        style={{ ['--section-delay' as string]: String(sectionIdx) }}
                      >
                        <h2
                          id={`section-${section.id}`}
                          className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400"
                        >
                          {section.title}
                        </h2>
                        <div
                          className="h-px flex-1 bg-gradient-to-r from-gray-300/70 via-gray-300/35 to-transparent dark:from-gray-600 dark:via-gray-700/50 dark:to-transparent"
                          aria-hidden
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-7 md:grid-cols-5 lg:grid-cols-6">
                      {section.items.map((item, i) => (
                        <div
                          key={item.id}
                          className="launcher-tile-wrap min-w-0"
                          style={{ ['--tile-delay' as string]: String(tileDelays[i]) }}
                        >
                          <LauncherTile item={item} onOpen={() => handleOpenPreview(item)} />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}

              {visibleSections.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                  No hay aplicaciones en esta pestaña todavía.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="relative z-10 mt-auto shrink-0 border-t border-gray-200/70 dark:border-gray-800/70 bg-white/40 dark:bg-gray-950/40 backdrop-blur px-4 py-4 text-center text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
        Copyright © Data BI - CNE
      </footer>

      <AppPreviewModal
        item={previewItem}
        onClose={() => setPreviewItem(null)}
        onOpenExternal={() => previewItem && autoCopyCredential(previewItem)}
      />

      <ToastViewport toasts={toasts} />
    </div>
  );
}
