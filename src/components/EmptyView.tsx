import { ActionPanel, List } from "@raycast/api";
import { Example } from "../types";
import CreateExampleAction from "./CreateExampleAction";

function EmptyView(props: {
  examples: Example[];
  searchText: string;
  onCreate: (
    title: string,
    example: string,
    categories: string[],
    formulas: string[],
  ) => void;
}) {
  if (props.examples.length > 0) {
    return (
      <List.EmptyView
        icon="file-x.svg"
        title="No matching examples found"
        description={`Can't find an example matching \\"${props.searchText}\\". Press Enter to create a new example!`}
        actions={
          <ActionPanel>
            <CreateExampleAction
              /* defaultTitle={props.searchText} */ defaultTitle="New Example"
              onCreate={(title, example, categories, formulas) =>
                props.onCreate(title, example, categories, formulas)
              }
            />
          </ActionPanel>
        }
      />
    );
  }

  return (
    <List.EmptyView
      icon="file-x.svg"
      title="No examples found"
      description="You don't have any examples yet. Press Enter to create one!"
      actions={
        <ActionPanel>
          <CreateExampleAction
            defaultTitle="New Example"
            onCreate={(title, example, categories, formulas) =>
              props.onCreate(title, example, categories, formulas)
            }
          />
        </ActionPanel>
      }
    />
  );
}
export default EmptyView;
