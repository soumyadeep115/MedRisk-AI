MedRisk AI- Deterministic Event-Driven Multi-Agent Architecture with Long-Term Vector Memory for Proactive Healthcare Risk Orchestration

Agentic Healthcare Risk Intelligence & Operations Platform

======================================================================
PROJECT POSITIONING
======================================================================

MedRisk AI is a Deterministic, Event-Driven Multi-Agent Architecture 
with Long-Term Vector Memory designed for Proactive Healthcare Risk 
Orchestration and Operational Resilience.
It combines autonomous risk intelligence with structured hospital 
operations management, transforming reactive monitoring systems into 
proactive, explainable, memory-aware healthcare infrastructure.

======================================================================
OVERVIEW
======================================================================

MedRisk AI is an Agentic, Memory-Driven Healthcare Risk Intelligence Platform 
designed to proactively detect, explain, and mitigate operational risks in 
hospitals during high-stress scenarios such as:
• Epidemics  
• Pollution surges  
• Crowd influxes  
• Staffing shortages  
• Infrastructure strain  
Traditional hospital dashboards are reactive and siloed, focusing only on 
real-time metrics without historical context.
MedRisk AI addresses this limitation by introducing autonomous, explainable 
risk agents backed by long-term vector memory and deterministic orchestration.

MedRisk AI is a hybrid system combining:
• Agentic Intelligence Layer (Risk Prediction & Explainability)  
• Operational Management Layer (Rooms, Patients, Inventory, Billing)  
This transforms the platform from pure intelligence into a full operational 
simulation + risk intelligence ecosystem.

======================================================================
PROBLEM ADDRESSED
======================================================================

Hospitals often fail not due to lack of medical expertise, but due to 
delayed awareness of operational risks.

Critical signals such as:
• ICU and bed utilization  
• Equipment and supply shortages  
• Environmental stress (AQI, temperature)  
• Crowd congestion  
are typically monitored independently.

• Sudden bed exhaustion without early warning  
• Manual admission decisions during capacity crisis  
• Lack of automated scheduling when hospital is full  
• No proactive alert before beds are fully exhausted  
• Loss of billing data after patient discharge  
• Irreversible deletion of operational inventory records  

MedRisk AI unifies these signals into a single, event-driven, memory-aware 
intelligence layer that anticipates failures before they escalate.

======================================================================
SOCIETAL IMPACT
======================================================================

MedRisk AI contributes to healthcare resilience by:
• Reducing preventable harm during ICU overloads  
• Predicting equipment shortages early  
• Anticipating environmental and crowd-driven surges  
• Preserving institutional memory across leadership changes  
• Providing explainable audit-ready outputs  
• Preventing last-minute admission failures through threshold alerts  
• Ensuring financial traceability through permanent billing records  
• Maintaining operational audit trails through soft-delete compliance  

======================================================================
SYSTEM ARCHITECTURE
======================================================================

HIGH-LEVEL FLOW

[Room / Patient / Inventory Event]  
↓  
[Event Bus]  
↓  
[Specialized Risk Agent]  
↓  
[Contextual Embedding Generation]  
↓  
[Qdrant Vector Memory Store]  
↓  
[Similarity Retrieval + Metadata Filtering]  
↓  
[Explainable Risk Output]  
↓  
[Event Timeline + System Aggregation]  
↓  
[Authoritative System Risk Store]  

----------------------------------------------------------------------
CAPACITY FLOW
----------------------------------------------------------------------

[Patient Admit / Discharge]  
↓  
[occupiedBeds updated atomically]  
↓  
emitCapacityUpdate()  
↓  
EventBus emits CAPACITY_UPDATE  
↓  
Capacity Agent recalculates:  
availableBeds = totalBeds - occupiedBeds  
↓  
If availableBeds <= capacityThreshold  
→ HIGH RISK  
Else → SAFE / MODERATE  

----------------------------------------------------------------------
BILLING FLOW
----------------------------------------------------------------------

[Patient Discharge]  
↓  
Stay duration calculated  
↓  
Room + Inventory + Misc costs computed  
↓  
Billing snapshot created in PostgreSQL  
↓  
Capacity updated  
↓  
Risk agents reevaluated  

======================================================================
ARCHITECTURAL PRINCIPLES
======================================================================

The system is:
• Modular  
• Deterministic  
• Event-driven  
• Explainable  
• Memory-aware  
• Auditable  
• Decoupled (Agents do not directly call each other)  
• Race-condition safe (atomic SQL updates)  
• Production-grade validation  
• Financially persistent (billing snapshots immutable)  
• Compliance-oriented (soft delete instead of hard delete)  

