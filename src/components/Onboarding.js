//@flow
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import cx from "classnames";

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

export const Step = withStyles(
  step
)(
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
  }) => {
    return (
      <div
        className={cx(classes.base, className, { [classes.active]: active })}
      >
        {label}
      </div>
    );
  }
);

export const ListItem = withStyles(
  listItem
)(
  ({
    children,
    number,
    classes
  }: {
    children: React$Node,
    number?: number,
    classes: { [$Keys<typeof listItem>]: string }
  }) => {
    return (
      <li className={classes.base}>
        {number && <span className={classes.number}>{number}.</span>}
        <span>{children}</span>
      </li>
    );
  }
);

const list = {
  base: {
    margin: 0,
    padding: 0,
    marginBottom: 30
  }
};

export const List = withStyles(
  list
)(
  ({
    children,
    classes
  }: {
    children: React$Node,
    classes: { [$Keys<typeof list>]: string }
  }) => {
    return <ul className={classes.base}>{children}</ul>;
  }
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

export const Title = withStyles(
  title
)(
  ({
    classes,
    children
  }: {
    children: React$Node,
    classes: { [$Keys<typeof title>]: string }
  }) => {
    return <h2 className={classes.base}>{children}</h2>;
  }
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
export const Introduction = withStyles(
  introduction
)(
  ({
    classes,
    children
  }: {
    children: React$Node,
    classes: { [$Keys<typeof introduction>]: string }
  }) => {
    return <p className={classes.base}>{children}</p>;
  }
);

// const menuHeading = {
//   base: {
//     fontSize: 11,
//     textTransform: "uppercase",
//     color: "black",
//     display: "block",
//     marginBottom: 10,
//     fontWeight: 600
//   }
// };
//
// export const MenuHeading = withStyles(
//   menuHeading
// )(
//   ({
//     classes,
//     children,
//     selected
//   }: {
//     classes: { [_: $Keys<typeof menuHeading>]: string },
//     children: React$Node,
//     selected: boolean
//   }) => {
//     return (
//       <span
//         className={cx(classes.base, {
//           [classes.selected]: selected
//         })}
//       >
//         {children}
//       </span>
//     );
//   }
// );

// const menuItem = {
//   base: {
//     fontSize: 11,
//     lineHeight: 1.82,
//     color: "black"
//   }
// };
// export const MenuItem = withStyles(
//   menuItem
// )(
//   ({
//     classes,
//     children,
//     selected
//   }: {
//     classes: { [_: $Keys<typeof menuItem>]: string },
//     children: React$Node,
//     selected: boolean
//   }) => {
//     return (
//       <span
//         className={cx(classes.base, {
//           [classes.selected]: selected
//         })}
//       >
//         {children}
//       </span>
//     );
//   }
// );

const subtitle = {
  base: {
    fontSize: 11,
    fontWeight: 600,
    display: "block",
    textTransform: "uppercase",
    margin: "0 0 22px 0"
  }
};

export const SubTitle = withStyles(
  subtitle
)(
  ({
    classes,
    children,
    className
  }: {
    classes: { [$Keys<typeof subtitle>]: string },
    children: React$Node,
    className?: string
  }) => {
    return <span className={cx(classes.base, className)}>{children}</span>;
  }
);

const toContinue = {
  base: {
    fontSize: 11,
    lineHeight: 1.82
  }
};
export const ToContinue = withStyles(
  toContinue
)(
  ({
    classes,
    children
  }: {
    classes: { [$Keys<typeof subtitle>]: string },
    children: React$Node
  }) => {
    return <span className={classes.base}>{children}</span>;
  }
);

export const Awaiting = withStyles({
  base: {
    color: "#767676",
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase"
  }
})(({ classes }) => {
  return <span className={classes.base}>awaiting device...</span>;
});
