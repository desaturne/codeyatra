import api from "./axios";
import db from "./db";

export const flushSyncQueue = async () => {
  const queue = await db.syncQueue.toArray();
  if (queue.length === 0) return { synced: 0 };

  const ops = queue.map(({ operation, table, recordId, payload }) => ({
    operation,
    table,
    recordId,
    payload,
  }));

  const response = await api.post("/sync", ops);

  const ids = queue.map((item) => item.id);
  await db.syncQueue.bulkDelete(ids);

  return { synced: ids.length, result: response.data };
};
