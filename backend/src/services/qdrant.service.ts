import axios from "axios";

/* ================= ENV ================= */

const QDRANT_URL = process.env.QDRANT_URL!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY!;
const COLLECTION = process.env.QDRANT_COLLECTION!;

const headers = {
  "Content-Type": "application/json",
  "api-key": QDRANT_API_KEY,
};

/* ================= UPSERT ================= */

export async function upsertMemory(
  id: string,
  vector: number[],
  payload: Record<string, any>
): Promise<void> {
  await axios.put(
    `${QDRANT_URL}/collections/${COLLECTION}/points`,
    {
      points: [{ id, vector, payload }],
    },
    { headers }
  );
}

/* ================= TIMELINE UPSERT ================= */

export async function upsertTimelineEvent(
  id: string,
  vector: number[],
  payload: Record<string, any>
) {
  return axios.put(
    `${QDRANT_URL}/collections/hospital_event_timeline/points`,
    {
      points: [{ id, vector, payload }],
    },
    { headers }
  );
}

/* ================= VECTOR SEARCH (CRITICAL FIX) ================= */

export async function searchMemory(
  vector: number[],
  limit = 3,
  filter?: any
): Promise<any[]> {
  const response = await axios.post(
    `${QDRANT_URL}/collections/${COLLECTION}/points/search`,
    {
      vector,
      limit,
      filter,
      with_payload: true,
      with_vector: false,
    },
    { headers }
  );

  // ✅ Explicitly type Qdrant search response
  const data = response.data as {
    result?: any[];
  };

  return data.result ?? [];
}

export async function scrollTimelineEvents(
  filter: any = {},
  limit = 50
): Promise<any[]> {
  const response = await axios.post(
    `${QDRANT_URL}/collections/hospital_event_timeline/points/scroll`,
    {
      filter: Object.keys(filter).length ? filter : undefined,
      limit,
      with_payload: true,
      with_vector: false,
    },
    { headers }
  );

  const data = response.data as {
    result?: {
      points?: any[];
    };
  };

  return data.result?.points ?? [];
}

/* ================= SCROLL (REPLAY ONLY) ================= */

export async function scrollMemory(
  filter: any = {},
  limit = 50
): Promise<any[]> {
  const response = await axios.post(
    `${QDRANT_URL}/collections/${COLLECTION}/points/scroll`,
    {
      filter: Object.keys(filter).length ? filter : undefined,
      limit,
      with_payload: true,
      with_vector: false,
    },
    { headers }
  );

  // ✅ Explicit response typing (CRITICAL FIX)
  const data = response.data as {
    result?: {
      points?: any[];
    };
  };

  return data.result?.points ?? [];

  

}
