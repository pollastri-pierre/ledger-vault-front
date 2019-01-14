// @flow
import React from "react";
import colors from "shared/colors";
import People from "components/icons/thin/People";
import Plus from "components/icons/full/Plus";
import { withStyles } from "@material-ui/core/styles";
import Profile from "components/icons/thin/Profile";
import cx from "classnames";

const careful = {
  base: {
    padding: 10,
    background: "#27d0e280",
    marginTop: 20,
    alignItems: "center",
    fontWeight: "bold",
    color: "#18909c",
    borderRadius: 4,
    display: "flex"
  },
  icon: {
    width: 20,
    color: "white",
    height: 20,
    borderRadius: "50%",
    textAlign: "center",
    fontWeight: "bold",
    marginRight: 15,
    background: colors.ocean
  }
};
export const Careful = withStyles(careful)(({ children, classes }) => (
  <div className={classes.base}>
    <div className={classes.icon}>!</div>
    <div> {children}</div>
  </div>
));

const addUser = {
  base: {
    color: "#27d0e2",
    textDecoration: "none",
    textTransform: "uppercase",
    fontSize: 11,
    fontWeight: 600,
    position: "absolute",
    cursor: "pointer",
    top: 8,
    right: 0
  },
  icon: {
    width: 11,
    marginRight: 10,
    verticalAlign: "middle"
  }
};
export const AddUser = withStyles(addUser)(({ onClick, children, classes }) => (
  <div onClick={onClick} className={classes.base}>
    <Plus className={classes.icon} />
    <span>{children}</span>
  </div>
));
const noMembers = {
  base: {
    fontSize: 11,
    lineHeight: 1.82,
    textAlign: "center",
    width: 264,
    margin: "auto",
    marginTop: 110
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    margin: 0,
    marginBottom: 5,
    textAlign: "center",
    textTransform: "uppercase"
  },
  info: {
    fontSize: 11,
    textAlign: "center",
    lineHeight: 1.82,
    margin: 0
  }
};

export const NoMembers = withStyles(noMembers)(
  ({
    classes,
    label,
    info
  }: {
    classes: { [$Keys<typeof noMembers>]: string },
    label: *,
    info: *
  }) => (
    <div className={classes.base}>
      <People
        color="#cccccc"
        style={{
          height: 29,
          display: "block",
          margin: "auto",
          marginBottom: 21
        }}
      />
      <div className={classes.label}>{label}</div>
      <div className={classes.info}>{info}</div>
    </div>
  )
);
const listItem = {
  base: {
    fontSize: 13,
    lineHeight: 1.54,
    padding: 0,
    margin: 0,
    listStyleType: "none",
    display: "flex",
    position: "relative",
    paddingBottom: 15,
    paddingTop: 15,
    "&:after": {
      height: 1,
      width: "100%",
      backgroundColor: "#eeeeee",
      position: "absolute",
      content: '""',
      bottom: 0
    },
    "&:first-child": {
      paddingTop: 0
    },
    "&:last-child:after": {
      display: "none"
    },
    "& a": {
      textDecoration: "none",
      textTransform: "uppercase",
      fontSize: 12,
      fontWeight: 600,
      color: "#27d0e2"
    }
  },
  number: {
    fontSize: 16,
    margin: "0 15px 15px 0"
  }
};

const step = {
  base: {
    fontSize: 13,
    color: "#767676",
    padding: "15px 0 15px 0",
    borderBottom: "1px solid #eeeeee",
    "&:last-child": {
      border: 0
    }
  },
  active: {
    // fontSize: 16,
    color: "black",
    "&:before": {
      content: '""',
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#27d0e2",
      display: "inline-block",
      marginRight: 10,
      verticalAlign: "middle"
    }
  }
};

const profile = {
  base: {
    width: 28
  }
};
export const ProfileIcon = withStyles(profile)(
  ({ classes }: { classes: { [$Keys<typeof profile>]: string } }) => (
    <div style={{ marginBottom: 10 }}>
      <Profile color="#cccccc" className={classes.base} />
    </div>
  )
);

export const Step = withStyles(step)(
  ({
    classes,
    className,
    label,
    active
  }: {
    classes: { [$Keys<typeof step>]: string },
    label: string,
    active: boolean,
    className?: string
  }) => (
    <div className={cx(classes.base, className, { [classes.active]: active })}>
      {label}
    </div>
  )
);

export const ListItem = withStyles(listItem)(
  ({
    children,
    number,
    classes
  }: {
    children: React$Node,
    number?: number,
    classes: { [$Keys<typeof listItem>]: string }
  }) => (
    <li className={classes.base}>
      {number && <span className={classes.number}>{number}.</span>}
      <span>{children}</span>
    </li>
  )
);

const list = {
  base: {
    margin: 0,
    padding: 0,
    marginBottom: 30
  }
};

export const List = withStyles(list)(
  ({
    children,
    classes
  }: {
    children: React$Node,
    classes: { [$Keys<typeof list>]: string }
  }) => <ul className={classes.base}>{children}</ul>
);

const title = {
  base: {
    fontSize: 18,
    letterSpacing: -0.2,
    fontFamily: "Museo",
    fontWeight: "500",
    margin: "8px 0 30px 0"
  }
};

export const Title = withStyles(title)(
  ({
    classes,
    children
  }: {
    children: React$Node,
    classes: { [$Keys<typeof title>]: string }
  }) => <h2 className={classes.base}>{children}</h2>
);

const introduction = {
  base: {
    fontSize: 13,
    lineHeight: 1.52,
    margin: "0 0 30px 0",
    "& strong": {
      fontWeight: 600
    }
  }
};
export const Introduction = withStyles(introduction)(
  ({
    classes,
    children
  }: {
    children: React$Node,
    classes: { [$Keys<typeof introduction>]: string }
  }) => <p className={classes.base}>{children}</p>
);

const subtitle = {
  base: {
    fontSize: 11,
    fontWeight: 600,
    display: "block",
    textTransform: "uppercase",
    margin: "0 0 22px 0"
  }
};

export const SubTitle = withStyles(subtitle)(
  ({
    classes,
    children,
    className
  }: {
    classes: { [$Keys<typeof subtitle>]: string },
    children: React$Node,
    className?: string
  }) => <span className={cx(classes.base, className)}>{children}</span>
);

const toContinue = {
  base: {
    fontSize: 11,
    lineHeight: 1.82
  }
};
export const ToContinue = withStyles(toContinue)(
  ({
    classes,
    children
  }: {
    classes: { [$Keys<typeof subtitle>]: string },
    children: React$Node
  }) => <span className={classes.base}>{children}</span>
);

export const Awaiting = withStyles({
  base: {
    color: "#767676",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase"
  }
})(({ classes, device }) => (
  <span className={classes.base}>
    awaiting {device ? "device" : "server"}...
  </span>
));
