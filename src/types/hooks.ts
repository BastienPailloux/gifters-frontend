/**
 * Type pour définir les gestionnaires de touches dans le hook useKeyPress
 */
export type KeyHandlers = {
  [key: string]: () => void;
};