======================================================================
DETERMINISM GUARANTEE
======================================================================
MedRisk AI is designed as a strictly deterministic system.
Determinism is enforced through the following principles:
• Identical system state + identical input events → identical risk outputs
• No stochastic sampling in risk computation
• No probabilistic LLM-based scoring in core risk evaluation
• Event ordering preserved through centralized EventEmitter orchestration
• Risk thresholds are rule-based and explicitly defined
• Billing calculations are formula-driven and immutable
This ensures:
• Reproducibility of risk outcomes
• Audit-safe replay of historical events
• Consistent system behavior under identical operational states
All risk agents operate on structured state inputs and produce rule-evaluated outputs.
Vector memory is used for contextual retrieval and explainability — not for non-deterministic scoring.
======================================================================
AGENTS IMPLEMENTED
======================================================================

Capacity Risk Agent  
• Evaluates bed occupancy percentage  
• Evaluates availableBeds vs capacityThreshold  
• Auto-triggered via ERP capacity events  
• Escalates risk BEFORE full overload  
• Emits AGENT_STATE_UPDATED events  

Staff Burnout Agent  
• Evaluates workload, overtime, absence  

Equipment Risk Agent  
• Evaluates equipment utilization and inventory shortage  
• Auto-triggered on low stock threshold breach  

Weather Risk Agent  
• Evaluates AQI and temperature  
• Manual trigger only  
• Uses SAFE fallback when not triggered  

CCTV Crowd Density Agent  
• Evaluates congestion signals  

System Aggregator Agent  
• Aggregates all agent states  
• Determines authoritative system-wide risk  

Event Timeline Agent  
• Stores structured timeline events  
• Provides explainable system history  

Each agent:
• Emits deterministic risk output  
• Stores snapshot in Qdrant memory  
• Triggers system-wide reevaluation  

======================================================================
EVENT-DRIVEN ORCHESTRATION LAYER
======================================================================

MedRisk AI uses a centralized event bus built on Node.js EventEmitter.

Key mechanisms:
• Agents emit AGENT_STATE_UPDATED  
• ERP emits CAPACITY_UPDATE  
• Inventory module emits INVENTORY_ALERT  
• Orchestrator recomputes system risk deterministically  

This ensures:
• No agent operates in isolation  
• No direct agent-to-agent coupling  
• System risk is always consistent  

======================================================================
AUTHORITATIVE SYSTEM RISK STATE
======================================================================

An in-memory authoritative risk store maintains the latest system-wide 
risk per hospital.
This eliminates ambiguity between historical memory and current 
operational state.

======================================================================
VECTOR MEMORY (QDRANT)
======================================================================

Qdrant serves as immutable long-term vector memory.

Stored events include:
• Capacity snapshots  
• Staff burnout signals  
• Equipment shortage events  
• Environmental stress signals  
• Crowd congestion events  
• System risk summaries  

Each record contains:
• 1536-dimension embedding  
• Structured metadata payload  
• Timestamp  
• Agent source  

Distance Metric: Cosine Similarity  

Fallback vectors preserve pipeline stability when embedding APIs are unavailable.

======================================================================
OPERATIONAL MANAGEMENT LAYER 
======================================================================

MedRisk AI now includes a structured Hospital Operations Management Layer.

This layer handles:
• Room configuration  
• Bed tracking  
• Capacity threshold configuration  
• Patient admission  
• Admission scheduling (if no beds available)  
• Inventory management  
• Deterministic billing  
• Persistent billing storage  
• Soft delete inventory lifecycle management  
It is fully integrated with the intelligence layer through event-driven updates.

======================================================================
DATABASE INTEGRATION
======================================================================

Structured data layer introduced using:
• PostgreSQL  
• Prisma ORM  

Qdrant remains exclusively for vector memory.

PostgreSQL stores:
• Patients  
• Rooms  
• Inventory  
• Billing state (persistent snapshots)  
• Admission scheduling queue  
• Soft delete metadata  

======================================================================
DATABASE MODELS
======================================================================

RoomType
• id
• hospitalId
• name
• totalBeds
• occupiedBeds
• capacityThreshold 
• pricePerNight
• createdAt

Patient
• id
• hospitalId
• name
• age
• gender
• admittedAt
• dischargedAt
• discharged
• roomTypeId
• miscellaneousCost

AdmissionRequest 
• id
• hospitalId
• patientId
• roomTypeId
• status (PENDING | CONFIRMED | CANCELLED)
• scheduledAt
• createdAt

