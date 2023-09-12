import { Action, Color } from "@raycast/api";
import CreateExampleForm from "./CreateExampleForm";

function CreateExampleAction(props: {
  defaultTitle?: string;
  onCreate: (
    title: string,
    example: string,
    categories: string[],
    formulas: string[],
  ) => void;
}) {
  return (
    <Action.Push
      icon={{
        source: "variable-plus.svg",
        tintColor: { light: Color.Green, dark: Color.Green },
      }}
      title="Create Example"
      shortcut={{ modifiers: ["cmd"], key: "n" }}
      target={
        <CreateExampleForm
          defaultTitle=""
          onCreate={(title, example, categories, formulas) =>
            props.onCreate(title, example, categories, formulas)
          }
        />
      }
    />
  );
}

export default CreateExampleAction;
