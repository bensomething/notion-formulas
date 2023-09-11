import { useCallback, useEffect, useState, useMemo } from "react";
import { nanoid } from "nanoid";
import groupBy from "lodash.groupby";
import { Action, ActionPanel, List, Color, LocalStorage, getPreferenceValues, environment, LaunchProps } from "@raycast/api";
import { Filter, Example } from "./types";
import { CreateExampleAction, EditExampleAction, DeleteExampleAction, EmptyView } from "./components";

interface Preferences {
  action: string;
}

type State = {
  filter: Filter;
  isLoading: boolean;
  searchText: string;
  examples: Example[];
  visibleExamples: Example[];
};

export default function Command(props: LaunchProps) {
  const preferences = getPreferenceValues<Preferences>();
  const [showingDetail, setShowingDetail] = useState(true);
  const [state, setState] = useState<State>({
    filter: Filter.All,
    isLoading: true,
    searchText: environment.launchContext ? environment.launchContext.exampleSearch : "",
    examples: [],
    visibleExamples: [],
  });

  useEffect(() => {
    (async () => {
      const storedExamples = await LocalStorage.getItem<string>("examples");

      if (!storedExamples) {
        setState((previous) => ({ ...previous, isLoading: false }));
        return;
      }

      try {
        const examples: Example[] = JSON.parse(storedExamples);
        setState((previous) => ({ ...previous, examples, isLoading: false }));
      } catch (e) {
        setState((previous) => ({ ...previous, examples: [], isLoading: false }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("examples", JSON.stringify(state.examples));
  }, [state.examples]);

  const handleCreate = useCallback(
    (title: string, example: string, categories: string[]) => {
      const newExamples = [...state.examples, { id: nanoid(), title, example, categories }];
      setState((previous) => ({ ...previous, examples: newExamples, filter: Filter.All, searchText: "" }));
    },
    [state.examples, setState]
);

const handleEdit = useCallback(
  (index: number, title: string, example: string, categories: string[]) => { 
    const newExamples = [...state.examples];
    newExamples[index] = { ...newExamples[index], title, example, categories };
    setState((previous) => ({ ...previous, examples: newExamples }));
  },
  [state.examples, setState]
);

  const handleDelete = useCallback(
    (index: number) => {
      const newExamples = [...state.examples];
      newExamples.splice(index, 1);
      setState((previous) => ({ ...previous, examples: newExamples }));
    },
    [state.examples, setState]
  );

  const filterExamples = useCallback(() => {
/*     if (state.filter === Filter.Open) {
      return state.examples.filter((example) => !example.isCompleted);
    }
    if (state.filter === Filter.Completed) {
      return state.examples.filter((example) => example.isCompleted);
    } */
    return state.examples;
  }, [state.examples, state.filter]);

  return (
    <List
      isLoading={state.isLoading}
      searchBarPlaceholder="Search examples"
      searchText={state.searchText}
      isShowingDetail={showingDetail}
      /* searchBarAccessory={
        <List.Dropdown
          tooltip="Select Category"
          value={state.filter}
          onChange={(newValue) => setState((previous) => ({ ...previous, filter: newValue as Filter }))}
        >
          <List.Dropdown.Item title="All" value={Filter.All} />
        </List.Dropdown>
      } */
      filtering
      onSearchTextChange={(newValue) => {
        setState((previous) => ({ ...previous, searchText: newValue }));
      }}
    >
      <EmptyView filter={state.filter} examples={filterExamples()} searchText={state.searchText} onCreate={handleCreate} />
      {filterExamples().map((example, index) => (
        <List.Item
          key={example.id}
          icon={{ source: example.example ? "file-content.svg" : "file.svg", tintColor: { light: "#aaa", dark: "#888" }, }}
          title={example.title}
          keywords={[example.title, example.example, ...(example.categories || [])]}
          detail={
            <List.Item.Detail
              markdown={example.example ? "```js\n" + `${example.example}` + "\n```" : "No example set!"}
            />
          }
          actions={
            <ActionPanel>
              <ActionPanel.Section>
                      <Action.Paste 
                          content={example.example} 
                          key="paste"
                          icon={{ source: "paste.svg", tintColor: { light: Color.Magenta, dark: Color.Magenta } }}
                          title="Paste Example"
                      />
                      <Action.CopyToClipboard 
                        key="copy"
                          content={example.example} 
                          icon={{ source: "copy.svg", tintColor: { light: Color.Orange, dark: Color.Orange }}}
                          title="Copy Example"
                          shortcut={{ modifiers: ["cmd"], key: "c" }}
                      />
                  <EditExampleAction 
                      defaultTitle={example.title} 
                      defaultExample={example.example} 
                      defaultCategories={example.categories} 
                      onEdit={(title, example, categories) => handleEdit(index, title, example, categories)} 
                  />
                  
                  <DeleteExampleAction onDelete={() => handleDelete(index)} />
              </ActionPanel.Section>
              <CreateExampleAction onCreate={(title, example, categories) => handleCreate(title, example, categories)} />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}