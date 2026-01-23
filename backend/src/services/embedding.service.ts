import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const MODEL = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";

/**
 * Safe embedding with fallback
 */
export async function embedText(text: string): Promise<number[]> {
  try {
    const response = await axios.post<any>(
      "https://api.openai.com/v1/embeddings",
      {
        model: MODEL,
        input: text
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    // ✅ SAFE ACCESS (NO TS ERROR)
    const embedding = response.data?.data?.[0]?.embedding;

    if (!embedding) {
      throw new Error("No embedding returned from OpenAI");
    }

    return embedding;
  } catch (err: any) {
    /* ===============================
       🔥 RATE LIMIT / FAILOVER
    ================================ */
    if (err?.response?.status === 429) {
      console.warn("⚠️ OpenAI rate-limited — using fallback vector");

      // 🔁 Deterministic fallback vector (1536 dims)
      return Array(1536).fill(0.001);
    }

    console.error("Embedding service failed:", err.message || err);
    throw err;
  }
}
