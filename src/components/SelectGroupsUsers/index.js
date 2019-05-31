// @flow
import React, { PureComponent } from "react";
import Select from "components/base/Select";
import type { GroupedOption } from "components/base/Select";
import colors from "shared/colors";
import Disabled from "components/Disabled";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { OptionProps } from "react-select/src/types";
import type { User, Group } from "data/types";
import { components } from "react-select";
import { FaUser, FaUsers } from "react-icons/fa";
import { MdClear, MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

type MemberItem = {
  value: User,
  type: "member",
};

type GroupItem = {
  value: Group,
  type: "group",
};

const ICON_SIZE = 15;

export type Item = MemberItem | GroupItem;
// we have to use an extra `data` field here because we use react-select in multi mode
// and it uses the value to compute the `key`. Value cannot be an object
type Option = {
  value: string,
  data: Item,
  label: string,
};

type Props = {
  groups: Group[],
  members: User[],
  dataTest?: string,
  value: {
    members?: User[],
    groups?: Group[],
  },
  onChange: ({ members: User[], groups: Group[] }) => void,
};

const checkedIcon = <MdCheckBox size={ICON_SIZE} />;
const uncheckedIcon = <MdCheckBoxOutlineBlank size={ICON_SIZE} />;
const groupIcon = <FaUsers size={ICON_SIZE} />;
const userIcon = <FaUser size={ICON_SIZE} />;
const clearIcon = <MdClear size={ICON_SIZE} />;

const CheckboxItem = props => (props.isSelected ? checkedIcon : uncheckedIcon);
const buildOptions = (items: Item[]): Option[] =>
  items.map(item => ({
    label: item.type === "group" ? item.value.name : item.value.username,
    value: `${item.type}_${item.value.id}`,
    data: item,
  }));

const OptionComponent = (props: OptionProps) => {
  const { selectProps, data } = props;
  const renderDisabled =
    selectProps.renderIfDisabled &&
    selectProps.renderIfDisabled(data.data.value);

  return (
    <Disabled disabled={!!renderDisabled}>
      <components.Option {...props}>
        <Box horizontal align="center" flow={10} py={5}>
          <CheckboxItem {...props} />
          <Text>{props.data.label}</Text>
          {renderDisabled}
        </Box>
      </components.Option>
    </Disabled>
  );
};

const MultiValueRemove = (props: OptionProps) => (
  <components.MultiValueRemove {...props}>
    {clearIcon}
  </components.MultiValueRemove>
);
const MultiValueLabel = (props: OptionProps) => (
  <Box horizontal align="center" pl={10}>
    {props.data.data.type === "group" ? groupIcon : userIcon}
    <components.MultiValueContainer {...props} />
  </Box>
);

const customComponents = {
  Option: OptionComponent,
  MultiValueLabel,
  MultiValueRemove,
};

const colourStyles = {
  multiValueRemove: styles => ({
    ...styles,
    ":hover": {
      backgroundColor: colors.steel,
      color: "white",
    },
  }),
};
class SelectInGroup extends PureComponent<Props> {
  static defaultProps = {
    groups: [],
  };

  handleChange = (option: Option[]) => {
    const { onChange } = this.props;
    if (!option) return onChange({ members: [], groups: [] });

    // $FlowFixMe : why does flow complain ?
    const groups: Group[] = option
      .filter((o: Option) => o.data.type === "group")
      .map((o: Option) => o.data.value);

    // $FlowFixMe : why does flow complain ?
    const members: User[] = option
      .filter((o: Option) => o.data.type === "member")
      .map((o: Option) => o.data.value);

    onChange({ members, groups });
  };

  render() {
    const { members, groups, value, dataTest, ...props } = this.props;
    const membersOptions = buildOptions(
      members.map(m => ({ type: "member", value: m })),
    );
    const groupOptions = buildOptions(
      groups.map(g => ({ type: "group", value: g })),
    );
    const resolvedGroupsValue = value.groups
      ? value.groups.map(g =>
          groupOptions.find(gO => gO.data.value.id === g.id),
        )
      : [];
    const resolvedMembersValue = value.members
      ? value.members.map(m =>
          membersOptions.find(mO => mO.data.value.id === m.id),
        )
      : [];
    const resolvedValue = [...resolvedGroupsValue, ...resolvedMembersValue];

    const groupedOptions: GroupedOption[] = [
      { label: "groups", options: groupOptions },
      { label: "users", options: membersOptions },
    ];

    return (
      <Select
        inputId="input_groups_users"
        components={customComponents}
        styles={colourStyles}
        value={resolvedValue}
        closeMenuOnSelect={false}
        options={groupedOptions}
        isMulti
        hideSelectedOptions={false}
        {...props}
        onChange={this.handleChange}
      />
    );
  }
}

export default SelectInGroup;