InventoryItem
• id
• hospitalId
• name
• category (MEDICINE | SUPPLY)
• unitCost
• quantity
• threshold
• isDeleted (Soft Delete)
• deletedAt 
• createdAt

PatientInventory
• id
• patientId
• inventoryId
• quantityUsed

Billing 
• id
• patientId
• hospitalId
• stayDays
• roomCost
• medicineCost
• supplyCost
• miscCost
• totalCost
• breakdown (JSON snapshot)
• createdAt

Alert
• id
• hospitalId
• type
• message

======================================================================
OPERATIONAL WORKFLOWS IMPLEMENTED
======================================================================

Patient Creation
• Creates patient record

Room Assignment (Atomic)
• Validates bed availability using atomic SQL
• Prevents race conditions
• Assigns room
• Increments occupiedBeds
• Emits CAPACITY_UPDATE

Capacity Threshold Evaluation 
• Calculates availableBeds
• Compares with capacityThreshold
• Triggers HIGH risk when below threshold

Patient Discharge
• Calculates stay duration
• Computes room cost
• Computes medicine cost
• Computes supply cost
• Adds miscellaneous cost
• Creates immutable Billing snapshot
• Decrements occupiedBeds
• Emits CAPACITY_UPDATE

Admission Scheduling 
• If no beds available:
→ User can schedule admission
• Creates AdmissionRequest with PENDING status
• Prevents duplicate scheduling
• Maintains operational queue

Inventory Assignment
• Deducts quantity
• Creates PatientInventory link
• Triggers threshold alert if low
• Auto-triggers Equipment Risk Agent

Inventory Soft Delete 
• Inventory is never permanently removed
• isDeleted flag used instead of hard delete
• Preserves billing and audit history

======================================================================
BILLING LOGIC
======================================================================

Total Cost =
(Days Stayed × Room Price Per Night)
+ Medicine Usage Cost
+ Supply Usage Cost
+ Miscellaneous Cost

Stay Duration = ceil((DischargeTime - AdmitTime) / 24 hours)

Minimum stay = 1 day  
Billing is fully deterministic.  
Billing snapshots are immutable and permanently stored.

======================================================================
TECHNOLOGY STACK
======================================================================

Backend
• Node.js
• TypeScript
• Express.js
• Prisma ORM
• PostgreSQL
• Qdrant Vector Database
• UUID
• dotenv
• EventEmitter-based Event Bus

Frontend
• React
• TypeScript
• Vite
• Tailwind CSS
• ShadCN UI
• Radix UI
• Axios
• React Router
• Recharts

APIs
• Weatherbit API
• Internal REST APIs

======================================================================
ARCHITECTURAL SEPARATION
======================================================================

MedRisk AI consists of two cleanly separated layers:

1. Intelligence Layer
• Risk agents
• Qdrant memory
• Orchestrator
• Event bus
• System aggregator

2. Operational Layer
• PostgreSQL
• Prisma ORM
• Rooms
• Patients
• Admission scheduling
• Inventory
• Billing engine

Communication is strictly via deterministic APIs and event emissions.

======================================================================
API ENDPOINTS
======================================================================

• POST /patients
• POST /rooms/assign
• POST /patients/discharge
• GET /agents/system-risk/current
• POST /inventory

======================================================================
EXAMPLE RISK OUTPUT
======================================================================

{
  "agent": "CapacityRiskAgent",
  "riskLevel": "HIGH",
  "confidence": 0.91,
  "explanation": "...",
  "trigger": "availableBeds <= capacityThreshold"
}

======================================================================
SETUP REQUIREMENTS
======================================================================

• Node >= X
• PostgreSQL
• Qdrant (Docker)
• Environment variables
• Prisma migrate

======================================================================
RUNNING THE PROJECT
======================================================================

Backend:
cd backend
npm run dev

Frontend:
cd frontend
npm run dev

Both must run simultaneously.

======================================================================
UI DEVELOPMENT DISCLOSURE
======================================================================

Lovable was used only for early UI scaffolding.

All core system logic including:
• Agents  
• Event orchestration  
• Vector memory integration  
• Risk evaluation  
• ERP workflows  
• Billing logic  
• Atomic capacity control  
• Admission scheduling  
• Soft delete compliance logic  
• Persistent billing architecture  

was implemented manually.

======================================================================
FUTURE EXTENSIONS
======================================================================

