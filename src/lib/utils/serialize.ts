import { ObjectId } from "mongodb";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export function serializeMongo(value: unknown): JsonValue {
  if (value instanceof ObjectId) return value.toHexString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((item) => serializeMongo(item));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => {
        const nextKey = key === "_id" ? "id" : key;
        return [nextKey, serializeMongo(item)];
      })
    );
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || value === null) return value;
  return null;
}

export function serializeMongoArray<T>(items: T[]) {
  return items.map((item) => serializeMongo(item));
}
