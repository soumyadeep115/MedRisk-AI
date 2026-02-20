# MedRisk AI- Deterministic Event-Driven Multi-Agent Architecture with Long-Term Vector Memory for Proactive Healthcare Risk Orchestration <br>

## Agentic Healthcare Risk Intelligence & Operations Platform<br>

---
## PROJECT POSITIONING<br>


MedRisk AI is a Deterministic, Event-Driven Multi-Agent Architecture
with Long-Term Vector Memory designed for Proactive Healthcare Risk  
Orchestration and Operational Resilience.
It combines autonomous risk intelligence with structured hospital
operations management, transforming reactive monitoring systems into  
proactive, explainable, memory-aware healthcare infrastructure.

---
## OVERVIEW


MedRisk AI is an Agentic, Memory-Driven Healthcare Risk Intelligence Platform
designed to proactively detect, explain, and mitigate operational risks in
hospitals during high-stress scenarios such as:<br>
• Epidemics<br>
• Pollution surges<br>
• Crowd influxes<br>
• Staffing shortages<br>  
• Infrastructure strain<br> 
Traditional hospital dashboards are reactive and siloed, focusing only on<br>
real-time metrics without historical context.<br>
MedRisk AI addresses this limitation by introducing autonomous, explainable <br>
risk agents backed by long-term vector memory and deterministic orchestration.<br>

MedRisk AI is a hybrid system combining:<br>
• Agentic Intelligence Layer (Risk Prediction & Explainability)<br>
• Operational Management Layer (Rooms, Patients, Inventory, Billing)<br>  
This transforms the platform from pure intelligence into a full operational
simulation + risk intelligence ecosystem.<br>

---
## PROBLEM ADDRESSED


Hospitals often fail not due to lack of medical expertise, but due to 
delayed awareness of operational risks.

Critical signals such as:<br>
• ICU and bed utilization<br>
• Equipment and supply shortages<br>
• Environmental stress (AQI, temperature)<br>
• Crowd congestion<br>
are typically monitored independently.<br>

• Sudden bed exhaustion without early warning<br>
• Manual admission decisions during capacity crisis<br>  
• Lack of automated scheduling when hospital is full<br>
• No proactive alert before beds are fully exhausted<br>
• Loss of billing data after patient discharge<br>
• Irreversible deletion of operational inventory records<br>

MedRisk AI unifies these signals into a single, event-driven, memory-aware 
intelligence layer that anticipates failures before they escalate.

---
## SOCIETAL IMPACT


MedRisk AI contributes to healthcare resilience by:<br>
• Reducing preventable harm during ICU overloads<br>
• Predicting equipment shortages early<br>
• Anticipating environmental and crowd-driven surges<br>
• Preserving institutional memory across leadership changes<br>
• Providing explainable audit-ready outputs<br>
• Preventing last-minute admission failures through threshold alerts<br>
• Ensuring financial traceability through permanent billing records<br>
• Maintaining operational audit trails through soft-delete compliance<br>

---
## SYSTEM ARCHITECTURE


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

---
## CAPACITY FLOW


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

---
## BILLING FLOW


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

---
## ARCHITECTURAL PRINCIPLES


The system is:<br>
• Modular<br>
• Deterministic<br>
• Event-driven<br>
• Explainable<br>
• Memory-aware<br>
• Auditable<br>
• Decoupled (Agents do not directly call each other)<br>
• Race-condition safe (atomic SQL updates)<br>
• Production-grade validation<br>
• Financially persistent (billing snapshots immutable)<br>
• Compliance-oriented (soft delete instead of hard delete)<br>  

---
## DETERMINISM GUARANTEE


