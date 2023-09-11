import { Grid, List } from "@raycast/api";

const categories = [
  "Conditional",
  "Logical",
];

export default function TypeDropdown(props: {
  type?: string;
  command: string;
  onSelectType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const DropdownComponent =
    props.type === "grid" ? Grid.Dropdown : List.Dropdown;

  return (
    <DropdownComponent
      tooltip={`${props.command} Type Filter`}
      onChange={props.onSelectType}
    >
      <DropdownComponent.Item
        key="all"
        value="all"
        title="All Types"
        icon={{ source: "types/all.svg", tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
      />
      <DropdownComponent.Section>
        {categories.map((category) => {
          return (
            <DropdownComponent.Item
              key={category}
              value={category}
              title={category}
              icon={{ source:`categories/${category.toLowerCase().replace(/ /g, "-")}.svg`, tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
            />
          );
        })}
      </DropdownComponent.Section>
    </DropdownComponent>
  );
}
