import 'styled-components';
import { colors, typography, spacing, breakpoints, shadows, borderRadius, transitions } from './variables';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof colors;
    typography: typeof typography;
    spacing: typeof spacing;
    breakpoints: typeof breakpoints;
    shadows: typeof shadows;
    borderRadius: typeof borderRadius;
    transitions: typeof transitions;

    zIndex: {
      appBar: number;
      drawer: number;
      modal: number;
      snackbar: number;
      tooltip: number;
    };

    components: {
      button: {
        borderRadius: string;
        fontWeight: number;
        padding: string;
        transition: string;
      };
      card: {
        borderRadius: string;
        boxShadow: string;
        backgroundColor: string;
      };
      input: {
        borderRadius: string;
        borderColor: string;
        fontSize: string;
        padding: string | number;
      };
    };
  }
}
