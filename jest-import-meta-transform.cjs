/**
 * Custom Jest preprocessor that replaces import.meta.env with process.env
 * before passing the source to ts-jest for TypeScript compilation.
 * This allows Vite-style environment variables to work in Jest CJS mode.
 */

const { TsJestTransformer } = require('ts-jest');

const transformer = new TsJestTransformer({
  tsconfig: 'tsconfig.jest.json',
  useESM: false,
  diagnostics: false,
});

function patchSource(sourceText) {
  return sourceText
    .replace(/import\.meta\.env/g, '(process.env)')
    .replace(/import\.meta/g, '({})');
}

module.exports = {
  process(sourceText, sourcePath, options) {
    return transformer.process(patchSource(sourceText), sourcePath, options);
  },
  processAsync(sourceText, sourcePath, options) {
    return transformer.processAsync(patchSource(sourceText), sourcePath, options);
  },
  getCacheKey(fileData, filePath, options) {
    return transformer.getCacheKey
      ? transformer.getCacheKey(fileData, filePath, options)
      : fileData + filePath;
  },
};
