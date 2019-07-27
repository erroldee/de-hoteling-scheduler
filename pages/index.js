import React, { Component } from "react";
import OptumLayout from "../components/OptumLayout";
import SiteLister from "../components/SiteLister";
import Mounter from "../components/Mounter";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";

class Index extends Component {
    render() {
        return(
            <Mounter>
                <OptumLayout>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6">
                                OptumRx Hoteling Tool
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <SiteLister />
                </OptumLayout>
            </Mounter>
        );
    }
}

export default Index;