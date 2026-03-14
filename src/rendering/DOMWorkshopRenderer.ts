/**
 * DOMWorkshopRenderer - 2D DOM-based rendering for extreme performance
 *
 * Targets <5% CPU by:
 * - No WebGL/Three.js overhead
 * - CSS-based animations (hardware accelerated)
 * - DOM rendering only when needed
 * - Emoji icons instead of 3D models
 */

import type { WorkshopRenderer, Zone, ClaudeRenderer, Station } from './WorkshopRenderer'
import type { ManagedSession } from '../../shared/types'

interface DOMZone extends Zone {
  element: HTMLDivElement
  stations: Map<string, HTMLDivElement>
  claude: DOMClaude
  notifications: HTMLDivElement[]
}

interface DOMClaude extends ClaudeRenderer {
  element: HTMLDivElement
  state: 'idle' | 'walking' | 'working' | 'thinking'
  currentStation: string | null
}

const STATION_ICONS: Record<string, string> = {
  bookshelf: '📚',
  terminal: '💻',
  workbench: '🔧',
  desk: '✏️',
  scanner: '🔍',
  antenna: '📡',
  portal: '🌀',
  taskboard: '📋',
  center: '🏠',
}

const STATION_LABELS: Record<string, string> = {
  bookshelf: 'Read',
  terminal: 'Bash',
  workbench: 'Edit',
  desk: 'Write',
  scanner: 'Grep',
  antenna: 'Web',
  portal: 'Task',
  taskboard: 'Todo',
  center: 'Center',
}

/**
 * Generate a consistent color for a session based on its ID
 * Uses a hash function to convert session ID to a color
 */
function generateZoneColor(sessionId: string): number {
  let hash = 0
  for (let i = 0; i < sessionId.length; i++) {
    hash = sessionId.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Generate color with good saturation and lightness for visibility
  const h = Math.abs(hash % 360)
  return hslToRgb(h / 360, 0.7, 0.5)
}

/**
 * Convert HSL to RGB number (0xRRGGBB)
 */
function hslToRgb(h: number, s: number, l: number): number {
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255)
}


export class DOMWorkshopRenderer implements WorkshopRenderer {
  private container: HTMLElement | null = null
  private zones: Map<string, DOMZone> = new Map()
  private focusedZoneId: string | null = null
  private lastFocusedZoneId: string | null = null  // Track to avoid unnecessary DOM ops
  private lastRenderTime = 0
  private needsRender = false
  private colorCache = new Map<string, number>()  // Cache computed colors

  /**
   * Initialize the DOM renderer
   */
  init(container: HTMLElement): void {
    this.container = container
    container.className = 'workshop-2d-container'
    container.innerHTML = ''

    // Create zones container
    const zonesContainer = document.createElement('div')
    zonesContainer.className = 'zones-container-2d'
    container.appendChild(zonesContainer)
  }

  /**
   * Create a new zone for a session
   */
  createZone(session: ManagedSession): Zone {
    if (!this.container) {
      throw new Error('Renderer not initialized')
    }

    const zonesContainer = this.container.querySelector('.zones-container-2d') as HTMLElement
    if (!zonesContainer) {
      throw new Error('Zones container not found')
    }

    // Create zone element
    const zoneEl = document.createElement('div')
    zoneEl.className = 'zone-2d'
    zoneEl.dataset.sessionId = session.id

    // Use cached color generation to avoid recomputation
    const color = this.getCachedColor(session.id)
    zoneEl.style.backgroundColor = `#${color.toString(16).padStart(6, '0')}`

    // Create zone floor (hexagon shape)
    const floor = document.createElement('div')
    floor.className = 'zone-floor-2d'
    zoneEl.appendChild(floor)

    // Create stations grid
    const stationsGrid = this.createStationsGrid()
    zoneEl.appendChild(stationsGrid)

    // Create Claude character
    const claude = this.createClaude()
    zoneEl.appendChild(claude.element)

    // Create notification container
    const notificationContainer = document.createElement('div')
    notificationContainer.className = 'zone-notifications-2d'
    zoneEl.appendChild(notificationContainer)

    // Add to DOM
    zonesContainer.appendChild(zoneEl)

    // Create zone object
    const domZone: DOMZone = {
      sessionId: session.id,
      element: zoneEl,
      stations: new Map(),
      claude,
      notifications: [],
      position: { x: 0, z: 0 }, // Simplified for 2D
    }

    // Store stations reference
    Array.from(stationsGrid.children).forEach((stationEl) => {
      const stationType = stationEl.getAttribute('data-station')!
      domZone.stations.set(stationType, stationEl as HTMLDivElement)
    })

    this.zones.set(session.id, domZone)
    this.needsRender = true

    return domZone
  }

  /**
   * Create the stations grid
   */
  private createStationsGrid(): HTMLElement {
    const grid = document.createElement('div')
    grid.className = 'stations-grid-2d'

    const stationTypes = [
      'bookshelf', 'terminal', 'workbench',
      'desk', 'scanner', 'antenna',
      'portal', 'taskboard', 'center',
    ]

    stationTypes.forEach((type) => {
      const station = document.createElement('div')
      station.className = `station-2d station-${type}`
      station.dataset.station = type
      station.innerHTML = `
        <span class="station-icon-2d">${STATION_ICONS[type]}</span>
        <span class="station-label-2d">${STATION_LABELS[type]}</span>
      `
      grid.appendChild(station)
    })

    return grid
  }

