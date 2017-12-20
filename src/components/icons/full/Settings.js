//@flow
import React, { PureComponent } from "react";

type Props = { color: string };

export default class Settings extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 30" {...props}>
        <path
          fill={color}
          d="M25.88,11.56l-.76-1.84L26.73,5.5,24.39,3.18,20.25,4.87l-1.83-.75L16.58,0H13.29L11.56,4.12l-1.83.76L5.51,3.28,3.18,5.61,4.87,9.74l-.75,1.84L0,13.42v3.3l4.13,1.73.76,1.83L3.28,24.49l2.33,2.33,4.14-1.7,1.84.76L13.42,30h3.3l1.72-4.12,1.84-.76,4.21,1.61,2.33-2.33-1.7-4.14.76-1.84L30,16.58V13.29ZM20.63,15A5.62,5.62,0,1,1,15,9.38,5.62,5.62,0,0,1,20.63,15Zm-.81,0"
        />
      </svg>
    );
  }
}
