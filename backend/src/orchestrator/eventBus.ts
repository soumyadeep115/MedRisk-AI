import { EventEmitter } from 'events'

export type AgentSource =
  | 'CAPACITY'
  | 'STAFF'
  | 'EQUIPMENT'
  | 'WEATHER'
  | 'CCTV'

export type AgentStateUpdateEvent = {
  event_type: 'AGENT_STATE_UPDATED'
  source_agent: AgentSource
  hospital_id: string
  risk_level: 'SAFE' | 'WARNING' | 'CRITICAL'
  timestamp: number
  correlation_id: string
}

class AgentEventBus extends EventEmitter {
  emitAgentStateUpdate(event: AgentStateUpdateEvent) {
    this.emit('AGENT_STATE_UPDATED', event)
  }

  onAgentStateUpdate(
    handler: (event: AgentStateUpdateEvent) => void
  ) {
    this.on('AGENT_STATE_UPDATED', handler)
  }
}

export const eventBus = new AgentEventBus()
