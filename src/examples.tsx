import { useCallback, useEffect, useState, useMemo } from "react";
import { nanoid } from "nanoid";
/* import groupBy from "lodash.groupby"; */
import {
  Action,
  ActionPanel,
  List,
  Color,
  LocalStorage,
  getPreferenceValues,
  environment,
} from "@raycast/api";
/* import TypeDropdown from "./components/CategoryDropdown"; */
import { Example } from "./types";
import {
  CreateExampleAction,
  EditExampleAction,
  DeleteExampleAction,
  EmptyView,
} from "./components";

type Filter = "All" | string;

interface Preferences {
  action: string;
}

type State = {
  isLoading: boolean;
  searchText: string;
  examples: Example[];
  visibleExamples: Example[];
};

interface Category {
  category: string;
  id: number;
}

interface Formula {
  name: string;
  id: number;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [showingDetail] = useState(true);
  const [state, setState] = useState<State>({
    isLoading: true,
    searchText: environment.launchContext
      ? environment.launchContext.exampleSearch
      : "",
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
        setState((previous) => ({
          ...previous,
          examples: [],
          isLoading: false,
        }));
      }
    })();
  }, []);

  useEffect(() => {
    LocalStorage.setItem("examples", JSON.stringify(state.examples));
  }, [state.examples]);

  const handleCreate = useCallback(
    (
      title: string,
      example: string,
      categories: string[],
      formulas: string[],
    ) => {
      setState((currentState) => {
        const newExamples = [
          ...currentState.examples,
          {
            id: nanoid(),
            title,
            example,
            categories,
            formulas,
            lastEdited: new Date().toISOString(),
          },
        ];
        return { ...currentState, examples: newExamples, searchText: "" };
      });
    },
    [],
  );

  const handleEdit = useCallback(
    (
      id: string,
      title: string,
      example: string,
      categories: string[],
      formulas: string[],
    ) => {
      setState((currentState) => {
        const newExamples = [...currentState.examples];
        const exampleIndex = newExamples.findIndex(
          (example) => example.id === id,
        );
        if (exampleIndex !== -1) {
          newExamples[exampleIndex] = {
            ...newExamples[exampleIndex],
            title,
            example,
            categories,
            formulas,
            lastEdited: new Date().toISOString(),
          };
          return { ...currentState, examples: newExamples };
        }
        return currentState;
      });
    },
    [],
  );

  const handleDelete = useCallback((id: string) => {
    setState((currentState) => {
      const newExamples = [...currentState.examples];
      const exampleIndex = newExamples.findIndex(
        (example) => example.id === id,
      );
      if (exampleIndex !== -1) {
        newExamples.splice(exampleIndex, 1);
        return { ...currentState, examples: newExamples };
      }
      return currentState;
    });
  }, []);

  const Examples = useCallback(() => {
    return [...state.examples].sort((a, b) => a.title.localeCompare(b.title));
  }, [state.examples]);

  const [filter, setFilter] = useState<Filter>("All");

  function groupByCategory(examples: Example[]) {
    return examples.reduce(
      (grouped, example) => {
        example.categories.forEach((category) => {
          if (grouped[category]) {
            grouped[category].push(example);
          } else {
            grouped[category] = [example];
          }
        });
        return grouped;
      },
      {} as Record<string, Example[]>,
    );
  }

  const groupedExamples = useMemo(
    () => groupByCategory(state.examples),
    [state.examples],
  );

  const uniqueCategories: string[] = useMemo(() => {
    const allCategories = state.examples.flatMap((ex) => ex.categories);
    return Array.from(new Set(allCategories));
  }, [state.examples]);

  return (
    <List
      isLoading={state.isLoading}
      searchBarPlaceholder="Search examples"
      searchText={state.searchText}
      isShowingDetail={showingDetail}
      filtering
      onSearchTextChange={(newValue) => {
        setState((previous) => ({ ...previous, searchText: newValue }));
      }}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Category"
          value={filter}
          onChange={setFilter}
        >
          <List.Dropdown.Item
            title="All"
            value="All"
            icon={{
              source: "types/all.svg",
              tintColor: { light: "#aaa", dark: "#888", adjustContrast: false },
            }}
          />
          <List.Dropdown.Section>
            {uniqueCategories.map((category) => (
              <List.Dropdown.Item
                key={category}
                title={category}
                value={category}
                icon={{
                  source: `categories/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}.svg`,
                  tintColor: {
                    light: "#aaa",
                    dark: "#888",
                    adjustContrast: false,
                  },
                }}
              />
            ))}
          </List.Dropdown.Section>
        </List.Dropdown>
      }
    >
      <EmptyView
        examples={Examples()}
        searchText={state.searchText}
        onCreate={handleCreate}
      />
      {Object.entries(groupedExamples).map(
        ([category, examples]) =>
          (filter === "All" || filter === category) && (
            <List.Section key={category} title={category}>
              {examples.map((example) => (
                <List.Item
                  key={example.id}
                  icon={{
                    source: example.example ? "file-content.svg" : "file.svg",
                    tintColor: { light: "#aaa", dark: "#888" },
                  }}
                  title={example.title ? example.title : example.example}
                  keywords={[
                    example.title,
                    example.example,
                    ...(example.categories || []),
                    ...(example.formulas || []),
                  ]}
                  detail={
                    <List.Item.Detail
                      markdown={
                        example.example
                          ? "```js\n" +
                            `${example.example}` +
                            "\n```\n" +
                            example.formulas
                              .map((formula) => `\`${formula}\``)
                              .join(" ")
                          : "No example set!"
                      }
                    />
                  }
                  actions={
                    <ActionPanel>
                      <ActionPanel.Section>
                        {example.example && (
                          <>
                            <Action.Paste
                              content={example.example}
                              key="paste"
                              icon={{
                                source: "paste.svg",
                                tintColor: {
                                  light: Color.Magenta,
                                  dark: Color.Magenta,
                                },
                              }}
                              title="Paste Example"
                            />
                            <Action.CopyToClipboard
                              key="copy"
                              content={example.example}
                              icon={{
                                source: "copy.svg",
                                tintColor: {
                                  light: Color.Orange,
                                  dark: Color.Orange,
                                },
                              }}
                              title="Copy Example"
                              shortcut={{ modifiers: ["cmd"], key: "c" }}
                            />
                          </>
                        )}
                        <EditExampleAction
                          id={example.id}
                          defaultTitle={example.title}
                          defaultExample={example.example}
                          defaultCategories={example.categories}
                          defaultFormulas={example.formulas}
                          onEdit={(id, title, example, categories, formulas) =>
                            handleEdit(id, title, example, categories, formulas)
                          }
                        />
                        <Action.CreateSnippet
                          title="Create Snippet"
                          icon={{
                            source: "text-plus.svg",
                            tintColor: {
                              light: Color.SecondaryText,
                              dark: Color.SecondaryText,
                            },
                          }}
                          snippet={{
                            name: example.title,
                            text: example.example,
                          }}
                          shortcut={{ modifiers: ["cmd"], key: "s" }}
                        />
                        <DeleteExampleAction
                          onDelete={() => handleDelete(example.id)}
                        />
                      </ActionPanel.Section>
                      <CreateExampleAction
                        onCreate={(title, example, categories, formulas) =>
                          handleCreate(title, example, categories, formulas)
                        }
                      />
                    </ActionPanel>
                  }
                />
              ))}
            </List.Section>
          ),
      )}
    </List>
  );
}
