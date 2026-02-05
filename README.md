MedRisk AI
Agentic Healthcare Risk Intelligence Platform


------------------------------------------------------------
OVERVIEW
------------------------------------------------------------

MedRisk AI is an Agentic, Memory-Driven Healthcare Risk Intelligence
Platform designed to proactively detect, explain, and mitigate
operational risks in hospitals during high-stress scenarios such as
epidemics, pollution surges, heatwaves, crowd influxes, and staffing
shortages.

Traditional hospital dashboards are reactive and siloed, focusing only
on real-time metrics without historical context. MedRisk AI addresses
this limitation by introducing autonomous, explainable risk agents
backed by long-term vector memory, enabling hospital leadership to make
timely, informed, and safer decisions.

------------------------------------------------------------
PROBLEM ADDRESSED
------------------------------------------------------------

Hospitals often fail not due to lack of medical expertise, but due to
delayed awareness of operational risks. Signals related to ICU capacity,
staff workload, equipment availability, environmental stress, and crowd
influx are typically monitored independently, leading to delayed or
unsafe decisions during crises.

MedRisk AI unifies these signals into a single, memory-aware intelligence
layer that anticipates failures before they escalate.

------------------------------------------------------------
SOCIETAL IMPACT
------------------------------------------------------------

MedRisk AI contributes to public safety and healthcare resilience by:

- Reducing preventable patient harm during ICU overloads
- Detecting staff burnout before it becomes unsafe
- Anticipating equipment shortages and failures
- Improving preparedness for environmental and crowd-driven surges
- Preserving institutional memory across leadership changes

------------------------------------------------------------
SYSTEM ARCHITECTURE
------------------------------------------------------------

High-Level Flow:

[Data Input / Trigger]
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

The system is designed to be:
- Modular
- Deterministic
- Explainable
- Memory-aware
- Auditable

------------------------------------------------------------
AGENTS IMPLEMENTED
------------------------------------------------------------

1. Capacity Risk Agent
   - Evaluates ICU, bed, and staff utilization
   - Retrieves similar historical overload events

2. Staff Burnout Agent
   - Evaluates workload, shift duration, overtime, and absences

3. Equipment Risk Agent
   - Evaluates equipment utilization, downtime, and maintenance backlog

4. Weather Risk Agent
   - Evaluates environmental stress using AQI and temperature

5. CCTV Crowd Density Agent
   - Evaluates congestion and crowd influx risk using derived signals

6. System Aggregator Agent
   - Aggregates all agent outputs into a system-wide risk assessment

Each agent is independently triggerable and produces explainable output.

------------------------------------------------------------
VECTOR MEMORY (QDRANT)
------------------------------------------------------------

Qdrant serves as the long-term vector memory backbone of MedRisk AI.

Stored memory includes:
- Capacity snapshots
- Staff burnout patterns
- Equipment failure events
- Environmental stress events
- Crowd congestion signals
- System-wide risk summaries

Each record consists of:
- Vector embedding
- Structured metadata payload
- Timestamp

Memory is immutable, ensuring auditability and traceability.

------------------------------------------------------------
DATA AND EMBEDDINGS
------------------------------------------------------------

The system handles heterogeneous data types including numerical,
categorical, temporal, environmental, and sensor-derived signals.

All data is converted into contextual semantic representations before
embedding. Non-text data such as weather conditions and CCTV-derived
crowd density are stored as derived semantic signals; no raw images,
videos, or personal data are stored.

------------------------------------------------------------
HALLUCINATION AND SAFETY CONTROL
------------------------------------------------------------

MedRisk AI avoids hallucinated or ungrounded outputs by design:

- Risk evaluation is rule-based and deterministic
- Explanations are retrieval-grounded using historical memory
- No free-form generative decisions are made
- Logic, memory, and explanation layers are explicitly separated

------------------------------------------------------------
PRIVACY AND GOVERNANCE
------------------------------------------------------------

- No personal patient data is stored
- No facial recognition or identity inference is performed
- Only aggregated and anonymized signals are used
- Outputs are explainable and suitable for regulatory audits

------------------------------------------------------------
TECHNOLOGY STACK
------------------------------------------------------------

Backend:
- Node.js
- TypeScript
- Express.js
- Qdrant Vector Database

Frontend:
- React
- TypeScript
- Recharts

APIs:
- Weatherbit API
- Internal REST APIs

------------------------------------------------------------
API ENDPOINTS
------------------------------------------------------------

- /api/agents/capacity
- /api/agents/staff-burnout
- /api/agents/equipment
- /api/agents/weather
- /api/agents/cctv
- /api/agents/system-aggregator
- /api/agents/event-replay

------------------------------------------------------------
RUNNING THE PROJECT (IMPORTANT)
------------------------------------------------------------

⚠️ The backend MUST be running before the frontend for the agents
to function correctly.

Step 1: Start Backend
---------------------
Open a terminal and run:

cd backend
npm run dev

Keep this terminal running.

Step 2: Start Frontend
----------------------
Open a new terminal (do not stop the backend) and run:

cd frontend
npm run dev

The system will function correctly only when both backend and frontend
are running simultaneously.

------------------------------------------------------------
UI DEVELOPMENT DISCLOSURE
------------------------------------------------------------

Lovable was used exclusively as an initial UI facilitation tool during
early-stage interface scaffolding. Its usage was limited to assisting
with basic UI layout generation to accelerate early design exploration.

All core system components were developed manually, including:
- Agent logic and orchestration
- Backend architecture and services
- API design and implementation
- Vector memory integration with Qdrant
- Risk evaluation and explainability logic

The user interface itself underwent significant manual modifications
after the initial scaffolding phase. Final UI structure, behavior,
data binding, and presentation logic were implemented and refined
manually to align with system requirements.

Lovable was not used for agent development, backend logic, API creation,
risk reasoning, memory handling, or system decision-making.

------------------------------------------------------------
CONCLUSION
------------------------------------------------------------

MedRisk AI demonstrates how agentic intelligence combined with long-term
vector memory can transform healthcare risk management from reactive
monitoring to proactive, explainable, and resilient decision support.

The architecture is domain-agnostic and suitable for extension to other
critical infrastructure systems.

============================================================
END OF README
============================================================
