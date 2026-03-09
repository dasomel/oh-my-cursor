export const MARKERS = {
  START: '<!-- OMC-CURSOR:START -->',
  END: '<!-- OMC-CURSOR:END -->',
  versionLine: (v: string) => `<!-- OMC-CURSOR:VERSION:${v} -->`,
  extractVersion: (content: string): string | null => {
    const match = content.match(/<!-- OMC-CURSOR:VERSION:([^>]+) -->/)
    return match ? match[1].trim() : null
  },
} as const
