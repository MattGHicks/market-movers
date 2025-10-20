/**
 * Enhanced color coding with intensity levels for professional trading UI
 */

export type ColorIntensity = 'dark' | 'base' | 'light' | 'neutral';

export interface ColorResult {
  className: string;
  style: React.CSSProperties;
}

/**
 * Get color class and style based on value intensity
 * @param value - The numeric value (percentage or absolute)
 * @param type - Whether it's a gain or loss
 * @returns CSS class name and inline styles
 */
export function getColorByIntensity(
  value: number,
  type: 'gain' | 'loss'
): ColorResult {
  const absValue = Math.abs(value);

  if (type === 'gain') {
    if (absValue >= 10) {
      return {
        className: 'text-green-dark',
        style: { color: 'var(--green-dark)', fontWeight: 600 },
      };
    }
    if (absValue >= 5) {
      return {
        className: 'text-green-base',
        style: { color: 'var(--green-base)', fontWeight: 500 },
      };
    }
    if (absValue >= 2) {
      return {
        className: 'text-green-light',
        style: { color: 'var(--green-light)' },
      };
    }
  } else {
    if (absValue >= 10) {
      return {
        className: 'text-red-dark',
        style: { color: 'var(--red-dark)', fontWeight: 600 },
      };
    }
    if (absValue >= 5) {
      return {
        className: 'text-red-base',
        style: { color: 'var(--red-base)', fontWeight: 500 },
      };
    }
    if (absValue >= 2) {
      return {
        className: 'text-red-light',
        style: { color: 'var(--red-light)' },
      };
    }
  }

  return {
    className: '',
    style: { color: 'var(--text-secondary)' },
  };
}

/**
 * Get color based on change value (auto-detects gain/loss)
 */
export function getChangeColor(value: number): ColorResult {
  if (value === 0) {
    return {
      className: '',
      style: { color: 'var(--text-secondary)' },
    };
  }
  return getColorByIntensity(value, value > 0 ? 'gain' : 'loss');
}

/**
 * Get color for volume based on relative volume ratio
 */
export function getVolumeColor(volume: number, avgVolume: number): ColorResult {
  if (!avgVolume || avgVolume === 0) {
    return {
      className: '',
      style: { color: 'var(--text-primary)' },
    };
  }

  const ratio = volume / avgVolume;

  if (ratio >= 3) {
    // 3x+ unusual activity
    return {
      className: 'text-yellow',
      style: { color: 'var(--yellow-base)', fontWeight: 500 },
    };
  }
  if (ratio >= 2) {
    // 2x+ high volume
    return {
      className: 'text-blue',
      style: { color: 'var(--blue-base)' },
    };
  }

  return {
    className: '',
    style: { color: 'var(--text-primary)' },
  };
}

/**
 * Get row background color for color-coded tables
 */
export function getRowBackgroundColor(
  change: number,
  isHovered: boolean = false
): React.CSSProperties {
  if (change === 0) {
    return {
      background: isHovered ? 'var(--bg-hover)' : 'transparent',
    };
  }

  if (change > 0) {
    if (change >= 5) {
      return {
        background: isHovered
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(16, 185, 129, 0.08)',
      };
    }
    return {
      background: isHovered
        ? 'rgba(16, 185, 129, 0.1)'
        : 'rgba(16, 185, 129, 0.05)',
    };
  } else {
    if (change <= -5) {
      return {
        background: isHovered
          ? 'rgba(239, 68, 68, 0.15)'
          : 'rgba(239, 68, 68, 0.08)',
      };
    }
    return {
      background: isHovered
        ? 'rgba(239, 68, 68, 0.1)'
        : 'rgba(239, 68, 68, 0.05)',
    };
  }
}