MedRisk AI is designed as a strictly deterministic system.<br>
Determinism is enforced through the following principles:<br>
• Identical system state + identical input events → identical risk outputs<br>
• No stochastic sampling in risk computation<br>
• No probabilistic LLM-based scoring in core risk evaluation<br>
• Event ordering preserved through centralized EventEmitter orchestration<br>
• Risk thresholds are rule-based and explicitly defined<br>
• Billing calculations are formula-driven and immutable<br>
This ensures:<br>
• Reproducibility of risk outcomes<br>
• Audit-safe replay of historical events<br>
• Consistent system behavior under identical operational states<br>
All risk agents operate on structured state inputs and produce rule-evaluated outputs.<br>
Vector memory is used for contextual retrieval and explainability — not for non-deterministic scoring.<br>

---
## AGENTS IMPLEMENTED


Capacity Risk Agent<br>
• Evaluates bed occupancy percentage<br>
• Evaluates availableBeds vs capacityThreshold<br>
• Auto-triggered via ERP capacity events<br>
• Escalates risk BEFORE full overload<br>
• Emits AGENT_STATE_UPDATED events<br>

Staff Burnout Agent<br>
• Evaluates workload, overtime, absence<br>

Equipment Risk Agent<br>
• Evaluates inventory shortage triggered by threshold breaches<br>
• Auto-triggered on low stock threshold breach<br>

Weather Risk Agent<br>
• Evaluates AQI and temperature<br>
• Manual trigger only<br>
• Uses SAFE fallback when not triggered<br>

CCTV Crowd Density Agent<br>
• Evaluates congestion signals<br>

System Aggregator Agent<br>
• Aggregates all agent states<br>
• Determines authoritative system-wide risk<br>

Event Timeline Agent<br>
• Stores structured timeline events<br>
• Provides explainable system history<br>

Each agent:<br>
• Emits deterministic risk output<br>
• Stores snapshot in Qdrant memory<br>
• Triggers system-wide reevaluation<br>

---
## EVENT-DRIVEN ORCHESTRATION LAYER


MedRisk AI uses a centralized event bus built on Node.js EventEmitter.<br>

Key mechanisms:<br>
• Agents emit AGENT_STATE_UPDATED<br>
• ERP emits CAPACITY_UPDATE<br>
• Inventory module emits INVENTORY_ALERT<br>
• Orchestrator recomputes system risk deterministically<br>

This ensures:<br>
• No agent operates in isolation<br>
• No direct agent-to-agent coupling<br> 
• System risk is always consistent<br>

---
## AUTHORITATIVE SYSTEM RISK STATE


An in-memory authoritative risk store maintains the latest system-wide 
risk per hospital.
This eliminates ambiguity between historical memory and current 
operational state.

---
## VECTOR MEMORY (QDRANT)


Qdrant serves as immutable long-term vector memory.<br>

Stored events include:<br>
• Capacity snapshots<br>
• Staff burnout signals<br> 
• Equipment shortage events<br>  
• Environmental stress signals <br> 
• Crowd congestion events<br>
• System risk summaries<br>

Each record contains:<br>
• 1536-dimension embedding<br>  
• Structured metadata payload<br> 
• Timestamp<br>
• Agent source<br> 

Distance Metric: Cosine Similarity<br>

Fallback vectors preserve pipeline stability when embedding APIs are unavailable.

---
## OPERATIONAL MANAGEMENT LAYER 


MedRisk AI now includes a structured Hospital Operations Management Layer.<br>

This layer handles:<br>
• Room configuration<br>  
• Bed tracking<br>  
• Capacity threshold configuration<br>  
• Patient admission<br>  
• Admission scheduling (if no beds available)<br>  
• Inventory management<br>  
• Deterministic billing<br>  
• Persistent billing storage<br>  
• Soft delete inventory lifecycle management<br>  
It is fully integrated with the intelligence layer through event-driven updates.

---
## DATABASE INTEGRATION


Structured data layer introduced using:<br>
• PostgreSQL<br>  
• Prisma ORM<br> 

Qdrant remains exclusively for vector memory.<br>

