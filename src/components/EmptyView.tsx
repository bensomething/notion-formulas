import { ActionPanel, List } from "@raycast/api";
import { Filter, Example } from "../types";
import CreateExampleAction from "./CreateExampleAction";

function EmptyView(props: { examples: Example[]; filter: Filter; searchText: string; onCreate: (title: string, example: string, categories: string[]) => void }) {
  if (props.examples.length > 0) {
    return (
      <List.EmptyView
        icon="file-x.svg"
        title="No matching examples found"
        description={`Can't find an example matching \"${props.searchText}\".\nPress Enter to create it now!`}
        actions={
          <ActionPanel>
            <CreateExampleAction defaultTitle={props.searchText} onCreate={(title, example, categories) => props.onCreate(title, example, categories)} />
          </ActionPanel>
        }
      />
    );
  }
  switch (props.filter) {
    case Filter.All:
    default: {
      return (
        <List.EmptyView
          icon="file-x.svg"
          title="No examples found"
          description="You don't have any examples yet. Press Enter to create one!"
          actions={
            <ActionPanel>
              <CreateExampleAction defaultTitle={props.searchText} onCreate={(title, example, categories) => props.onCreate(title, example, categories)} />
            </ActionPanel>
          }
        />
      );
    }
  }
}
export default EmptyView;