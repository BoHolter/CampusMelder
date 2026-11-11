export const colors = {
  bg: '#E8EFEA',
  bgDeep: '#D3E0D8',
  surface: '#F7FAF8',
  surfaceRaised: '#FFFFFF',
  primary: '#0A3328',
  primaryMid: '#145A45',
  primarySoft: '#1F7A5C',
  accent: '#E07A2F',
  accentSoft: '#F3C9A5',
  text: '#102018',
  muted: '#5A6F64',
  border: '#C5D4CC',
  success: '#1F7A5C',
  warning: '#C4871A',
  done: '#4D5C56',
  danger: '#B42318',
  online: '#1F7A5C',
  offline: '#B42318',
};

export const statusColor: Record<string, string> = {
  nieuw: colors.accent,
  'in behandeling': colors.warning,
  afgerond: colors.done,
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  pill: 999,
};
