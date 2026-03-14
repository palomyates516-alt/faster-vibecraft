/**
 * Rendering module barrel export
 *
 * Exports all renderer-related types and implementations
 */

export type { WorkshopRenderer, Zone, Station, ClaudeRenderer } from './WorkshopRenderer'
export type { PerformanceConfig, DEFAULT_PERFORMANCE_CONFIG } from '../config/PerformanceConfig'
export { loadPerformanceConfig, savePerformanceConfig, resetPerformanceConfig } from '../config/PerformanceConfig'

export { DOMWorkshopRenderer } from './DOMWorkshopRenderer'

// Note: ThreeDWorkshopRenderer is the existing WorkshopScene.ts
// It should be imported separately to avoid circular dependencies
