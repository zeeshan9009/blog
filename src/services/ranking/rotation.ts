/**
 * Controlled Deterministic Rotation:
 * rotation_bucket = floor(current_time / 5 minutes)
 * rotation_seed = hash(promotion_id + rotation_bucket) -> 0.0 to 1.0
 * Rotation Factor = 0 -> 0.03
 */

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  // Convert to positive float between 0.0 and 1.0
  return Math.abs(hash) / 2147483647;
}

export function calculateRotationFactor(
  promotionId: string,
  currentTimeMs: number = Date.now(),
  bucketMinutes: number = 5
): number {
  const rotationBucket = Math.floor(currentTimeMs / (bucketMinutes * 60 * 1000));
  const seedString = `${promotionId}_bucket_${rotationBucket}`;
  const seed = simpleHash(seedString);

  // Maximum micro-rotation is 0.03 to preserve relevance integrity
  const rotationFactor = seed * 0.03;
  return Number(rotationFactor.toFixed(4));
}
