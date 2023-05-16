import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { deepmerge } from "@mui/utils";
import { useMemo, useState } from "react";

export const ThemedApp = ({ children }) => {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => generateTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
};

export const generateTheme = (mode) => {
  const designTokens = mode === "light" ? designTokensLight : designTokensDark;
  const themedComponents =
    mode === "light" ? themedComponentsLight : themedComponentsDark;

  let theme = createTheme(designTokens);
  theme = deepmerge(theme, themedComponents);

  return theme;
};

export const designTokensLight = {
  palette: {
    mode: "light",
    isDark: false,
    primary: {
      50: "#b47acf",
      100: "#af69cf",
      200: "#a355c9",
      300: "#923fbf",
      400: "#812db5",
      500: "#6f23a6",
      600: "#621d96",
      700: "#561a87",
      800: "#4a1678",
      900: "#3e1266",
      main: "#8a26ce",
      contrastText: "#ffffff",
      A100: "#9d03d9",
      A200: "#9900d9",
      A400: "#8500cd",
      A700: "#6805a6",
    },
    onPrimary: {
      main: "#ffffff",
      contrastText: "#8a26ce",
    },
    primaryContainer: {
      main: "#f3daff",
      contrastText: "#2e004d",
    },
    onPrimaryContainer: {
      main: "#2e004d",
      contrastText: "#f3daff",
    },
    secondary: {
      50: "#c7ab63",
      100: "#c7a550",
      200: "#bf9737",
      300: "#b58621",
      400: "#a6700d",
      500: "#945d06",
      600: "#824f01",
      700: "#6e4000",
      800: "#593300",
      900: "#422400",
      main: "#855400",
      contrastText: "#ffffff",
      A100: "#d19c00",
      A200: "#ce9800",
      A400: "#bc8000",
      A700: "#875800",
    },
    onSecondary: {
      main: "#ffffff",
      contrastText: "#855400",
    },
    secondaryContainer: {
      main: "#ffddb7",
      contrastText: "#2a1700",
    },
    onSecondaryContainer: {
      main: "#2a1700",
      contrastText: "#ffddb7",
    },
    tertiary: {
      50: "#52a38b",
      100: "#41a386",
      200: "#2e9e7b",
      300: "#1b946b",
      400: "#0b875a",
      500: "#057a4b",
      600: "#016b3f",
      700: "#005933",
      800: "#004727",
      900: "#00361d",
      main: "#006d44",
      contrastText: "#ffffff",
      A100: "#00ab7e",
      A200: "#00ab7b",
      A400: "#009966",
      A700: "#006d46",
    },
    onTertiary: {
      main: "#ffffff",
      contrastText: "#006d44",
    },
    tertiaryContainer: {
      main: "#68fdb2",
      contrastText: "#002111",
    },
    onTertiaryContainer: {
      main: "#002111",
      contrastText: "#006d44",
    },
    error: {
      50: "#ba7e6a",
      100: "#ba7259",
      200: "#b56047",
      300: "#ad4d32",
      400: "#a33a22",
      500: "#962c1a",
      600: "#8a2415",
      700: "#7a1d11",
      800: "#6b180f",
      900: "#5c130c",
      main: "#ba1a1a",
      contrastText: "#ffffff",
      A100: "#c33900",
      A200: "#c33300",
      A400: "#b82800",
      A700: "#961b00",
    },
    onError: {
      main: "#ffffff",
      contrastText: "#ba1a1a",
    },
    errorContainer: {
      main: "#ffdad6",
      contrastText: "#410002",
    },
    onErrorContainer: {
      main: "#410002",
      contrastText: "#ffdad6",
    },
    background2: {
      main: "#fffbff",
      contrastText: "#1d1b1e",
    },
    onBackground: {
      main: "#1d1b1e",
      contrastText: "#fffbff",
    },
    surface: {
      main: "#fffbff",
      contrastText: "#1d1b1e",
    },
    onSurface: {
      main: "#1d1b1e",
      contrastText: "#fffbff",
    },
    surfaceVariant: {
      main: "#eadfea",
      contrastText: "#4b454d",
    },
    onSurfaceVariant: {
      main: "#4b454d",
      contrastText: "#eadfea",
    },
    inverseSurface: {
      main: "#322f33",
      contrastText: "#f6eff3",
    },
    inverseOnSurface: {
      main: "#f6eff3",
      contrastText: "#322f33",
    },
    inversePrimary: {
      main: "#e2b6ff",
      contrastText: "#8a26ce",
    },
    surfaceTint: "#8a26ce",
    outline: "#7c757e",
    shadow: "#000000",
    background: {
      main: "rgb(243, 233, 250)",
      default: "rgb(243, 233, 250)",
      paper: "rgb(243, 233, 250)",
      alt: "rgb(219, 189, 240)",
      tile: "rgb(225, 200, 242)",
    },
    common: {
      white: "#fffbff",
      black: "#1d1b1e",
    },
    text: {
      main: "#1d1b1e",
      primary: "#1d1b1e",
      secondary: "#2a1700",
    },
    divider: "#7c757e",
  },
  tones: {
    primary: {
      0: "#000000",
      10: "#2e004d",
      20: "#4d007b",
      30: "#6d00ac",
      40: "#8a26ce",
      50: "#a547e9",
      60: "#bf68ff",
      70: "#d190ff",
      80: "#e2b6ff",
      90: "#f3daff",
      95: "#fbecff",
      99: "#fffbff",
      100: "#ffffff",
    },
    secondary: {
      0: "#000000",
      10: "#2a1700",
      20: "#462a00",
      30: "#653e00",
      40: "#855400",
      50: "#a66a00",
      60: "#c78213",
      70: "#e69c31",
      80: "#ffb95d",
      90: "#ffddb7",
      95: "#ffeede",
      99: "#fffbff",
      100: "#ffffff",
    },
    tertiary: {
      0: "#000000",
      10: "#002111",
      20: "#003921",
      30: "#005232",
      40: "#006d44",
      50: "#008856",
      60: "#00a56a",
      70: "#15c37f",
      80: "#46e098",
      90: "#68fdb2",
      95: "#c0ffd7",
      99: "#f5fff5",
      100: "#ffffff",
    },
    neutral: {
      0: "#000000",
      10: "#1d1b1e",
      20: "#322f33",
      30: "#494649",
      40: "#615d61",
      50: "#7a767a",
      60: "#948f93",
      70: "#afa9ae",
      80: "#cbc5c9",
      90: "#e7e1e5",
      95: "#f6eff3",
      99: "#fffbff",
      100: "#ffffff",
    },
    neutralVariant: {
      0: "#000000",
      10: "#1f1a21",
      20: "#342e37",
      30: "#4b454d",
      40: "#635c65",
      50: "#7c757e",
      60: "#968e98",
      70: "#b1a8b3",
      80: "#cdc3ce",
      90: "#eadfea",
      95: "#f8edf9",
      99: "#fffbff",
      100: "#ffffff",
    },
    error: {
      0: "#000000",
      10: "#410002",
      20: "#690005",
      30: "#93000a",
      40: "#ba1a1a",
      50: "#de3730",
      60: "#ff5449",
      70: "#ff897d",
      80: "#ffb4ab",
      90: "#ffdad6",
      95: "#ffedea",
      99: "#fffbff",
      100: "#ffffff",
    },
  },
};

