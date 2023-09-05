import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { Theme } from '@radix-ui/themes';
import { CookiesProvider } from 'react-cookie';

const rootElement = document.getElementById('root')

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <CookiesProvider>
      <Theme appearance='dark'>
        <React.StrictMode>
          <App />
        </React.StrictMode>,
      </Theme>
    </CookiesProvider>
  )
}
