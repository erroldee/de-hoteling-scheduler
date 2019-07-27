import React, { Fragment } from "react";
import Head from "next/head";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import optumTheme from "../themes/themes";

const OptumLayout = props => {
    return(
        <Fragment>
            <Head>
                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" crossOrigin="anonymous" />
            </Head>
            <ThemeProvider theme={optumTheme}>
                {props.children}
            </ThemeProvider>
        </Fragment>
    )
};

export default OptumLayout;