export const designTokensDark = {
  palette: {
    mode: "dark",
    isDark: true,
    primary: {
      50: "#654980",
      100: "#6b5182",
      200: "#765e8a",
      300: "#846f94",
      400: "#9481a1",
      500: "#a794b3",
      600: "#b9a5c4",
      700: "#ceb8d9",
      800: "#e2caed",
      900: "#f4dbff",
      main: "#e2b6ff",
      contrastText: "#4d007b",
      A100: "#5c2289",
      A200: "#713f95",
      A400: "#a384b6",
      A700: "#f3d0ff",
    },
    onPrimary: {
      main: "#4d007b",
      contrastText: "#e2b6ff",
    },
    primaryContainer: {
      main: "#6d00ac",
      contrastText: "#f3daff",
    },
    onPrimaryContainer: {
      main: "#f3daff",
      contrastText: "#6d00ac",
    },
    secondary: {
      50: "#804106",
      100: "#824b15",
      200: "#8a5b29",
      300: "#946d41",
      400: "#a1825a",
      500: "#b3976f",
      600: "#c4aa80",
      700: "#d9bf91",
      800: "#edd29f",
      900: "#ffe2ad",
      main: "#ffb95d",
      contrastText: "#462a00",
      A100: "#894800",
      A200: "#955200",
      A400: "#b68a48",
      A700: "#ffe199",
    },
    onSecondary: {
      main: "#462a00",
      contrastText: "#ffb95d",
    },
    secondaryContainer: {
      main: "#653e00",
      contrastText: "#ffddb7",
    },
    onSecondaryContainer: {
      main: "#ffddb7",
      contrastText: "#653e00",
    },
    tertiary: {
      50: "#237046",
      100: "#2a734c",
      200: "#367856",
      300: "#458263",
      400: "#548f73",
      500: "#649e85",
      600: "#6fad93",
      700: "#7cbfa4",
      800: "#88d1b5",
      900: "#94e0c3",
      main: "#46e098",
      contrastText: "#003921",
      A100: "#00793c",
      A200: "#008243",
      A400: "#46a279",
      A700: "#88ebca",
    },
    onTertiary: {
      main: "#003921",
      contrastText: "#46e098",
    },
    tertiaryContainer: {
      main: "#005232",
      contrastText: "#68fdb2",
    },
    onTertiaryContainer: {
      main: "#68fdb2",
      contrastText: "#46e098",
    },
    error: {
      50: "#804241",
      100: "#824c4a",
      200: "#8a5b58",
      300: "#946c69",
      400: "#a1817d",
      500: "#b39591",
      600: "#c4a6a1",
      700: "#d9bab4",
      800: "#edccc5",
      900: "#ffded6",
      main: "#ffb4ab",
      contrastText: "#690005",
      A100: "#891b13",
      A200: "#953c33",
      A400: "#b6867e",
      A700: "#ffd7cb",
    },
    onError: {
      main: "#690005",
      contrastText: "#ffb4ab",
    },
    errorContainer: {
      main: "#93000a",
      contrastText: "#ffb4ab",
    },
    onErrorContainer: {
      main: "#ffb4ab",
      contrastText: "#93000a",
    },
    background2: {
      main: "#1d1b1e",
      contrastText: "#e7e1e5",
    },
    onBackground: {
      main: "#e7e1e5",
      contrastText: "#1d1b1e",
    },
    surface: {
      main: "#1d1b1e",
      contrastText: "#e7e1e5",
    },
    onSurface: {
      main: "#e7e1e5",
      contrastText: "#1d1b1e",
    },
    surfaceVariant: {
      main: "#4b454d",
      contrastText: "#cdc3ce",
    },
    onSurfaceVariant: {
      main: "#cdc3ce",
      contrastText: "#4b454d",
    },
    inverseSurface: {
      main: "#e7e1e5",
      contrastText: "#322f33",
    },
    inverseOnSurface: {
      main: "#322f33",
      contrastText: "#e7e1e5",
    },
    inversePrimary: {
      main: "#8a26ce",
      contrastText: "#e2b6ff",
    },
    surfaceTint: "#e2b6ff",
    outline: "#968e98",
    shadow: "#000000",
    background: {
      main: "rgb(56, 45, 63)",
      default: "rgb(56, 45, 63)",
      paper: "rgb(56, 45, 63)",
      alt: "rgb(90, 72, 102)",
      tile: "rgb(79, 63, 89)",
    },
    common: {
      white: "#1d1b1e",
      black: "#e7e1e5",
    },
    text: {
      main: "#e7e1e5",
      primary: "#e7e1e5",
      secondary: "#ffddb7",
    },
    divider: "#968e98",
  },
  tones: {
    primary: {
      0: "#ffffff",
      10: "#fffbff",
      20: "#fbecff",
      30: "#f3daff",
      40: "#e2b6ff",
      50: "#d190ff",
      60: "#bf68ff",
      70: "#a547e9",
      80: "#8a26ce",
      90: "#6d00ac",
      95: "#4d007b",
      99: "#2e004d",
      100: "#000000",
    },
    secondary: {
      0: "#ffffff",
      10: "#fffbff",
      20: "#ffeede",
      30: "#ffddb7",
      40: "#ffb95d",
      50: "#e69c31",
      60: "#c78213",
      70: "#a66a00",
      80: "#855400",
      90: "#653e00",
      95: "#462a00",
      99: "#2a1700",
      100: "#000000",
    },
    tertiary: {
      0: "#ffffff",
      10: "#f5fff5",
      20: "#c0ffd7",
      30: "#68fdb2",
      40: "#46e098",
      50: "#15c37f",
      60: "#00a56a",
      70: "#008856",
      80: "#006d44",
      90: "#005232",
      95: "#003921",
      99: "#002111",
      100: "#000000",
    },
    neutral: {
      0: "#ffffff",
      10: "#fffbff",
      20: "#f6eff3",
      30: "#e7e1e5",
      40: "#cbc5c9",
      50: "#afa9ae",
      60: "#948f93",
      70: "#7a767a",
      80: "#615d61",
      90: "#494649",
      95: "#322f33",
      99: "#1d1b1e",
      100: "#000000",
    },
    neutralVariant: {
      0: "#ffffff",
      10: "#fffbff",
      20: "#f8edf9",
      30: "#eadfea",
      40: "#cdc3ce",
      50: "#b1a8b3",
      60: "#968e98",
      70: "#7c757e",
      80: "#635c65",
      90: "#4b454d",
      95: "#342e37",
      99: "#1f1a21",
      100: "#000000",
    },
    error: {
      0: "#ffffff",
      10: "#fffbff",
      20: "#ffedea",
      30: "#ffdad6",
      40: "#ffb4ab",
      50: "#ff897d",
      60: "#ff5449",
      70: "#de3730",
      80: "#ba1a1a",
      90: "#93000a",
      95: "#690005",
      99: "#410002",
      100: "#000000",
    },
  },
};

