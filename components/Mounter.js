import React, { Component, Fragment } from "react";

class Mounter extends Component {
    state = {
        loaded: false
    };

    componentDidMount() {
        this.setState({
            loaded: true
        });
    }

    render() {
        return(
            <Fragment>
                {
                    this.state.loaded && (
                        this.props.children
                    )
                }
            </Fragment>
        )
    }
}

export default Mounter;