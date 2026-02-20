import { StrictMode, Suspense, lazy, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Box, CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const App = lazy(() => import('./App'));

const THEME_MODE_KEY = 'uzlang-theme-mode';

function getInitialMode() {
  const stored = localStorage.getItem(THEME_MODE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return 'light';
}

function makeTheme(mode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: { main: isDark ? '#4dd0c8' : '#0d6e6e' },
      secondary: { main: isDark ? '#ffb74d' : '#ef6c00' },
      background: {
        default: isDark ? '#0d1117' : '#f3f6fb',
        paper: isDark ? '#151b24' : '#ffffff'
      },
      text: {
        primary: isDark ? '#e9eef8' : '#182233',
        secondary: isDark ? '#aeb8c9' : '#4f5f78'
      }
    },
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: '"Noto Sans", "Segoe UI", sans-serif',
      h4: { fontWeight: 700 },
      h6: { fontWeight: 700 }
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: isDark
              ? 'radial-gradient(circle at 15% 10%, #1b2637 0%, #0d1117 55%)'
              : 'radial-gradient(circle at 15% 10%, #e8f0ff 0%, #f3f6fb 55%)',
            backgroundAttachment: 'fixed'
          }
        }
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            border: isDark ? '1px solid rgba(120,140,170,0.22)' : '1px solid rgba(13,110,110,0.08)',
            boxShadow: isDark
              ? '0 10px 30px rgba(0,0,0,0.35)'
              : '0 10px 30px rgba(14,44,78,0.08)'
          }
        }
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: isDark ? '1px solid rgba(120,140,170,0.2)' : '1px solid rgba(13,110,110,0.08)'
          }
        }
      }
    }
  });
}

// eslint-disable-next-line react-refresh/only-export-components
function Root() {
  const [mode, setMode] = useState(getInitialMode);

  const theme = useMemo(() => makeTheme(mode), [mode]);

  function toggleMode() {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_MODE_KEY, next);
      return next;
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense
        fallback={
          <Box minHeight="100vh" display="grid" sx={{ placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        }
      >
        <App colorMode={mode} onToggleColorMode={toggleMode} />
      </Suspense>
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
