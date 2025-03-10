import { colors, typography, spacing, breakpoints, shadows, borderRadius, transitions } from './variables';

const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  transitions,

  // Ajout de quelques utilitaires spécifiques au thème
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },

  // Styles spécifiques pour les composants communs
  components: {
    button: {
      borderRadius: borderRadius.md,
      fontWeight: typography.fontWeight.medium,
      padding: `${spacing[2]} ${spacing[4]}`,
      transition: transitions.default,
    },
    card: {
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
      backgroundColor: colors.background.paper,
    },
    input: {
      borderRadius: borderRadius.md,
      borderColor: colors.border.main,
      fontSize: typography.fontSize.base,
      padding: spacing[3],
    },
  },
};

export default theme;
