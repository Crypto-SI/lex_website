import { describe, it, expect } from 'vitest'
import {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  meetsWCAGStandard,
  validateColorContrast,
  suggestAccessibleColors,
} from '../colorContrast'

describe('colorContrast utilities', () => {
  describe('hexToRgb', () => {
    it('should convert hex color to RGB', () => {
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should handle short hex format', () => {
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 })
      expect(hexToRgb('#f00')).toEqual({ r: 255, g: 0, b: 0 })
    })

    it('should return null for invalid hex colors', () => {
      expect(hexToRgb('invalid')).toBeNull()
      expect(hexToRgb('#gggggg')).toBeNull()
      expect(hexToRgb('')).toBeNull()
    })
  })

  describe('getLuminance', () => {
    it('should calculate correct luminance for white', () => {
      const white = { r: 255, g: 255, b: 255 }
      expect(getLuminance(white)).toBe(1)
    })

    it('should calculate correct luminance for black', () => {
      const black = { r: 0, g: 0, b: 0 }
      expect(getLuminance(black)).toBe(0)
    })

    it('should calculate luminance for gray', () => {
      const gray = { r: 128, g: 128, b: 128 }
      const luminance = getLuminance(gray)
      expect(luminance).toBeGreaterThan(0)
      expect(luminance).toBeLessThan(1)
    })
  })

  describe('getContrastRatio', () => {
    it('should calculate maximum contrast ratio for black and white', () => {
      expect(getContrastRatio('#000000', '#ffffff')).toBe(21)
      expect(getContrastRatio('#ffffff', '#000000')).toBe(21)
    })

    it('should calculate minimum contrast ratio for identical colors', () => {
      expect(getContrastRatio('#ffffff', '#ffffff')).toBe(1)
      expect(getContrastRatio('#000000', '#000000')).toBe(1)
    })

    it('should calculate intermediate contrast ratios', () => {
      const ratio = getContrastRatio('#666666', '#ffffff')
      expect(ratio).toBeGreaterThan(1)
      expect(ratio).toBeLessThan(21)
    })
  })

  describe('meetsWCAGStandard', () => {
    it('should pass AA standard for sufficient contrast', () => {
      expect(meetsWCAGStandard('#000000', '#ffffff', 'AA')).toBe(true)
      expect(meetsWCAGStandard('#333333', '#ffffff', 'AA')).toBe(true)
    })

    it('should fail AA standard for insufficient contrast', () => {
      expect(meetsWCAGStandard('#cccccc', '#ffffff', 'AA')).toBe(false)
      expect(meetsWCAGStandard('#888888', '#ffffff', 'AA')).toBe(false)
    })

    it('should pass AAA standard for high contrast', () => {
      expect(meetsWCAGStandard('#000000', '#ffffff', 'AAA')).toBe(true)
    })

    it('should fail AAA standard for moderate contrast', () => {
      expect(meetsWCAGStandard('#666666', '#ffffff', 'AAA')).toBe(false)
    })
  })

  describe('validateColorContrast', () => {
    it('should return validation result for valid colors', () => {
      const result = validateColorContrast('#000000', '#ffffff')
      expect(result.isValid).toBe(true)
      expect(result.ratio).toBe(21)
      expect(result.meetsAA).toBe(true)
      expect(result.meetsAAA).toBe(true)
    })

    it('should handle invalid colors', () => {
      const result = validateColorContrast('invalid', '#ffffff')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('suggestAccessibleColors', () => {
    it('should suggest accessible colors for insufficient contrast', () => {
      const suggestions = suggestAccessibleColors('#cccccc', '#ffffff')
      expect(suggestions).toHaveLength(2)
      expect(suggestions[0].meetsAA).toBe(true)
      expect(suggestions[1].meetsAAA).toBe(true)
    })

    it('should return empty array for already accessible colors', () => {
      const suggestions = suggestAccessibleColors('#000000', '#ffffff')
      expect(suggestions).toHaveLength(0)
    })
  })
})