• ICU vs General bed separation
• Real-time WebSocket streaming of risk
• Multi-hospital multi-tenant architecture
• Advanced financial analytics
• Predictive surge modeling
• Role-based access control
• Audit logging
• Auto-confirm scheduled admissions on discharge
• Revenue dashboards
• PDF invoice generation

======================================================================
TESTING STRATEGY
======================================================================

MedRisk AI includes deterministic validation and operational integrity checks.
Deterministic Event Replay
• Historical event sequences can be replayed
• Identical inputs produce identical risk classifications
Atomic Capacity Concurrency Testing
• Parallel admission attempts tested
• SQL-level atomic updates prevent race conditions
• No over-allocation of beds under concurrent requests
Billing Immutability Validation
• Billing snapshots validated post-discharge
• Historical pricing changes do not alter stored bills
• Snapshot integrity verified against breakdown JSON
Agent Consistency Checks
• System Aggregator verifies global risk coherence
• All agent outputs logged with timestamps
• Inconsistent state transitions flagged
Soft Delete Compliance Verification
• Deleted inventory remains referenceable
• Billing references preserved
• Historical audit trails intact
Testing philosophy prioritizes reproducibility, data integrity, and operational safety over probabilistic benchmarking.

======================================================================
DATA RETENTION & COMPLIANCE POLICY
======================================================================

MedRisk AI follows a strict data retention and audit-preservation policy aligned with healthcare-grade system design principles.

PATIENT DATA RETENTION
• Patient records are never hard-deleted.
• On discharge, patients are marked:
  - discharged = true
  - dischargedAt = timestamp
• Historical patient data remains permanently stored.
• This ensures:
  - Medical traceability
  - Financial reconciliation integrity
  - Legal and audit compliance
  - Long-term analytics capability

BILLING IMMUTABILITY
• Billing records are stored as immutable snapshots.
• A complete billing breakdown (room, inventory, miscellaneous) is persisted at discharge.
• Billing data is never recalculated retroactively.
• Future changes to room pricing or inventory costs do not affect historical bills.
• This guarantees financial consistency and audit reliability.

INVENTORY LIFECYCLE MANAGEMENT
• Inventory items are never permanently deleted.
• Soft delete mechanism is enforced using:
  - isDeleted flag
  - deletedAt timestamp
• Deleted inventory items are hidden from operational queries but remain in the database.
• This preserves:
  - Historical billing references
  - Equipment usage analytics
  - Regulatory audit trails
  - System integrity

NO HARD DELETION POLICY
• Hard deletion is intentionally avoided for all critical operational entities:
  - Patients
  - Inventory
  - Billing records
• This prevents irreversible data loss and maintains compliance-ready system behavior.

This approach ensures MedRisk AI operates not merely as a simulation platform, but as a production-aligned healthcare operations system with full historical accountability.

======================================================================
SCALABILITY CONSIDERATIONS
======================================================================

MedRisk AI is architected for extensibility and horizontal growth.
Stateless Risk Agents
• Agents derive output from structured state
• No internal hidden mutable state
• Enables horizontal scaling per hospital
Event-Driven Isolation
• Decoupled architecture supports distributed event buses
• Current implementation uses in-memory EventEmitter
• Can migrate to Kafka / Redis Streams without agent redesign
Multi-Hospital Expansion
• HospitalId used as partitioning key
• Enables multi-tenant architecture
• Risk computation isolated per institution
Vector Memory Scaling
• Qdrant supports horizontal sharding
• Embeddings stored independently from transactional data
Operational Database Scaling
• PostgreSQL can be scaled using replication
• Billing and operational state separated from vector memory
The architecture is designed for distributed deployment with minimal refactoring.

======================================================================
KNOWN LIMITATIONS
======================================================================

• Current event bus is in-memory (Node.js EventEmitter) and not distributed
• CCTV Crowd Density signals are simulated and not connected to real CV models
• No integration with real Electronic Health Record (EHR) systems
• Weather signals rely on external API input
• No role-based access control implemented yet
• No real-time WebSocket streaming layer
• System risk stored in-memory (non-persistent authoritative store)
• No GPU-accelerated embedding fallback
• No hospital network security layer included
These limitations are intentional in the current phase and do not affect architectural correctness or deterministic guarantees. 

======================================================================
CONCLUSION
======================================================================

MedRisk AI demonstrates how agentic intelligence combined with long-term 
vector memory and structured operational systems can transform healthcare 
risk management from reactive monitoring to proactive, explainable, and 
resilient decision support.

The architecture is modular, domain-agnostic, and extensible to other 
critical infrastructure sectors.

======================================================================

END OF README



