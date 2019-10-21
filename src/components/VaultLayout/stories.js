/* eslint-disable react/prop-types */

import React, { useState } from "react";
import { createGlobalStyle } from "styled-components";
import { storiesOf } from "@storybook/react";
import { FaHome, FaList, FaUser, FaUsers } from "react-icons/fa";

import backendDecorator from "stories/backendDecorator";
import { NotifComponent } from "containers/Admin/Dashboard/PendingBadge";
import VaultLayout from "components/VaultLayout";
import Modal from "components/base/Modal";
import Box from "components/base/Box";
import { AccountsSearch } from "components/DataSearch/stories";

const fakeUser = {
  username: "User1",
};

const mockMatch = {
  params: {},
};

const GlobalStyle = createGlobalStyle`
  body {
    padding: 0;
  }
`;

const PendingBadge = () => <NotifComponent>5</NotifComponent>;

storiesOf("components/base", module)
  .addDecorator(backendDecorator([]))
  .add("VaultLayout", () => <Wrapper />);

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
          label: "All requests",
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
      <>
        <GlobalStyle />
        <VaultLayout menuItems={items} user={fakeUser} match={mockMatch}>
          <FakeModal />
          <AccountsSearch />
        </VaultLayout>
      </>
    );
  }
}

function FakeModal() {
  const [isOpened, setOpened] = useState(false);
  return (
    <div>
      <button onClick={() => setOpened(!isOpened)}>open modal</button>
      <Modal isOpened={isOpened} onClose={() => setOpened(false)}>
        <Box p={40}>I am the modal content</Box>
      </Modal>
    </div>
  );
}
