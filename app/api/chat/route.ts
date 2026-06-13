import { randomUUID } from "node:crypto";

import {
  BedrockAgentCoreClient,
  InvokeAgentRuntimeCommand,
} from "@aws-sdk/client-bedrock-agentcore";

// AWS SDK needs the Node.js runtime (not Edge). force-dynamic + a generous
// maxDuration so streamed agent responses aren't cut off.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REGION = process.env.AWS_REGION ?? "us-east-1";
const AGENT_RUNTIME_ARN = process.env.AGENT_RUNTIME_ARN;

// Credentials resolve from the standard AWS provider chain (env vars on Vercel:
// AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY).
const client = new BedrockAgentCoreClient({ region: REGION });

/**
 * Server-side proxy: browser → /api/chat → InvokeAgentRuntime → AgentCore.
 * The agent already emits SSE (`data: {...}`), so we pipe the bytes straight
 * back and the existing client parser in lib/api.ts works unchanged.
 */
export async function POST(req: Request): Promise<Response> {
  if (!AGENT_RUNTIME_ARN) {
    return new Response("AGENT_RUNTIME_ARN is not configured", { status: 500 });
  }

  let body: { message?: string; thread_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return new Response("message is required", { status: 400 });
  }

  // AgentCore requires runtimeSessionId to be 33–128 chars; a UUID (36) qualifies.
  // Reuse the agent's thread_id across turns so the LangGraph checkpointer keeps
  // multi-turn context. The agent echoes thread_id back in its `session` event,
  // which the client sends on the next turn.
  const sessionId = body.thread_id ?? randomUUID();

  const payload = new TextEncoder().encode(
    JSON.stringify({ prompt: message, thread_id: sessionId }),
  );

  try {
    const out = await client.send(
      new InvokeAgentRuntimeCommand({
        agentRuntimeArn: AGENT_RUNTIME_ARN,
        qualifier: "DEFAULT",
        runtimeSessionId: sessionId,
        contentType: "application/json",
        accept: "text/event-stream",
        payload,
      }),
    );

    if (!out.response) {
      return new Response("Empty response from agent runtime", { status: 502 });
    }

    return new Response(out.response.transformToWebStream(), {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "agent invocation failed";
    return new Response(`agent invocation failed: ${msg}`, { status: 502 });
  }
}
