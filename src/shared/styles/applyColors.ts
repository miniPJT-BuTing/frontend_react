import { colors } from './colors';

type ColorMap = {
  [key: string]: string | ColorMap;
};

function flatten(obj: ColorMap, prefix = 'color', acc: Record<string, string> = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const name = `${prefix}-${key}`;

    if (typeof value === 'string') {
      acc[`--${name}`] = value;
    } else {
      flatten(value, name, acc);
    }
  }

  return acc;
}

export function applyColors() {
  if (typeof window === 'undefined') return;

  const vars = flatten(colors);
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
}
