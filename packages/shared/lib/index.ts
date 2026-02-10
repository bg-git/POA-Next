// Shared utilities and exports

export * from '../types/index';

export const LOCATIONS = {
  CHESTERFIELD: 'chesterfield',
  LEICESTER: 'leicester'
} as const;

export type LocationSlug = typeof LOCATIONS[keyof typeof LOCATIONS];

export const getLocationName = (slug: LocationSlug): string => {
  const names: Record<LocationSlug, string> = {
    chesterfield: 'Chesterfield',
    leicester: 'Leicester'
  };
  return names[slug];
};
