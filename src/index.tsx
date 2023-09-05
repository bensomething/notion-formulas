import { useState } from "react";
import { Action, ActionPanel, List, Detail, Icon, Color, getSelectedText, Clipboard, showToast, Toast } from "@raycast/api";
import documentation from "./formulas";

/* type FormulaType = { id: string; name: string };

function FormulaDropdown(props: { FormulaTypes: FormulaType[]; onFormulaTypeChange: (newValue: string) => void }) {
  const { FormulaTypes, onFormulaTypeChange } = props;
  return (
    <List.Dropdown
      tooltip="Select Formula Type"
      storeValue={true}
      onChange={(newValue) => {
        onFormulaTypeChange(newValue);
      }}
    >
      <List.Dropdown.Section>
        {FormulaTypes.map((FormulaType) => (
          <List.Dropdown.Item key={FormulaType.id} title={FormulaType.name} value={FormulaType.id} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
} */
export default function SearchDocumentation() {
/*   const FormulaTypes: FormulaType[] = [
    { id: "1", name: "Operators" },
    { id: "2", name: "Functions" },
    { id: "3", name: "Booleans" },
    { id: "4", name: "Variables" },
  ];
  const onFormulaTypeChange = (newValue: string) => {
    console.log(newValue);
  }; */
  const [showingDetail, setShowingDetail] = useState(true);

  return (
    <List 
      isShowingDetail={showingDetail}
      searchBarPlaceholder="Search functions, operators, and more"
      /* searchBarAccessory={<FormulaDropdown FormulaTypes={FormulaTypes} onFormulaTypeChange={onFormulaTypeChange} />} */
      >
      {Object.entries(documentation).map(([section, items]) => (
        <List.Section title={section} key={section}>
          {items.map((item) => (
            <List.Item
              key={item.name}
              title={item.name}
              icon={{ source: item.icon, tintColor: {
                light: "#aaa",
                dark: "#777",
                adjustContrast: false,
                }, }}
              keywords={[item.name, section, item.other]}
              detail={
                <List.Item.Detail 
                  markdown={item.description}
                  metadata={
                    <Detail.Metadata>
                      <Detail.Metadata.Label title="Type" text={section.slice(0,-1)} />
                      <Detail.Metadata.Separator />
                      {/* <Detail.Metadata.Label title={`${item.altVersionLabel ? item.altVersionLabel : 'Alt. Version'}`} text={item.altVersion} />
                      <Detail.Metadata.Separator /> */}
                      <Detail.Metadata.Label title="Accepts" text={item.accepts} />
                      <Detail.Metadata.Separator />
                      <Detail.Metadata.Label title="Returns" text={item.returns} />
                      <Detail.Metadata.Separator />
                      <Detail.Metadata.Link title="More" target={`https://bensomething.notion.site/${item.more}`} text={section == "Operators" && item.other ? item.other : item.name} />
                    </Detail.Metadata>
                    }
                />
              }
              actions={
                <ActionPanel>
                  {/* <Action.Push title="More Examples" target={
                    <List>
                      <List.Item 
                      title="Yeah"
                      ></List.Item>
                    </List>
                  } /> */}
                  <Action.Paste title="Paste Basic Example" content={item.exampleBasic} />
                  <Action.Paste title="Paste Complex Example" content={item.exampleComplex} />
                  <Action.OpenInBrowser title="More Examples in Browser" url={`https://bensomething.notion.site/${item.more}`} shortcut={{ modifiers: ["cmd"], key: "o" }} />
                </ActionPanel>
              }
              accessories={[
                { text: item.other}
              ]}
            />
          ))}
        </List.Section>
      ))}
    </List>
  );
}
