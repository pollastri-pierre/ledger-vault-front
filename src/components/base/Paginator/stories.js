import React from "react";
import { storiesOf } from "@storybook/react";
import Paginator from "components/base/Paginator";
import { number } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

storiesOf("components", module).add("Paginator", () => {
  const page = number("page", 2);
  const total = number("total", 10);
  const pageSize = number("pageSize", 3);
  return (
    <Paginator
      page={page}
      count={total}
      pageSize={pageSize}
      onChange={action("onChange")}
    />
  );
});