PostgreSQL stores:<br>
• Patients<br>  
• Rooms<br>  
• Inventory<br>  
• Billing state (persistent snapshots)<br>  
• Admission scheduling queue<br>  
• Soft delete metadata<br>  

---
## DATABASE MODELS<br>

RoomType<br>
• id<br>
• hospitalId<br>
• name<br>
• totalBeds<br>
• occupiedBeds<br>
• capacityThreshold <br>
• pricePerNight<br>
• createdAt<br>

Patient<br>
• id<br>
• hospitalId<br>
• name<br>
• age<br>
• gender<br>
• admittedAt<br>
• dischargedAt<br>
• discharged<br>
• roomTypeId<br>
• miscellaneousCost<br>

AdmissionRequest <br>
• id<br>
• hospitalId<br>
• patientId<br>
• roomTypeId<br>
• status (PENDING | CONFIRMED | CANCELLED)<br>
• scheduledAt<br>
• createdAt<br>

InventoryItem<br>
• id<br>
• hospitalId<br>
• name<br>
• category (MEDICINE | SUPPLY)<br>
• unitCost<br>
• quantity<br>
• threshold<br>
• isDeleted (Soft Delete)<br>
• deletedAt <br>
• createdAt<br>

PatientInventory<br>
• id<br>
• patientId<br>
• inventoryId<br>
• quantityUsed<br>

Billing <br>
• id<br>
• patientId<br>
• hospitalId<br>
• stayDays<br>
• roomCost<br>
• medicineCost<br>
• supplyCost<br>
• miscCost<br>
• totalCost<br>
• breakdown (JSON snapshot)<br>
• createdAt<br>

Alert<br>
• id<br>
• hospitalId<br>
• type<br>
• message<br>

---<br>
## OPERATIONAL WORKFLOWS IMPLEMENTED<br>

Patient Creation<br>
• Creates patient record<br>

Room Assignment (Atomic)<br>
• Validates bed availability using atomic SQL<br>
• Prevents race conditions<br>
• Assigns room<br>
• Increments occupiedBeds<br>
• Emits CAPACITY_UPDATE<br>

Capacity Threshold Evaluation <br>
• Calculates availableBeds<br>
• Compares with capacityThreshold<br>
• Triggers HIGH risk when below threshold<br>

Patient Discharge<br>
• Calculates stay duration<br>
• Computes room cost<br>
• Computes medicine cost<br>
• Computes supply cost<br>
• Adds miscellaneous cost<br>
• Creates immutable Billing snapshot<br>
• Decrements occupiedBeds<br>
• Emits CAPACITY_UPDATE<br>

Admission Scheduling <br>
• If no beds available:<br>
→ User can schedule admission<br>
• Creates AdmissionRequest with PENDING status<br>
• Prevents duplicate scheduling<br>
• Maintains operational queue<br>

Inventory Assignment<br>
• Deducts quantity<br>
• Creates PatientInventory link<br>
• Triggers threshold alert if low<br>
• Auto-triggers Equipment Risk Agent<br>

Inventory Soft Delete <br>
• Inventory is never permanently removed<br>
• isDeleted flag used instead of hard delete<br>
• Preserves billing and audit history<br>

---<br>
## BILLING LOGIC<br>

Total Cost =<br>
(Days Stayed × Room Price Per Night)<br>
+ Medicine Usage Cost<br>
+ Supply Usage Cost<br>
+ Miscellaneous Cost<br>

Stay Duration = ceil((DischargeTime - AdmitTime) / 24 hours)<br>

Minimum stay = 1 day<br>
Billing is fully deterministic.<br>
Billing snapshots are immutable and permanently stored.<br>

---<br>
## TECHNOLOGY STACK<br>

Backend<br>
• Node.js<br>
• TypeScript<br>
• Express.js<br>
• Prisma ORM<br>
• PostgreSQL<br>
• Qdrant Vector Database<br>
• UUID<br>
• dotenv<br>
• EventEmitter-based Event Bus<br>

