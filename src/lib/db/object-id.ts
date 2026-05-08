import { ObjectId } from "mongodb";

export function toObjectId(value: string | ObjectId) {
  if (value instanceof ObjectId) return value;
  if (!ObjectId.isValid(value)) throw new Error("Gecersiz MongoDB id degeri.");
  return new ObjectId(value);
}

export function tryObjectId(value: string | undefined | null) {
  if (!value || !ObjectId.isValid(value)) return null;
  return new ObjectId(value);
}
