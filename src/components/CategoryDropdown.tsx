import { Grid, List } from "@raycast/api";

const types = ["Functions", "Operators", "Booleans", "Variables"];

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
        icon={{
          source: "types/all.svg",
          tintColor: { light: "#aaa", dark: "#888", adjustContrast: false },
        }}
      />
      <DropdownComponent.Section>
        {types.map((type) => {
          return (
            <DropdownComponent.Item
              key={type}
              value={type}
              title={type}
              icon={{
                source: `types/${type.toLowerCase().replace(/ /g, "-")}.svg`,
                tintColor: {
                  light: "#aaa",
                  dark: "#888",
                  adjustContrast: false,
                },
              }}
            />
          );
        })}
      </DropdownComponent.Section>
      {/* <DropdownComponent.Item
        key="two"
        value="two"
        title="New in 2.0"
        icon={{ source: "types/new-in-2.0.svg", tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
      /> */}
    </DropdownComponent>
  );
}
