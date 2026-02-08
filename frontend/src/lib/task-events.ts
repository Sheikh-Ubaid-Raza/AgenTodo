/**
 * Lightweight event bus for cross-component task invalidation.
 *
 * When the chatbot modifies tasks via MCP tools, it emits a
 * "tasks-invalidated" event. The todos page listens for this
 * event and re-fetches the task list automatically.
 *
 * Uses the browser-native CustomEvent API — no external dependencies.
 */

const TASK_INVALIDATED_EVENT = "tasks-invalidated";

export interface TaskInvalidatedDetail {
  /** Which tool was called (e.g. "add_task", "complete_task") */
  toolName: string;
  /** Raw result string from the MCP tool */
  result?: string;
}

/**
 * Emit a task-invalidation event so any listening component
 * (e.g. the todos page) can re-fetch its data.
 */
export function emitTasksInvalidated(detail: TaskInvalidatedDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<TaskInvalidatedDetail>(TASK_INVALIDATED_EVENT, { detail })
  );
}

/**
 * Subscribe to task-invalidation events.
 * Returns an unsubscribe function for cleanup.
 */
export function onTasksInvalidated(
  callback: (detail: TaskInvalidatedDetail) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handler = (e: Event) => {
    const detail = (e as CustomEvent<TaskInvalidatedDetail>).detail;
    callback(detail);
  };

  window.addEventListener(TASK_INVALIDATED_EVENT, handler);
  return () => window.removeEventListener(TASK_INVALIDATED_EVENT, handler);
}
