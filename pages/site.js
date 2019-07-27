import React, { Component, Fragment } from 'react';
import withRouter from "next/dist/client/with-router";
import { withStyles } from "@material-ui/core/styles";
import OptumLayout from "../components/OptumLayout";
import { AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import HomeIcon from '@material-ui/icons/Home';
import Mounter from "../components/Mounter";
import { ManipulationService } from "../services/manipulation-service";
import Schedules from "../components/Schedules";
import Router from "next/router";
import firebase from "../services/firebase-service";

class Site extends Component {
    state = {
        site: null
    };

    classes = this.props.classes;

    componentDidMount() {
        console.log('test');
        const { site } = this.props.query;

        const db = firebase.firestore();

        // check if site exist
        db.collection("config").doc("sites").get()
            .then(doc => {
                let exist = false;

                if (doc.exists) {
                    if (doc.data().locations.indexOf(site) !== -1) {
                        exist = true;
                    }
                }
                this.setState({
                    site
                });

            }).catch(err => {
            console.log(err);
        })
    }

    routeToHome = () => {
        Router.push("/", "/");
    };

    render() {
        return(
            <Mounter>
                <OptumLayout>
                    <Fragment>
                        {
                            this.state.site && (
                                <Fragment>
                                    <AppBar position="static">
                                        <Toolbar>
                                            <IconButton edge="start" className={this.classes.menuButton} color="inherit" aria-label="menu" onClick={this.routeToHome}>
                                                <HomeIcon />
                                            </IconButton>
                                            <Typography variant="h6" className={this.classes.title}>
                                                { ManipulationService.capitalize(this.state.site) } Site Hoteling Schedule
                                            </Typography>
                                        </Toolbar>
                                    </AppBar>
                                    <Schedules
                                        site={this.state.site}
                                    />
                                </Fragment>
                            )
                        }
                    </Fragment>
                </OptumLayout>
            </Mounter>
        );
    }
}

Site.getInitialProps = async ({ query }) => {
    return { query };
};

const styles = theme => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    }
});

export default withStyles(styles)(withRouter(Site));