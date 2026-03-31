// Mock for react-markdown — Jest cannot load ESM packages
// In tests, renders markdown content as plain text
import React from 'react';

const ReactMarkdown = ({ children }: { children: string }) => <>{children}</>;

export default ReactMarkdown;
