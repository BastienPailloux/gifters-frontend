import '@testing-library/jest-dom';

// Configurer Jest globalement
import { jest } from '@jest/globals';

import dotenv from 'dotenv';

// Charge les variables d'environnement du fichier .env.test
dotenv.config({ path: '.env.test' });

global.jest = jest;

// Mock pour TextEncoder/TextDecoder qui sont utilisés par react-router mais non disponibles dans l'environnement de test
Object.defineProperty(global, 'TextEncoder', {
  value: class {
    encode(input: string) {
      return new Uint8Array(Buffer.from(input));
    }
  }
});

Object.defineProperty(global, 'TextDecoder', {
  value: class {
    decode(input?: Uint8Array) {
      if (!input) return '';
      return Buffer.from(input).toString();
    }
  }
});

// Autres configurations de test pourraient être ajoutées ici
