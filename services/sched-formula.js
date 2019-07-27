import React, { Component } from "react";
import DateService from "./dates-service";
import moment from "moment";
import { CONSTANTS } from "../Constants";
import firebase from "firebase";

class SchedFormula extends Component {
    state = {
        currentDate: {
            alabang: moment(),
            qc: moment()
        },
        currentDiffCounter: {
            alabang: 0,
            qc: 0
        },
        displayMembers: {
            alabang: [],
            qc: []
        }
    };

    DATE_SERVICE = {
        alabang: null,
        qc: null
    };
    MEMBERS = {
        alabang: [],
        qc: []
    };
    SITES = [
        'alabang',
        'qc'
    ];
    SCHEDULER_START = {
        alabang: moment(),
        qc: moment()
    };
    FREQUENCY = {
        qc: 1,
        alabang: 1
    };
    HOLIDAY = [];
    VARIABLES = [];
    DB = null;

    componentDidMount() {
        firebase.initializeApp(CONSTANTS.FIREBASE_CONFIG);
        this.DB = firebase.firestore();

        firebase.firestore().settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });

        firebase.firestore().enablePersistence();

        this.getSiteData();
    }

    getSiteData = () => {
        this.DB.collection("config").doc("sites").get().then(doc => {
            if (doc.exists) {
                this.SITES = doc.data().locations;

                this.setInitialSiteData();
            }
        });
    };

    setInitialSiteData = () => {
        let displayMembers = {};
        let currentDate = {};
        let currentDiffCounter = {};
        this.MEMBERS = {};
        this.SCHEDULER_START = {};
        this.DATE_SERVICE = {};

        this.SITES.forEach(site => {
            displayMembers[site] = [];
            currentDate[site] = moment();
            currentDiffCounter[site] = 0;
            this.MEMBERS[site] = [];
            this.SCHEDULER_START[site] = moment();
            this.DATE_SERVICE[site] = null;
        });

        this.setState({
            displayMembers,
            currentDate
        }, () => {
            this.getData();
        });
    };

    getData = () => {
        const self = this;

        this.DB.collection("config").get().then((configSnapshot) => {
            configSnapshot.forEach(function(config) {
                switch(config.id) {
                    case "frequency":
                        self["FREQUENCY"] = config.data();
                        break;
                    case "scheduler-start":
                        self["SCHEDULER_START"] = config.data();
                        break;
                    case "holidays":
                        self.HOLIDAY = config.data().static;
                        self.VARIABLES = config.data().variable;
                        break;
                }
            });

            self.DB.collection("members").get().then((memberSnapshot) => {
                memberSnapshot.forEach(function(member) {
                    if (self.SITES.indexOf(member.id) !== -1) {
                        self.MEMBERS[member.id] = member.data().info;
                    }
                });

                self.SITES.forEach(site => {
                    self.setNewDate(site);
                });
            });
        });
    };

    setNewDate = (site) => {
        this.DATE_SERVICE[site] = new DateService(moment(this.SCHEDULER_START[site]), this.state.currentDate[site], this.HOLIDAY, this.VARIABLES);

        this.setState(prevState => {
            let currentDiffCounter = { ...prevState.currentDiffCounter };
            let displayMembers = { ...prevState.displayMembers };

            currentDiffCounter[site] = this.DATE_SERVICE[site].getDiffDays(
                this.DATE_SERVICE[site].getSchedulerStart(),
                this.DATE_SERVICE[site].getCurrentDay()
            );

            displayMembers[site] = [];

            return {
                currentDiffCounter,
                displayMembers
            };
        }, () => {
            this.updateDisplayData(site);
        });
    };

    getHotelier = (daysIntoTheFuture, site) => {
        const start = this.DATE_SERVICE[site].getSchedulerStart();
        const future = this.DATE_SERVICE[site].getFutureDay(daysIntoTheFuture);
        const startDay = start.day();
        const futureDay = future.day();

        const weekends = (2 * (Math.floor((daysIntoTheFuture + (startDay + 6) % 7) / 7)) + (futureDay === 6) - (startDay === 0));
        //const weekends = (2 * (Math.floor((currentDiff + (startDay + 6) % 7) / 7)) + (futureDay === 6) - (startDay === 0));
        const holidays = this.DATE_SERVICE[site].getNumberOfHolidays(future);

        let memberCount = 0;
        let movingCount = (daysIntoTheFuture - weekends - holidays) * this.FREQUENCY[site];
        const members = [];

        while(memberCount < this.FREQUENCY[site]) {
            members.push(this.MEMBERS[site][(movingCount + memberCount) % this.MEMBERS[site].length]);
            memberCount++;
        }

        return members;
    };

    updateDisplayData = (site) => {
        let counter = 0;
        const currentDiff = this.state.currentDiffCounter[site];
        const siteDisplayMembers = [];

        while(counter <= CONSTANTS.DAYS_TO_DISPLAY) {
            const currentCount = currentDiff + counter;
            const date = this.DATE_SERVICE[site].getFutureDay(currentCount);

            if (!(date.day() === 6 || date.day() === 0)) {
                const members = this.getHotelier(currentCount, site);

                siteDisplayMembers.push({
                    date,
                    members
                });
            }

            counter++;
        }

        this.setState(prevState => {
            let displayMembers = { ...prevState.displayMembers };

            displayMembers[site] = siteDisplayMembers;

            return {
                displayMembers
            };
        });
    };

    renderMembers = (site) => {
        return this.state.displayMembers[site].map((data, idx) => {
            return (
                <div key={idx}>
                    <div>
                        DATE: {data.date.format("MM-DD-YYYY")}
                    </div>
                    {
                        data.members.map((member, idx) => (
                            <div key={idx}>
                                <div>Name: {member}</div>
                            </div>
                        ))
                    }
                </div>
            );
        });
    };

    render() {
        return(
            <div>
                {this.renderMembers('qc')}
            </div>
        );
    }
}

export default SchedFormula;