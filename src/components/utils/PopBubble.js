//@flow
import React from "react";
import Popover from "material-ui/Popover";
import { withStyles } from "material-ui/styles";

const styles = {
    paper: {
        marginTop: 20,
        padding: 20,
        overflow: "inherit"
    }
};

function PopBubble(props: {
    className?: string,
    style?: Object,
    children?: React$Node,
    open: boolean,
    direction?: *
}) {
    const horizontal = props.direction ? props.direction : "right";
    const transformHorizontal = props.directiontransform
        ? props.directiontransform
        : horizontal;

    return (
        <Popover
            {...props}
            className={`pop-bubble ${props.className || ""}`}
            anchorOrigin={{ horizontal: horizontal, vertical: "bottom" }}
            transformOrigin={{
                horizontal: transformHorizontal,
                vertical: "top"
            }}
        >
            {props.children}
        </Popover>
    );
}

export default withStyles(styles)(PopBubble);
