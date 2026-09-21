import { toInventoryRecord, withAiDetails } from './machines'

export function inventoryFromRow(row) {
  if (!row) return null
  return toInventoryRecord(
    withAiDetails({
      id: row.id,
      name: row.name,
      meaning: row.meaning,
      whatFor: row.what_is_for,
      category: row.category,
      manufacturer: row.manufacturer,
      brand: row.manufacturer,
      model: row.model,
      location: row.location,
      purpose: row.purpose,
      aiSummary: row.ai_summary,
      safety: row.safety,
      releaseDate: row.release_date,
      yearIntroduced: row.year_introduced,
      releaseSource: row.release_source,
      status: row.status,
      quantity: row.quantity,
      qrPayload: row.qr_payload,
      scanned: row.scanned,
      scannedAt: row.scanned_at,
      description: row.what_is_for || row.purpose,
    }),
    { scanned: Boolean(row.scanned) },
  )
}

export function inventoryToRow(item) {
  const record = toInventoryRecord(item, { scanned: item.scanned !== false })
  return {
    id: record.id,
    name: record.name,
    meaning: record.meaning,
    what_is_for: record.whatFor,
    category: record.category,
    manufacturer: record.manufacturer,
    model: record.model,
    location: record.location,
    purpose: record.purpose,
    ai_summary: record.aiSummary,
    safety: record.safety,
    release_date: record.releaseDate,
    year_introduced: record.yearIntroduced,
    release_source: record.releaseSource,
    status: record.status,
    quantity: record.quantity,
    qr_payload: record.qrPayload,
    scanned: record.scanned !== false,
    scanned_at: record.scannedAt,
  }
}
