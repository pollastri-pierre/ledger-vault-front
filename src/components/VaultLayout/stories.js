/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import { FaHome, FaList, FaUser, FaUsers } from "react-icons/fa";

import RestlayProvider from "restlay/RestlayProvider";
import { NotifComponent } from "containers/Admin/Dashboard/PendingBadge";
import VaultLayout from "components/VaultLayout";
import { AccountsSearch, mockNetwork } from "components/DataSearch/stories";
import { BreadcrumbExample } from "components/base/Breadcrumb/stories";

const fakeUser = {
  username: "User1",
};

const mockMatch = {
  params: {},
};

const PendingBadge = () => <NotifComponent>5</NotifComponent>;

storiesOf("components/base", module).add("VaultLayout", () => <Wrapper />);

class Wrapper extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [
        {
          key: "dashboard",
          label: "Dashboard",
          Icon: FaHome,
          isActive: false,
          onClick: this.onClick("dashboard"),
          NotifComponent: PendingBadge,
        },
        {
          key: "tasks",
          label: "Admin tasks",
          Icon: FaList,
          isActive: true,
          onClick: this.onClick("tasks"),
        },
        {
          key: "groups",
          label: "Groups",
          Icon: FaUsers,
          isActive: false,
          onClick: this.onClick("groups"),
        },
        {
          key: "users",
          label: "Users",
          Icon: FaUser,
          isActive: false,
          onClick: this.onClick("users"),
        },
      ],
    };
  }

  onClick = key => () => {
    this.setState(({ items }) => ({
      items: items.map(item => {
        if (item.key !== key) {
          if (item.isActive) {
            return { ...item, isActive: false };
          }
          return item;
        }
        if (!item.isActive) {
          return { ...item, isActive: true };
        }
        return item;
      }),
    }));
  };

  render() {
    const { items } = this.state;
    return (
      <RestlayProvider network={mockNetwork}>
        <VaultLayout
          menuItems={items}
          user={fakeUser}
          match={mockMatch}
          BreadcrumbComponent={BreadcrumbExample}
        >
          <AccountsSearch />
        </VaultLayout>
      </RestlayProvider>
    );
  }
}
