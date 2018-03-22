//@flow
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import connectData from "restlay/connectData";
import React, { Component } from "react";
import Card from "components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "components/EvolutionSince";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "material-ui/styles";
import openSocket from "socket.io-client";
import { addMessage } from "redux/modules/alerts";
import { connect } from "react-redux";

const styles = {
    base: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    body: {
        flex: "1 1",
        marginRight: "20px",
        minWidth: "680px"
    },
    aside: {
        width: "320px"
    }
};

const mapDispatchToProps = dispatch => ({
    onAddMessage: (title, content, type) =>
        dispatch(addMessage(title, content, type))
});

class Dashboard extends Component<
    {
        classes: { [_: $Keys<typeof styles>]: string },
        match: *,
        location: *,
        history: *,
        onAddMessage: (t: string, m: string, ty: string) => void
    },
    {
        filter: string
    }
> {
    constructor(props) {
        super(props);

        this.state = {
            filter: TotalBalanceFilters[0].key
        };

        var { onAddMessage } = this.props;

        var socket = openSocket.connect("https://localhost:3033");

        var myAuthToken = "admin1";
        socket.on("connect", function() {
            socket.emit("authenticate", { token: myAuthToken });
        });
        socket.on("admin", function(message) {
            console.log(message);
            onAddMessage("INFO", message, "success");
        });
    }

    onTotalBalanceFilterChange = (filter: string) => {
        this.setState({ filter });
    };

    render() {
        const { match, classes } = this.props;
        const { filter } = this.state;
        const { onTotalBalanceFilterChange } = this;

        return (
            <div className={classes.base}>
                <div className={classes.body}>
                    <TotalBalanceCard
                        filter={filter}
                        onTotalBalanceFilterChange={onTotalBalanceFilterChange}
                    />
                    <LastOperationCard />
                    <Storages filter={filter} />
                </div>
                <div className={classes.aside}>
                    <Card title="currencies">
                        <Currencies />
                    </Card>
                    <PendingCard />
                </div>
                <ModalRoute
                    path={`${match.url}/operation/:operationId/:tabIndex`}
                    component={OperationModal}
                />
            </div>
        );
    }
}

export default connectData(
    connect(undefined, mapDispatchToProps)(withStyles(styles)(Dashboard)),
    {
        queries: {
            currencies: CurrenciesQuery
        }
    }
);
