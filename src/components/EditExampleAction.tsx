import { Action, Color } from "@raycast/api";
import { Example } from "../types";
import EditExampleForm from "./EditExampleForm";

function EditExampleAction(props: { defaultTitle?: string; defaultExample?: string; defaultCategories?: string[]; onEdit: (title: string, example: string, categories: string[]) => void }) {
  return (
    <Action.Push
    icon={{ source: "edit.svg", tintColor: { light: Color.Blue, dark: Color.Blue }, }}
      title="Edit Example"
      shortcut={{ modifiers: ["cmd"], key: "e" }}
      target={<EditExampleForm defaultTitle={props.defaultTitle} defaultExample={props.defaultExample} defaultCategories={props.defaultCategories} onEdit={props.onEdit} />}
    />
  );
}

export default EditExampleAction;