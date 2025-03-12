import { validateGroupName, MIN_GROUP_NAME_LENGTH, MAX_GROUP_NAME_LENGTH } from '../groupValidation';

describe('groupValidation', () => {
  describe('validateGroupName', () => {
    it('devrait valider un nom de groupe correct', () => {
      const result = validateGroupName('Groupe de test');
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    it('devrait rejeter un nom de groupe vide', () => {
      const result = validateGroupName('');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('requis');
    });

    it('devrait rejeter un nom de groupe trop court', () => {
      const result = validateGroupName('ab');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain(`${MIN_GROUP_NAME_LENGTH} caractères`);
    });

    it('devrait rejeter un nom de groupe trop long', () => {
      const longName = 'a'.repeat(MAX_GROUP_NAME_LENGTH + 1);
      const result = validateGroupName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain(`${MAX_GROUP_NAME_LENGTH} caractères`);
    });

    it('devrait rejeter un nom avec des caractères non autorisés', () => {
      const result = validateGroupName('Groupe <script>');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('caractères non autorisés');
    });

    it('devrait éliminer les espaces au début et à la fin', () => {
      const result = validateGroupName('  Groupe valide  ');
      expect(result.isValid).toBe(true);
    });

    it('devrait utiliser la fonction de traduction si fournie', () => {
      const mockT = jest.fn().mockImplementation((key) => {
        if (key === 'validation.groupName.required') return 'Group name is required';
        return undefined;
      });

      const result = validateGroupName('', mockT);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('Group name is required');
      expect(mockT).toHaveBeenCalledWith('validation.groupName.required');
    });

    it('devrait passer les options à la fonction de traduction', () => {
      const mockT = jest.fn().mockImplementation((key) => {
        if (key === 'validation.groupName.tooShort') return 'Min length';
        return undefined;
      });

      validateGroupName('a', mockT);
      expect(mockT).toHaveBeenCalledWith('validation.groupName.tooShort', { min: MIN_GROUP_NAME_LENGTH });
    });
  });
});
