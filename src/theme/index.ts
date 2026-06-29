// ─── Color Palette ────────────────────────────────────────────────────────────
// Dark-first. Deep space background, violet accent, warm neutrals.
// File type colors are deliberately distinct so card left-borders read instantly.

export const colors = {
  // Backgrounds
  bg:          '#0D0D14',
  bgCard:      '#15151F',
  bgElevated:  '#1C1C2A',
  bgInput:     '#1A1A27',

  // Primary accent
  primary:     '#7B6EF6',
  primaryDim:  '#3D3580',
  primaryGlow: 'rgba(123,110,246,0.18)',

  // Text
  text:        '#EEEDF5',
  textSub:     '#9895AA',
  textMuted:   '#555465',
  textInverse: '#0D0D14',

  // Semantic
  success:     '#4CAF7D',
  successDim:  'rgba(76,175,125,0.15)',
  warning:     '#F5A623',
  warningDim:  'rgba(245,166,35,0.15)',
  error:       '#E05C5C',
  errorDim:    'rgba(224,92,92,0.15)',

  // Borders
  border:      '#252535',
  borderFocus: '#7B6EF6',

  // File type accent colors (used for card left-border and icon bg)
  file: {
    pdf:   '#FF6B6B',
    image: '#4EC9C0',
    docx:  '#5BA3F5',
    pptx:  '#F7C948',
    txt:   '#9895AA',
    ppt:   '#F7C948',
    png:   '#4EC9C0',
    jpg:   '#4EC9C0',
    jpeg:  '#4EC9C0',
    unknown: '#555465',
  },
};

// ─── Typography ───────────────────────────────────────────────────────────────

export const typography = {
  // Scale
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  xxl:  30,

  // Weights
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const spacing = {
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  24,
  xxl: 32,
};

// ─── Radii ────────────────────────────────────────────────────────────────────

export const radii = {
  sm:  6,
  md:  10,
  lg:  16,
  full: 999,
};

// ─── Shadows (Android elevation) ─────────────────────────────────────────────

export const elevation = {
  card: 4,
  modal: 12,
};