  /**
   * Create Claude character element
   */
  private createClaude(): DOMClaude {
    const claudeEl = document.createElement('div')
    claudeEl.className = 'claude-2d idle'
    claudeEl.innerHTML = '<span class="claude-icon-2d">🤖</span>'

    return {
      element: claudeEl,
      state: 'idle',
      currentStation: null,
      setState: (state: 'idle' | 'walking' | 'working' | 'thinking') => {
        claudeEl.className = `claude-2d ${state}`
      },
      moveTo: (station: string) => {
        // Animate to station
        const stationEl = claudeEl.parentElement?.querySelector(`[data-station="${station}"]`) as HTMLElement
        if (stationEl) {
          const rect = stationEl.getBoundingClientRect()
          const parentRect = claudeEl.parentElement!.getBoundingClientRect()

          const x = rect.left - parentRect.left + rect.width / 2
          const y = rect.top - parentRect.top + rect.height / 2

          claudeEl.style.left = `${x}px`
          claudeEl.style.top = `${y}px`
        }
      },
    }
  }

  /**
   * Update an existing zone
   */
  updateZone(session: ManagedSession): void {
    const zone = this.zones.get(session.id)
    if (!zone) return

    // Update status (color is generated from session ID, doesn't change)
    zone.element.dataset.status = session.status

    this.needsRender = true
  }

  /**
   * Remove a zone
   */
  removeZone(sessionId: string): void {
    const zone = this.zones.get(sessionId)
    if (!zone) return

    zone.element.remove()
    this.zones.delete(sessionId)
    this.needsRender = true
  }

  /**
   * Get the Claude character for a session
   */
  getClaude(sessionId: string): ClaudeRenderer | null {
    const zone = this.zones.get(sessionId)
    return zone?.claude || null
  }

  /**
   * Set the focused zone
   */
  setFocusedZone(sessionId: string | null): void {
    // Remove focus from previous zone
    if (this.focusedZoneId) {
      const prevZone = this.zones.get(this.focusedZoneId)
      if (prevZone) {
        prevZone.element.classList.remove('focused')
      }
    }

    // Add focus to new zone
    this.focusedZoneId = sessionId
    if (sessionId) {
      const zone = this.zones.get(sessionId)
      if (zone) {
        zone.element.classList.add('focused')
      }
    }

    this.needsRender = true
  }

  /**
   * Show notification for a zone
   */
  showNotification(sessionId: string, notification: {
    text: string
    style?: 'success' | 'info' | 'warning' | 'error' | 'muted'
    icon?: string
    duration?: number
  }): void {
    const zone = this.zones.get(sessionId)
    if (!zone) return

    const container = zone.element.querySelector('.zone-notifications-2d') as HTMLElement
    if (!container) return

    const notifEl = document.createElement('div')
    notifEl.className = `notification-2d notification-${notification.style || 'info'}`
    notifEl.innerHTML = `
      ${notification.icon ? `<span class="notification-icon-2d">${notification.icon}</span>` : ''}
      <span class="notification-text-2d">${notification.text}</span>
    `

    container.appendChild(notifEl)

    // Auto-remove after duration
    const duration = notification.duration || 3000
    setTimeout(() => {
      notifEl.classList.add('fade-out')
      setTimeout(() => notifEl.remove(), 300)
    }, duration)
  }

  /**
   * Main render loop - only updates if needed
   */
  render(delta: number): void {
    // Throttle rendering - only update DOM when something changed
    if (!this.needsRender) return

    const now = performance.now()
    // Limit DOM updates to 30fps max
    // Don't reset needsRender yet to avoid dropping updates during throttle window
    if (now - this.lastRenderTime < 33) return

    // Only update focused zone styling (avoid forEach over all zones)
    if (this.focusedZoneId !== this.lastFocusedZoneId) {
      if (this.lastFocusedZoneId) {
        const prevZone = this.zones.get(this.lastFocusedZoneId)
        prevZone?.element.classList.remove('focused')
      }
      if (this.focusedZoneId) {
        const newZone = this.zones.get(this.focusedZoneId)
        newZone?.element.classList.add('focused')
      }
      this.lastFocusedZoneId = this.focusedZoneId
    }

    this.lastRenderTime = now
    this.needsRender = false
  }

  /**
   * Get zone color with caching to avoid recomputation
   */
  private getCachedColor(sessionId: string): number {
    if (this.colorCache.has(sessionId)) {
      return this.colorCache.get(sessionId)!
    }
    const color = generateZoneColor(sessionId)
    this.colorCache.set(sessionId, color)
    return color
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    this.zones.forEach((zone) => {
      zone.element.remove()
    })
    this.zones.clear()
    if (this.container) {
      this.container.innerHTML = ''
    }
    this.container = null
    this.focusedZoneId = null
  }
}
