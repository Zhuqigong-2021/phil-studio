import { OwnerAuthorizationError, requireOwnerEmail } from "../../../lib/dashboard/owner-session.ts";
import { createWorkspaceTool } from "../../../lib/dashboard/workspace-repository.ts";
import { buildMigrationPayload } from "../../../lib/dashboard/workspace-data.ts";
import type { CustomToolDraft } from "../../../lib/dashboard/custom-tools.ts";
import type { Tool } from "../../../lib/dashboard/types.ts";

interface ToolPostDependencies {
  authorize: () => Promise<string>;
  createTool: (ownerEmail: string, draft: CustomToolDraft, pin: boolean) => Promise<Tool>;
}

function failureResponse(error: unknown): Response {
  if (error instanceof OwnerAuthorizationError) return Response.json({ error: error.status === 401 ? "Authentication is required." : "Access is forbidden." }, { status: error.status });
  if (error instanceof Error && error.name === "SupabaseConfigurationError") return Response.json({ error: "Workspace service is unavailable." }, { status: 503 });
  return Response.json({ error: "Workspace data is unavailable." }, { status: 502 });
}

function validateBody(value: unknown): { draft: CustomToolDraft; pin: boolean } {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid tool payload.");
  const body = value as Record<string, unknown>;
  if (typeof body.pin !== "boolean" || !body.draft || typeof body.draft !== "object" || Array.isArray(body.draft)) throw new Error("Invalid tool payload.");
  const candidate = body.draft as Record<string, unknown>;
  const normalized = buildMigrationPayload({
    tools: [{ ...candidate, id: "validation", mono: "VA", favorite: false, iconType: "matching" }],
    categories: [], pinnedToolIds: [], favoriteOverrides: {}, recentTools: [],
  }).tools[0];
  return {
    pin: body.pin,
    draft: {
      name: normalized.name,
      url: normalized.url ?? "",
      description: normalized.description ?? "",
      iconKey: normalized.iconKey ?? "",
      accent: normalized.accent,
      tags: normalized.tags,
      aliases: normalized.aliases ?? [],
      sourceType: normalized.sourceType ?? "external",
    },
  };
}

export function createToolPostHandler(dependencies: ToolPostDependencies) {
  return async function postTool(request: Request): Promise<Response> {
    let input: { draft: CustomToolDraft; pin: boolean };
    try {
      input = validateBody(await request.json());
    } catch {
      return Response.json({ error: "Invalid tool payload." }, { status: 400 });
    }
    try {
      const ownerEmail = await dependencies.authorize();
      const tool = await dependencies.createTool(ownerEmail, input.draft, input.pin);
      return Response.json({ tool }, { status: 201 });
    } catch (error) {
      return failureResponse(error);
    }
  };
}

const postTool = createToolPostHandler({ authorize: requireOwnerEmail, createTool: createWorkspaceTool });

export async function POST(request: Request): Promise<Response> {
  return postTool(request);
}