export const themedComponentsLight = {
  components: {
    MuiCssBaseline: {
      defaultProps: {
        enableColorScheme: true,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e69c31",
          backgroundColor: "#ffeede",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "2px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: "8px",
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          "@media (min-width:900px)": {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#fffbff",
          color: "#1d1b1e",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
        colorDefault: {
          background: "#ffeede",
          color: "#1d1b1e",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
        colorPrimary: {
          background: "#ffddb7",
          color: "#1d1b1e",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: "bold",
        },
        outlined: {
          borderColor: "#c33300",
        },
      },
      variants: [
        {
          props: {
            variant: "elevated",
          },
          style: {
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            background: "rgba(138, 38, 206, 0.05)",
            color: "#8a26ce",
            "&:hover": {
              background: "rgba(138, 38, 206, 0.15)",
            },
          },
        },
        {
          props: {
            variant: "filled",
          },
          style: {
            background: "#8a26ce",
            color: "#ffffff",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(138, 38, 206, 0.85)",
            },
          },
        },
        {
          props: {
            variant: "tonal",
          },
          style: {
            background: "#ffddb7",
            color: "#2a1700",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(255, 221, 183, 0.8)",
            },
          },
        },
      ],
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
      variants: [
        {
          props: {
            variant: "primary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#f3daff",
            color: "#2e004d",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(223, 200, 234)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "primary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#f3daff",
            color: "#2e004d",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(223, 200, 234)",
            },
          },
        },
        {
          props: {
            variant: "secondary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#ffddb7",
            color: "#2a1700",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(234, 203, 168)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "secondary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#ffddb7",
            color: "#2a1700",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(234, 203, 168)",
            },
          },
        },
        {
          props: {
            variant: "tertiary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#68fdb2",
            color: "#002111",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(95, 232, 163)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "tertiary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#68fdb2",
            color: "#002111",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(95, 232, 163)",
            },
          },
        },
        {
          props: {
            variant: "surface",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "rgba(138, 38, 206, 0.05)",
            color: "#8a26ce",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgba(138, 38, 206, 0.08)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "surface",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "rgba(138, 38, 206, 0.05)",
            color: "#8a26ce",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgba(138, 38, 206, 0.08)",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 8px",
        },
      },
      variants: [
        {
          props: {
            variant: "elevation",
          },
          style: {
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            backgroundColor: "rgba(138, 38, 206, 0.05)",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
              background: "rgba(138, 38, 206, 0.08)",
            },
          },
        },
        {
          props: {
            variant: "filled",
          },
          style: {
            backgroundColor: "#eadfea",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(234, 223, 234, 0.8)",
            },
          },
        },
        {
          props: {
            variant: "outlined",
          },
          style: {
            backgroundColor: "#fffbff",
            borderColor: "#7c757e",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(29, 27, 30, 0.05)",
            },
          },
        },
      ],
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          color: "#1d1b1e",
        },
        rounded: {
          borderRadius: "8px",
          background: "rgb(219, 189, 240)",
        },
        outlined: {
          borderColor: "#7c757e",
          background: "#fffbff",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: "#1d1b1e",
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {},
        paper: {
          border: "0px",
          background: "#ffeede",
          color: "#322f33",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 1,
          paddingBottom: 1,
          "& .MuiListItemButton-root": {
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#1d1b1e",
          paddingTop: "10px",
          paddingBottom: "10px",
          "&.Mui-selected": {
            background: "#ffddb7",
            color: "#2a1700",
            "&:hover": {
              color: "#2a1700",
              background: "rgba(255, 221, 183, 0.8)",
            },
            "& .MuiListItemIcon-root": {
              color: "#855400",
            },
            "& > .MuiListItemText-root > .MuiTypography-root": {
              fontWeight: "bold",
            },
          },
          "&:hover": {
            color: "#ffffff",
            background: "rgba(133, 84, 0, 0.8)",
            "& .MuiListItemIcon-root": {
              color: "#2a1700",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "#855400",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: 32,
          "&.Mui-selected": {
            fontWeight: "bold",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "inherit",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#1d1b1e",
          "&::placeholder": {
            color: "#855400",
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "undefinedpx",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#7c757e",
          },
          "&:hover $notchedOutline": {
            borderColor: "rgba(124, 117, 126, 0.8)",
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          padding: "15.5px 14px",
          borderRadius: "undefinedpx",
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: "undefinedpx",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#e0e0e0",
          },
        },
        mark: {
          backgroundColor: "rgb(243, 233, 250)",
          width: "4px",
        },
        valueLabel: {
          color: "#4a1678",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: "#a355c9",
          background: "#6f23a6",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#ffddb7",
          color: "#2a1700",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiToolbar-root > *": {
            color: "#2e004d",
          },
        },
        virtualScroller: {
          background: "#f3daff",
        },
        footerContainer: {
          color: "#2a1700",
          background: "#ffddb7",
        },
        columnHeaders: {
          color: "#2a1700",
          background: "#ffddb7",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:before": {
            backgroundColor: "#eadfea",
          },
          "&.Mui-disabled": {
            backgroundColor: "#f6eff3",
            color: "#322f33",
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#322f33",
        },
        message: {
          color: "#f6eff3",
        },
        action: {
          color: "#e2b6ff",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          marginLeft: 12,
          marginRight: 8,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 7,
            transitionDuration: "100ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              margin: 4,
              "& + .MuiSwitch-track": {
                backgroundColor: "#8a26ce",
                opacity: 1,
                border: 0,
              },
              "& .MuiSwitch-thumb": {
                color: "#ffffff",
                width: 18,
                height: 18,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                backgroundColor: "rgba(29, 27, 30, 0.1)",
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: "rgba(255, 251, 255, 0.8)",
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#8a26ce",
              border: "6px solid #ffffff",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "rgba(29, 27, 30, 0.3)",
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            color: "#7c757e",
            width: 12,
            height: 12,
            "&:before": {
              content: "''",
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            },
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            border: "1px solid #7c757e",
            backgroundColor: "#eadfea",
            opacity: 1,
            transition:
              "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          },
        },
      },
    },
  },
};

export const themedComponentsDark = {
  components: {
    MuiCssBaseline: {
      defaultProps: {
        enableColorScheme: true,
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#a66a00",
          backgroundColor: "#462a00",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: "2px",
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: "8px",
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          "@media (min-width:900px)": {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "#1d1b1e",
          color: "#e7e1e5",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
        colorDefault: {
          background: "#462a00",
          color: "#e7e1e5",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
        colorPrimary: {
          background: "#653e00",
          color: "#e7e1e5",
          transition:
            "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          fontWeight: "bold",
        },
        outlined: {
          borderColor: "#953c33",
        },
      },
      variants: [
        {
          props: {
            variant: "elevated",
          },
          style: {
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            background: "rgba(226, 182, 255, 0.05)",
            color: "#e2b6ff",
            "&:hover": {
              background: "rgba(226, 182, 255, 0.15)",
            },
          },
        },
        {
          props: {
            variant: "filled",
          },
          style: {
            background: "#e2b6ff",
            color: "#4d007b",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(226, 182, 255, 0.85)",
            },
          },
        },
        {
          props: {
            variant: "tonal",
          },
          style: {
            background: "#653e00",
            color: "#ffddb7",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(101, 62, 0, 0.8)",
            },
          },
        },
      ],
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: "18px",
        },
      },
      variants: [
        {
          props: {
            variant: "primary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#6d00ac",
            color: "#f3daff",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(120, 20, 178)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "primary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#6d00ac",
            color: "#f3daff",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(120, 20, 178)",
            },
          },
        },
        {
          props: {
            variant: "secondary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#653e00",
            color: "#ffddb7",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(113, 77, 20)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "secondary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#653e00",
            color: "#ffddb7",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(113, 77, 20)",
            },
          },
        },
        {
          props: {
            variant: "tertiary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#005232",
            color: "#68fdb2",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(20, 95, 66)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "tertiary",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "#005232",
            color: "#68fdb2",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgb(20, 95, 66)",
            },
          },
        },
        {
          props: {
            variant: "surface",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "rgba(226, 182, 255, 0.05)",
            color: "#e2b6ff",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgba(226, 182, 255, 0.08)",
            },
          },
        },
        {
          props: {
            variant: "extended",
            color: "surface",
          },
          style: {
            boxShadow:
              "0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)",
            background: "rgba(226, 182, 255, 0.05)",
            color: "#e2b6ff",
            fontWeight: "bold",
            "&:hover": {
              boxShadow:
                "0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
              background: "rgba(226, 182, 255, 0.08)",
            },
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          padding: "10px 8px",
        },
      },
      variants: [
        {
          props: {
            variant: "elevation",
          },
          style: {
            boxShadow:
              "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            backgroundColor: "rgba(226, 182, 255, 0.05)",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
              background: "rgba(226, 182, 255, 0.08)",
            },
          },
        },
        {
          props: {
            variant: "filled",
          },
          style: {
            backgroundColor: "#4b454d",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(75, 69, 77, 0.8)",
            },
          },
        },
        {
          props: {
            variant: "outlined",
          },
          style: {
            backgroundColor: "#1d1b1e",
            borderColor: "#968e98",
            transition:
              "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
            "&:hover": {
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
              background: "rgba(231, 225, 229, 0.05)",
            },
          },
        },
      ],
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
          color: "#e7e1e5",
        },
        rounded: {
          borderRadius: "8px",
          background: "rgb(90, 72, 102)",
        },
        outlined: {
          borderColor: "#968e98",
          background: "#1d1b1e",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          color: "#e7e1e5",
          padding: "24px",
        },
        title: {
          fontSize: "1.125rem",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {},
        paper: {
          border: "0px",
          background: "#462a00",
          color: "#f6eff3",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 1,
          paddingBottom: 1,
          "& .MuiListItemButton-root": {
            paddingTop: 8,
            paddingBottom: 8,
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          color: "#e7e1e5",
          paddingTop: "10px",
          paddingBottom: "10px",
          "&.Mui-selected": {
            background: "#653e00",
            color: "#ffddb7",
            "&:hover": {
              color: "#ffddb7",
              background: "rgba(101, 62, 0, 0.8)",
            },
            "& .MuiListItemIcon-root": {
              color: "#ffb95d",
            },
            "& > .MuiListItemText-root > .MuiTypography-root": {
              fontWeight: "bold",
            },
          },
          "&:hover": {
            color: "#462a00",
            background: "rgba(255, 185, 93, 0.8)",
            "& .MuiListItemIcon-root": {
              color: "#ffddb7",
            },
          },
          "& .MuiListItemIcon-root": {
            color: "#ffb95d",
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: 32,
          "&.Mui-selected": {
            fontWeight: "bold",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "inherit",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#e7e1e5",
          "&::placeholder": {
            color: "#ffb95d",
            fontSize: "0.875rem",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "undefinedpx",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#968e98",
          },
          "&:hover $notchedOutline": {
            borderColor: "rgba(150, 142, 152, 0.8)",
          },
          "&.MuiInputBase-multiline": {
            padding: 1,
          },
        },
        input: {
          fontWeight: 500,
          padding: "15.5px 14px",
          borderRadius: "undefinedpx",
          "&.MuiInputBase-inputSizeSmall": {
            padding: "10px 14px",
            "&.MuiInputBase-inputAdornedStart": {
              paddingLeft: 0,
            },
          },
        },
        inputAdornedStart: {
          paddingLeft: 4,
        },
        notchedOutline: {
          borderRadius: "undefinedpx",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "#e0e0e0",
          },
        },
        mark: {
          backgroundColor: "rgb(56, 45, 63)",
          width: "4px",
        },
        valueLabel: {
          color: "#e2caed",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          color: "#765e8a",
          background: "#a794b3",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-deletable .MuiChip-deleteIcon": {
            color: "inherit",
          },
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "#653e00",
          color: "#ffddb7",
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          "& .MuiToolbar-root > *": {
            color: "#f3daff",
          },
        },
        virtualScroller: {
          background: "#6d00ac",
        },
        footerContainer: {
          color: "#ffddb7",
          background: "#653e00",
        },
        columnHeaders: {
          color: "#ffddb7",
          background: "#653e00",
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          "&:before": {
            backgroundColor: "#4b454d",
          },
          "&.Mui-disabled": {
            backgroundColor: "#322f33",
            color: "#e7e1e5",
          },
        },
      },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#e7e1e5",
        },
        message: {
          color: "#322f33",
        },
        action: {
          color: "#8a26ce",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          marginLeft: 12,
          marginRight: 8,
          "& .MuiSwitch-switchBase": {
            padding: 0,
            margin: 7,
            transitionDuration: "100ms",
            "&.Mui-checked": {
              transform: "translateX(16px)",
              margin: 4,
              "& + .MuiSwitch-track": {
                backgroundColor: "#e2b6ff",
                opacity: 1,
                border: 0,
              },
              "& .MuiSwitch-thumb": {
                color: "#4d007b",
                width: 18,
                height: 18,
              },
              "&.Mui-disabled + .MuiSwitch-track": {
                backgroundColor: "rgba(231, 225, 229, 0.1)",
              },
              "&.Mui-disabled .MuiSwitch-thumb": {
                color: "rgba(29, 27, 30, 0.8)",
              },
            },
            "&.Mui-focusVisible .MuiSwitch-thumb": {
              color: "#e2b6ff",
              border: "6px solid #4d007b",
            },
            "&.Mui-disabled .MuiSwitch-thumb": {
              color: "rgba(231, 225, 229, 0.3)",
            },
          },
          "& .MuiSwitch-thumb": {
            boxSizing: "border-box",
            color: "#968e98",
            width: 12,
            height: 12,
            "&:before": {
              content: "''",
              position: "absolute",
              width: "100%",
              height: "100%",
              left: 0,
              top: 0,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            },
          },
          "& .MuiSwitch-track": {
            borderRadius: 13,
            border: "1px solid #968e98",
            backgroundColor: "#4b454d",
            opacity: 1,
            transition:
              "background-color 500ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          },
        },
      },
    },
  },
};
