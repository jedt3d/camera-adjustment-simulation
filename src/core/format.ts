// Copyrights © 2026 by Worajedt Sitthidumrong

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function formatMeters(mm: number) {
  if (!Number.isFinite(mm)) {
    return '∞';
  }

  return `${(mm / 1000).toFixed(2)} m`;
}

export function formatDof(mm: number) {
  if (!Number.isFinite(mm)) {
    return '∞';
  }

  if (mm < 10) {
    return `${mm.toFixed(1)} mm`;
  }

  if (mm < 1000) {
    return `${Math.round(mm / 10)} cm`;
  }

  return `${(mm / 1000).toFixed(2)} m`;
}

export function formatFocusDistance(meters: number) {
  return Number.isFinite(meters) ? `${meters.toFixed(1)} m` : '∞';
}

export function formatShutter(seconds: number) {
  if (seconds < 1) {
    return `1/${Math.round(1 / seconds)}`;
  }

  return `${seconds.toFixed(seconds >= 1 ? 0 : 1)}s`;
}