Frontend<br>
• React<br>
• TypeScript<br>
• Vite<br>
• Tailwind CSS<br>
• ShadCN UI<br>
• Radix UI<br>
• Axios<br>
• React Router<br>
• Recharts<br>

APIs<br>
• Weatherbit API<br>
• Internal REST APIs<br>

---<br>
## ARCHITECTURAL SEPARATION<br>

MedRisk AI consists of two cleanly separated layers:<br>

1. Intelligence Layer<br>
• Risk agents<br>
• Qdrant memory<br>
• Orchestrator<br>
• Event bus<br>
• System aggregator<br>

2. Operational Layer<br>
• PostgreSQL<br>
• Prisma ORM<br>
• Rooms<br>
• Patients<br>
• Admission scheduling<br>
• Inventory<br>
• Billing engine<br>

Communication is strictly via deterministic APIs and event emissions.<br>

---<br>
## API ENDPOINTS<br>

• POST /patients<br>
• POST /rooms/assign<br>
• POST /patients/discharge<br>
• GET /agents/system-risk/current<br>
• POST /inventory<br>

---<br>
## EXAMPLE RISK OUTPUT<br>

{<br>
  "agent": "CapacityRiskAgent",<br>
  "riskLevel": "HIGH",<br>
  "confidence": 0.91,<br>
  "explanation": "...",<br>
  "trigger": "availableBeds <= capacityThreshold"<br>
}<br>

---<br>
## SETUP REQUIREMENTS<br>

• Node >= X<br>
• PostgreSQL<br>
• Qdrant (Docker)<br>
• Environment variables<br>
• Prisma migrate<br>

---<br>
## RUNNING THE PROJECT<br>

Backend:<br>
cd backend<br>
npm run dev<br>

Frontend:<br>
cd frontend<br>
npm run dev<br>

Both must run simultaneously.<br>

---<br>
## UI DEVELOPMENT DISCLOSURE<br>

Lovable was used only for early UI scaffolding.<br>

All core system logic including:<br>
• Agents  <br>
• Event orchestration  <br>
• Vector memory integration  <br>
• Risk evaluation  <br>
• ERP workflows  <br>
• Billing logic  <br>
• Atomic capacity control  <br>
• Admission scheduling  <br>
• Soft delete compliance logic  <br>
• Persistent billing architecture  <br>

was implemented manually.<br>

---<br>
## FUTURE EXTENSIONS<br>

• ICU vs General bed separation<br>
• Real-time WebSocket streaming of risk<br>
• Multi-hospital multi-tenant architecture<br>
• Advanced financial analytics<br>
• Predictive surge modeling<br>
• Role-based access control<br>
• Audit logging<br>
• Auto-confirm scheduled admissions on discharge<br>
• Revenue dashboards<br>
• PDF invoice generation<br>

---<br>
## TESTING STRATEGY<br>

MedRisk AI includes deterministic validation and operational integrity checks.<br>

Deterministic Event Replay<br>
• Historical event sequences can be replayed<br>
• Identical inputs produce identical risk classifications<br>

Atomic Capacity Concurrency Testing<br>
• Parallel admission attempts tested<br>
• SQL-level atomic updates prevent race conditions<br>
• No over-allocation of beds under concurrent requests<br>

Billing Immutability Validation<br>
• Billing snapshots validated post-discharge<br>
• Historical pricing changes do not alter stored bills<br>
• Snapshot integrity verified against breakdown JSON<br>

Agent Consistency Checks<br>
• System Aggregator verifies global risk coherence<br>
• All agent outputs logged with timestamps<br>
• Inconsistent state transitions flagged<br>

Soft Delete Compliance Verification<br>
• Deleted inventory remains referenceable<br>
• Billing references preserved<br>
• Historical audit trails intact<br>

Testing philosophy prioritizes reproducibility, data integrity, and operational safety over probabilistic benchmarking.<br>

