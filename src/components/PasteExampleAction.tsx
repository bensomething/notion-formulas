import { Action, Icon } from "@raycast/api";

function PasteExampleAction(props: {
  defaultExample?: string;
  onPaste: (example: string) => void;
}) {
  return (
    <Action.Paste
      icon="pencil-plus.svg"
      title="Paste Example"
      shortcut={{ modifiers: ["cmd"], key: "p" }}
      content={props.defaultExample ? props.defaultExample : ""}
    />
  );
}

export default PasteExampleAction;
