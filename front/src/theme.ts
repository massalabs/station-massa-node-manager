import { createTheme } from "@mui/material/styles";
import { red } from "@mui/material/colors";

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#e74e4e",
        },
        secondary: {
            main: "#2c3e50",
        },
        error: {
            main: red.A400,
        },
        background: {
            paper: "#172330",
        },
    },
});

export default theme;
