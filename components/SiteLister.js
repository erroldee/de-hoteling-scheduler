import React, { Component, Fragment } from "react";
import { Paper, withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Link from "next/link";
import Button from "@material-ui/core/Button";
import firebase from "../services/firebase-service";

class SiteLister extends Component {
    classes = this.props.classes;
    db = null;

    state = {
        sites: [],
        loading: true
    };

    componentDidMount() {
        this.db = firebase.firestore();

        this.getSiteData();
    }

    getSiteData = () => {
        const self = this;

        this.db.collection("config").doc("sites")
            .onSnapshot({ includeMetadataChanges: true }, doc => {
                if (doc.exists) {
                    self.setState({
                        'sites': doc.data().locations,
                        'loading': false
                    });
                } else {
                    self.setState({
                        'loading': false
                    });
                }
            });
    };

    renderSites = (classes) => {
        if (this.state.loading) {
            return (
                <div>
                    <Typography variant="h6">
                        Getting Site Data...
                    </Typography>
                </div>
            );
        } else {
            if (this.state.sites.length > 0) {
                return(
                    <Fragment>
                        {
                            this.state.sites.map((site, idx) => (
                                <Link key={idx} href={`/site?site=${site.toLowerCase()}`}>
                                    <Button
                                        variant="outlined" size="large" color="primary"
                                        className={(this.state.sites.length === (idx + 1)) ? classes.paperButton : classes.buttomMargin}
                                    >
                                        {site.toUpperCase()}
                                    </Button>
                                </Link>
                            ))
                        }
                    </Fragment>
                );
            } else {
                return (
                    <div>
                        <Typography variant="h5">
                            Site List Not Available...
                        </Typography>
                    </div>
                );
            }
        }
    };

    render() {
        return(
            <div className={this.classes.siteContainer}>
                <Paper className={this.classes.siteContainerPaper}>
                    {
                        (!this.state.loading && this.state.sites.length > 0) && (
                            <Typography variant="h5" className={this.classes.titleMargin}>
                                Sites
                            </Typography>
                        )
                    }
                    { this.renderSites(this.classes) }
                </Paper>
            </div>
        )
    }
}

const styles = theme => ({
    siteContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        padding: '3em 10% 0 10%'
    },
    siteContainerPaper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: 300,
        width: '30%',
        padding: 20
    },
    titleMargin: {
        marginBottom: 5
    },
    paperButton: {
        width: "100%"
    },
    buttomMargin: {
        width: "100%",
        margin: 10
    }
});

export default withStyles(styles)(SiteLister);