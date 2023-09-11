import { Action, Color } from "@raycast/api";
import { Example } from "../types";
import CreateExampleForm from "./CreateExampleForm";

function CreateExampleAction(props: { defaultTitle?: string; onCreate: (title: string, example: string, categories: string[]) => void }) {
  return (
    <Action.Push
    icon={{ source: "pencil-plus.svg", tintColor: { light: Color.Green, dark: Color.Green }, }}
      title="Create New Example"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={<CreateExampleForm defaultTitle={props.defaultTitle} onCreate={(title, example, categories) => props.onCreate(title, example, categories)} />}
    />
  );
}

export default CreateExampleAction;