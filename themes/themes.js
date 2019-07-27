import { createMuiTheme } from "@material-ui/core/styles";

const palette = {
    primary: {
        light: "#E87722",
        main: "#E87722",
        dark: "#E87722",
        contrastText: "#222222"
    },
    secondary: {
        light: "#F2B411",
        main: "#F2B411",
        dark: "#F2B411",
        contrastText: "#222222"
    },
    typography: {
        fontFamily: "Roboto"
    }
};
const themeName = "OPTUM Hoteling";

export default createMuiTheme({
    palette,
    themeName
});
