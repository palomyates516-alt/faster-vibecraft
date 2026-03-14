/**
 * Performance Configuration for Vibecraft
 *
 * Centralized configuration for performance-related settings.
 * All defaults favor lower CPU usage over visual effects.
 *
 * Uses single JSON serialization pattern for localStorage management
 * (similar to KeybindConfig.ts for consistency)
 */

export interface PerformanceConfig {
  // Rendering mode
  renderMode: '3d' | '2d'  // 3D (Three.js) or 2D (DOM-based)
  worldGrid: boolean  // Show world hex grid (127 hexes) - 3D only

  // Polling intervals (in milliseconds)
  terminalPollInterval: number  // Terminal output polling

  // Animation settings
  enableAmbientParticles: boolean  // Floating particles in scene - 3D only
  enableZoneParticles: boolean     // Particles from zone activity - 3D only
}

/**
 * Default performance configuration
 * Optimized for low CPU usage
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  // Render mode: 3D by default for full experience
  renderMode: '3d',

  // World grid disabled by default (saves ~15% CPU)
  worldGrid: false,

  // Terminal polling: 5s interval (was 2s, saves ~2-5% CPU)
  terminalPollInterval: 5000,

  // Particles disabled by default (saves ~5-10% CPU)
  enableAmbientParticles: false,
  enableZoneParticles: false,
}

const STORAGE_KEY = 'vibecraft-performance-config'

/**
 * Load performance config from localStorage
 * Uses single JSON serialization for consistency with other config modules
 */
export function loadPerformanceConfig(): PerformanceConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_PERFORMANCE_CONFIG, ...JSON.parse(stored) }
    }
  } catch (e) {
    console.warn('Failed to load performance config from localStorage:', e)
  }
  return { ...DEFAULT_PERFORMANCE_CONFIG }
}

/**
 * Save performance config to localStorage
 * Merges with existing config to preserve unspecified settings
 */
export function savePerformanceConfig(config: Partial<PerformanceConfig>): void {
  try {
    const current = loadPerformanceConfig()
    const merged = { ...current, ...config }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
  } catch (e) {
    console.warn('Failed to save performance config to localStorage:', e)
  }
}

/**
 * Reset to defaults
 */
export function resetPerformanceConfig(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (e) {
    console.warn('Failed to reset performance config:', e)
  }
}
