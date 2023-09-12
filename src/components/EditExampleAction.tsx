import { Action, Color } from "@raycast/api";
import EditExampleForm from "./EditExampleForm";

function EditExampleAction(props: {
  id: string;
  defaultTitle?: string;
  defaultExample?: string;
  defaultCategories?: string[];
  defaultFormulas?: string[];
  onEdit: (
    id: string,
    title: string,
    example: string,
    categories: string[],
    formulas: string[],
  ) => void;
}) {
  return (
    <Action.Push
      icon={{
        source: "edit.svg",
        tintColor: { light: Color.Blue, dark: Color.Blue },
      }}
      title="Edit Example"
      shortcut={{ modifiers: ["cmd"], key: "e" }}
      target={
        <EditExampleForm
          id={props.id}
          defaultTitle={props.defaultTitle}
          defaultExample={props.defaultExample}
          defaultCategories={props.defaultCategories}
          defaultFormulas={props.defaultFormulas}
          onEdit={props.onEdit}
        />
      }
    />
  );
}

export default EditExampleAction;