---<br>
## DATA RETENTION & COMPLIANCE POLICY<br>

MedRisk AI follows a strict data retention and audit-preservation policy aligned with healthcare-grade system design principles.<br>

PATIENT DATA RETENTION<br>
• Patient records are never hard-deleted.<br>
• On discharge, patients are marked:<br>
  - discharged = true<br>
  - dischargedAt = timestamp<br>
• Historical patient data remains permanently stored.<br>
• This ensures:<br>
  - Medical traceability<br>
  - Financial reconciliation integrity<br>
  - Legal and audit compliance<br>
  - Long-term analytics capability<br>

BILLING IMMUTABILITY<br>
• Billing records are stored as immutable snapshots.<br>
• A complete billing breakdown (room, inventory, miscellaneous) is persisted at discharge.<br>
• Billing data is never recalculated retroactively.<br>
• Future changes to room pricing or inventory costs do not affect historical bills.<br>
• This guarantees financial consistency and audit reliability.<br>

INVENTORY LIFECYCLE MANAGEMENT<br>
• Inventory items are never permanently deleted.<br>
• Soft delete mechanism is enforced using:<br>
  - isDeleted flag<br>
  - deletedAt timestamp<br>
• Deleted inventory items are hidden from operational queries but remain in the database.<br>
• This preserves:<br>
  - Historical billing references<br>
  - Equipment usage analytics<br>
  - Regulatory audit trails<br>
  - System integrity<br>

NO HARD DELETION POLICY<br>
• Hard deletion is intentionally avoided for all critical operational entities:<br>
  - Patients<br>
  - Inventory<br>
  - Billing records<br>
• This prevents irreversible data loss and maintains compliance-ready system behavior.<br>

This approach ensures MedRisk AI operates not merely as a simulation platform, but as a production-aligned healthcare operations system with full historical accountability.<br>

---<br>
## SCALABILITY CONSIDERATIONS<br>

MedRisk AI is architected for extensibility and horizontal growth.<br>

Stateless Risk Agents<br>
• Agents derive output from structured state<br>
• No internal hidden mutable state<br>
• Enables horizontal scaling per hospital<br>

Event-Driven Isolation<br>
• Decoupled architecture supports distributed event buses<br>
• Current implementation uses in-memory EventEmitter<br>
• Can migrate to Kafka / Redis Streams without agent redesign<br>

Multi-Hospital Expansion<br>
• HospitalId used as partitioning key<br>
• Enables multi-tenant architecture<br>
• Risk computation isolated per institution<br>

Vector Memory Scaling<br>
• Qdrant supports horizontal sharding<br>
• Embeddings stored independently from transactional data<br>

Operational Database Scaling<br>
• PostgreSQL can be scaled using replication<br>
• Billing and operational state separated from vector memory<br>

The architecture is designed for distributed deployment with minimal refactoring.<br>

---<br>
## KNOWN LIMITATIONS<br>

• Current event bus is in-memory (Node.js EventEmitter) and not distributed<br>
• CCTV Crowd Density signals are simulated and not connected to real CV models<br>
• No integration with real Electronic Health Record (EHR) systems<br>
• Weather signals rely on external API input<br>
• No role-based access control implemented yet<br>
• No real-time WebSocket streaming layer<br>
• System risk stored in-memory (non-persistent authoritative store)<br>
• No GPU-accelerated embedding fallback<br>
• No hospital network security layer included<br>

These limitations are intentional in the current phase and do not affect architectural correctness or deterministic guarantees.<br>

---<br>
## CONCLUSION<br>

MedRisk AI demonstrates how agentic intelligence combined with long-term vector memory and structured operational systems can transform healthcare risk management from reactive monitoring to proactive, explainable, and resilient decision support.<br>

The architecture is modular, domain-agnostic, and extensible to other critical infrastructure sectors.<br>

---<br>
# END OF README<br>
