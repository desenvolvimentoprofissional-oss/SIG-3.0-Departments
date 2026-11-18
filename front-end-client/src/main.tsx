import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { validateEnv } from './config/env.schema';
import App from './App.tsx';
import './index.css';

validateEnv();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

