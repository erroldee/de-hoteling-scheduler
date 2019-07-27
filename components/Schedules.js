import React, { Component, Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import firebase from "../services/firebase-service";
import moment from "moment";
import { ManipulationService } from "../services/manipulation-service";
import DateService from "../services/dates-service";
import { CONSTANTS } from "../Constants";
import Schedule from "./Schedule";
import TextField from "@material-ui/core/TextField";

class Schedules extends Component {
    classes = this.props.classes;
    site = this.props.site;
    dateService = null;
    db = null;

    state = {
        currentDate: moment(),
        schedulerStart: moment(),
        currentDiffCounter: 0,
        displayMembers: [],
        frequency: 1,
        members: [],
        holidays: [],
        variable: [],
        loading: true
    };

    componentDidMount() {
        const self = this;

        this.db = firebase.firestore();
        this.getScheduleData();
    }

    getScheduleData = () => {
        const self = this;

        this.db.collection("config").doc("frequency")
            .onSnapshot({ includeMetadataChanges: true }, doc => {
                if (doc.exists) {
                    self.setState({
                        frequency: doc.data()[self.site]
                    }, self.setNewDate);
                }
            });

        this.db.collection("config").doc("scheduler-start")
            .onSnapshot({ includeMetadataChanges: true }, doc => {
                if (doc.exists) {
                    self.setState({
                        schedulerStart: moment(doc.data()[self.site])
                    }, self.setNewDate);
                }
            });

        this.db.collection("config").doc("holidays")
            .onSnapshot({ includeMetadataChanges: true }, doc => {
                if (doc.exists) {
                    self.setState({
                        holidays: doc.data().static,
                        variable: ManipulationService.combineArrays(
                            doc.data().variable,
                            doc.data()[self.site]
                        )
                    }, self.setNewDate);
                }
            });

        this.db.collection("members").doc(this.site)
            .onSnapshot({ includeMetadataChanges: true }, doc => {
                if (doc.exists) {
                    self.setState({
                        members: doc.data().info
                    }, self.setNewDate);
                }
            });
    };

    setNewDate = () => {
        this.dateService = new DateService(
            this.state.schedulerStart,
            this.state.currentDate,
            this.state.holidays,
            this.state.variable
        );

        const currentDiffCounter = this.dateService.getDiffDays(
            this.dateService.getSchedulerStart(),
            this.dateService.getCurrentDay()
        );

        this.setState({
            currentDiffCounter,
            displayMembers: []
        }, () => {
            this.updateDisplayData();
        });
    };

    updateDisplayData = () => {
        let counter = 0;
        const currentDiff = this.state.currentDiffCounter;
        const displayMembers = [];

        while(counter <= CONSTANTS.DAYS_TO_DISPLAY) {
            const currentCount = currentDiff + counter;
            const date = this.dateService.getFutureDay(currentCount);
            const today = !moment().diff(date);
            const listOfHolidays = this.dateService.getCompleteHolidayList();

            if ((listOfHolidays.findIndex(moment => moment.isSame(date)) === -1) &&
                (!(date.day() === 6 || date.day() === 0))) {
                const members = this.getHotelier(currentCount);

                displayMembers.push({
                    date,
                    members,
                    today
                });
            }

            counter++;
        }

        this.setState({
            displayMembers
        });
    };

    getHotelier = (daysIntoTheFuture) => {
        const start = this.dateService.getSchedulerStart();
        const future = this.dateService.getFutureDay(daysIntoTheFuture);
        const startDay = start.day();
        const futureDay = future.day();

        const weekends = (2 * (Math.floor((daysIntoTheFuture + (startDay + 6) % 7) / 7)) + (futureDay === 6) - (startDay === 0));
        const holidays = this.dateService.getNumberOfHolidays(future);

        let memberCount = 0;
        let movingCount = (daysIntoTheFuture - weekends - holidays) * this.state.frequency;
        const members = [];

        if (this.state.members.length) {
            while(memberCount < this.state.frequency) {
                const name = this.state.members[(movingCount + memberCount) % this.state.members.length];
                const color = CONSTANTS.avatarColors[(movingCount + memberCount) % this.state.members.length];
                const avatarArray = name.split(" ");
                let avatar = name.charAt(0).toUpperCase();

                if (avatarArray.length > 1) {
                    avatar = avatar + avatarArray[avatarArray.length - 1].charAt(0).toUpperCase();
                }

                members.push({
                    avatar,
                    color,
                    name
                });

                memberCount++;
            }
        }

        return members;
    };

    renderMembers = (classes) => {
        return this.state.displayMembers.map((data, dataIdx) => {
            return (
                <div key={dataIdx} className={classes.groupMargin}>
                    {
                        data.members.map((member, memberIdx) => (
                            <Schedule
                                key={memberIdx}
                                date={data.date.format("MMMM Do, YYYY")}
                                today={data.today}
                                member={member}
                            />
                        ))
                    }
                </div>
            );
        });
    };

    changeDate = (event) => {
        let selectedDate = moment(event.target.value, "YYYY-MM-DD");

        if (this.state.schedulerStart.diff(selectedDate) >= 0) {
            selectedDate = this.state.schedulerStart;
        }

        console.log(selectedDate);

        this.setState({
            currentDate: selectedDate
        }, () => {
            this.setNewDate();
        });
    };

    render() {
        return(
            <div className={this.classes.siteContainer}>
                <div className={this.classes.siteContainerPaper}>
                    <form className={this.classes.dateContainer} noValidate>
                        <TextField
                            id="date"
                            label="Viewing Date"
                            type="date"
                            value={this.state.currentDate.format("YYYY-MM-DD")}
                            className={this.classes.dateTextField}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            min={this.state.schedulerStart.format("YYYY-MM-DD")}
                            onChange={this.changeDate}
                        />
                    </form>
                    {this.renderMembers(this.classes)}
                </div>
            </div>
        )
    }
}

const styles = theme => ({
    siteContainer: {
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        padding: '1em 10% 0 10%'
    },
    siteContainerPaper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '300px',
        width: '35%',
        padding: theme.spacing(3, 2)
    },
    groupMargin: {
        width: '100%',
        marginBottom: 10
    },
    dateContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20
    },
    dateTextField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    }
});

export default withStyles(styles)(Schedules);