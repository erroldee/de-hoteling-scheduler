import React from "react";
import Card from "@material-ui/core/Card";
import withStyles from "@material-ui/core/styles/withStyles";
import Avatar from "@material-ui/core/Avatar";
import CardHeader from "@material-ui/core/CardHeader";

const Schedule = props => (
    <Card className={props.today ? props.classes.activeCard : props.classes.cardContainer}>
        <CardHeader
            avatar={
                <Avatar style={{backgroundColor: props.member.color}} aria-label="avatar" className={props.classes.avatar}>
                    {props.member.avatar}
                </Avatar>
            }

            title={props.member.name}
            subheader={props.date}
        />
    </Card>
);

const styles = theme => ({
    activeCard: {
        width: '100%',
        backgroundColor: "#FFF88C",
        marginBottom: 10
    },
    cardContainer: {
        width: '100%',
        marginBottom: 10
    }
});

export default withStyles(styles)(Schedule);