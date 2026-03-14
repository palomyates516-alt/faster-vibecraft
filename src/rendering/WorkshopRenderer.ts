/**
 * Workshop Renderer Interface
 *
 * Abstraction for different rendering backends (Three.js vs DOM)
 * Allows switching between 3D and 2D rendering modes
 */

import type { ManagedSession } from '../../shared/types'

export interface Zone {
  sessionId: string
  element?: HTMLElement
  position?: { x: number; z: number }
  update?: (delta: number) => void
}

export interface Station {
  type: string
  element?: HTMLElement
}

export interface ClaudeRenderer {
  element?: HTMLElement
  setState?: (state: 'idle' | 'walking' | 'working' | 'thinking') => void
  moveTo?: (station: string) => void
}

export interface WorkshopRenderer {
  /**
   * Initialize the renderer with a container element
   */
  init(container: HTMLElement): void

  /**
   * Create a new zone for a session
   */
  createZone(session: ManagedSession): Zone

  /**
   * Update an existing zone
   */
  updateZone(session: ManagedSession): void

  /**
   * Remove a zone
   */
  removeZone(sessionId: string): void

  /**
   * Get the Claude character renderer
   */
  getClaude(sessionId: string): ClaudeRenderer | null

  /**
   * Set the focused zone
   */
  setFocusedZone(sessionId: string | null): void

  /**
   * Show notification for a zone
   */
  showNotification(sessionId: string, notification: {
    text: string
    style?: 'success' | 'info' | 'warning' | 'error' | 'muted'
    icon?: string
    duration?: number
  }): void

  /**
   * Main render loop (called every frame)
   */
  render(delta: number): void

  /**
   * Clean up resources
   */
  dispose(): void
}
