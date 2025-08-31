// Color contrast validation utilities

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

/**
 * Convert hex color to RGB
 */
export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/**
 * Convert RGB to HSL
 */
export const rgbToHsl = ({ r, g, b }: RGB): HSL => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Calculate relative luminance of a color
 */
export const getRelativeLuminance = ({ r, g, b }: RGB): number => {
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

/**
 * Calculate contrast ratio between two colors
 */
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Please use hex colors.');
  }

  const luminance1 = getRelativeLuminance(rgb1);
  const luminance2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Check if color combination meets WCAG contrast requirements
 */
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean => {
  const ratio = getContrastRatio(foreground, background);
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7;
  }
  
  // AA level
  return size === 'large' ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Get contrast level description
 */
export const getContrastLevel = (
  foreground: string,
  background: string,
  size: 'normal' | 'large' = 'normal'
): 'AAA' | 'AA' | 'Fail' => {
  const ratio = getContrastRatio(foreground, background);
  
  if (size === 'large') {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'Fail';
  }
  
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return 'Fail';
};

/**
 * Suggest better contrast color
 */
export const suggestBetterContrast = (
  foreground: string,
  background: string,
  targetLevel: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): string => {
  const targetRatio = targetLevel === 'AAA' 
    ? (size === 'large' ? 4.5 : 7)
    : (size === 'large' ? 3 : 4.5);

  const bgRgb = hexToRgb(background);
  const fgRgb = hexToRgb(foreground);
  
  if (!bgRgb || !fgRgb) {
    throw new Error('Invalid color format');
  }

  const bgLuminance = getRelativeLuminance(bgRgb);
  const fgHsl = rgbToHsl(fgRgb);
  
  // Try adjusting lightness
  let adjustedL = fgHsl.l;
  const step = bgLuminance > 0.5 ? -5 : 5; // Darken for light bg, lighten for dark bg
  
  while (adjustedL >= 0 && adjustedL <= 100) {
    const adjustedColor = hslToHex({ ...fgHsl, l: adjustedL });
    const ratio = getContrastRatio(adjustedColor, background);
    
    if (ratio >= targetRatio) {
      return adjustedColor;
    }
    
    adjustedL += step;
  }
  
  // If we can't find a good contrast, return black or white
  return bgLuminance > 0.5 ? '#000000' : '#ffffff';
};

/**
 * Convert HSL to hex
 */
export const hslToHex = ({ h, s, l }: HSL): string => {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Validate color contrast for a component
 */
export const validateComponentContrast = (
  element: HTMLElement,
  options: {
    level?: 'AA' | 'AAA';
    size?: 'normal' | 'large';
    checkChildren?: boolean;
  } = {}
): {
  isValid: boolean;
  ratio: number;
  level: 'AAA' | 'AA' | 'Fail';
  suggestions?: string[];
} => {
  const { level = 'AA', size = 'normal', checkChildren = false } = options;
  
  const computedStyle = window.getComputedStyle(element);
  const color = computedStyle.color;
  const backgroundColor = computedStyle.backgroundColor;
  
  // Convert colors to hex (simplified - in real implementation you'd need more robust color parsing)
  const colorHex = rgbToHex(color);
  const bgHex = rgbToHex(backgroundColor);
  
  if (!colorHex || !bgHex) {
    return {
      isValid: false,
      ratio: 0,
      level: 'Fail',
      suggestions: ['Could not determine colors for contrast analysis']
    };
  }
  
  const ratio = getContrastRatio(colorHex, bgHex);
  const contrastLevel = getContrastLevel(colorHex, bgHex, size);
  const isValid = meetsContrastRequirement(colorHex, bgHex, level, size);
  
  const suggestions: string[] = [];
  if (!isValid) {
    const betterColor = suggestBetterContrast(colorHex, bgHex, level, size);
    suggestions.push(`Try using ${betterColor} for better contrast`);
  }
  
  return {
    isValid,
    ratio,
    level: contrastLevel,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
};

/**
 * Helper function to convert RGB string to hex (simplified)
 */
const rgbToHex = (rgb: string): string | null => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};