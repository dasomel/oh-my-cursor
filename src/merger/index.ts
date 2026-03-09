import { MARKERS } from './markers.js'

/**
 * Merges OMC content into existing file content using marker-based approach.
 * Preserves user content outside markers.
 */
export function mergeContent(
  existingContent: string,
  omcContent: string,
  version: string
): string {
  const startIdx = existingContent.indexOf(MARKERS.START)
  const endIdx = existingContent.indexOf(MARKERS.END)

  const newSection = [
    MARKERS.START,
    MARKERS.versionLine(version),
    omcContent,
    MARKERS.END,
  ].join('\n')

  if (startIdx !== -1 && endIdx !== -1) {
    // Replace existing OMC section
    const before = existingContent.substring(0, startIdx)
    const after = existingContent.substring(endIdx + MARKERS.END.length)
    return before + newSection + after
  } else {
    // Append OMC section
    const separator = existingContent.length > 0 ? '\n\n' : ''
    return existingContent + separator + newSection + '\n'
  }
}

/**
 * Extracts OMC section from content
 */
export function extractOmcSection(content: string): string | null {
  const startIdx = content.indexOf(MARKERS.START)
  const endIdx = content.indexOf(MARKERS.END)
  if (startIdx === -1 || endIdx === -1) return null
  return content.substring(startIdx, endIdx + MARKERS.END.length)
}

/**
 * Checks if content has OMC markers
 */
export function hasOmcMarkers(content: string): boolean {
  return (
    content.includes(MARKERS.START) && content.includes(MARKERS.END)
  )
}
