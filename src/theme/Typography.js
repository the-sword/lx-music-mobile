/**
 * Typography:
 * This contains all the typography config for the application
 * #Note: color and font size are defaulted as they can be overridden
 *        as required.
 */

export const FontWeights = {
  Bold: {
    fontFamily: 'SFProDisplay-Bold',
    color: '#000',
  },
  Regular: {
    fontFamily: 'SFProDisplay-Regular',
    color: '#000',
  },
  Light: {
    fontFamily: 'SFProDisplay-Light',
    color: '#000',
  },
}

export const FontSizes = {
  Heading: {
    fontSize: 32,
  },
  SubHeading: {
    fontSize: 24,
  },
  Label: {
    fontSize: 20,
  },
  Body: {
    fontSize: 16,
  },
  Caption: {
    fontSize: 14,
  },
}

export const BorderWidths = {
  normal: 0.4,
  normal1: 0.6,
  normal2: 1,
  normal3: 1.4,
  normal4: 2,
}

export const BorderRadius = {
  /** @deprecated use sm instead */
  normal: 4,
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  pill: 999,
}

/**
 * 4pt-based spacing scale.
 */
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

/**
 * Android elevation presets (subtle depth, no blur).
 */
export const Elevation = {
  none: {
    elevation: 0,
  },
  card: {
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  raised: {
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  floating: {
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
}

/**
 * Numeric type scale for modern layouts (use with FontSizes presets or raw values).
 */
export const TextSizes = {
  display: 28,
  title1: 24,
  title2: 20,
  title3: 17,
  body: 15,
  subhead: 13,
  caption: 12,
}
