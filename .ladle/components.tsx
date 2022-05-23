import '../src/globals.css';
import './styles.css';
import type { GlobalProvider } from '@ladle/react';

export const Provider: GlobalProvider = ({ children }) => <>{children}</>;
