export const colors = {
  bg: '#F3F6F4',
  surface: '#FFFFFF',
  primary: '#0B3D2E',
  primarySoft: '#1B6B4F',
  accent: '#C45C26',
  text: '#14201B',
  muted: '#5C6B64',
  border: '#D5DED9',
  success: '#1B6B4F',
  warning: '#B7791F',
  done: '#4A5568',
};

export const statusColor: Record<string, string> = {
  nieuw: colors.accent,
  'in behandeling': colors.warning,
  afgerond: colors.done,
};
