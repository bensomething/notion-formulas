import {
  Action,
  ActionPanel,
  List,
  Detail,
  Color,
  getPreferenceValues,
  launchCommand,
  LaunchType,
} from "@raycast/api";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
import groupBy from "lodash.groupby";
import TypeDropdown from "./components/TypeDropdown";
import LocalFormulas from "./data/formulas.json";
/* import FormulaDetail from "./components/detail"; */

interface Formula {
  name: string;
  id: number;
  type: string;
  description: string;
  category: string;
  accepts: string;
  returns: string;
  iconAccepts: string;
  iconReturns: string;
  other: string;
  examples: string;
  exampleBasic: string;
  exampleBasicDot: string;
  linkNotion: string;
  new: string;
}

interface Preferences {
  new: boolean;
  notation: string;
}

let cache: Formula[] | null = null;

export default function SearchFormulas() {
  const preferences = getPreferenceValues<Preferences>();
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showingDetail, setShowingDetail] = useState(true);
  /* const [searchText, setSearchText] = useState(""); */
  const [type, setType] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoad(true);
      setIsLoading(true);

      try {
        let data;

        if (process.env.NODE_ENV === "development") {
          data = LocalFormulas;
        } else {
          const response = await axios.get(
            "https://raw.githubusercontent.com/bensomething/notion-formulas/main/src/data/formulas.json",
          );
          data = response.data;
        }

        cache = data;
        setFormulas(data);
        setIsInitialLoad(false);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupedListing = useMemo(() => {
    const list =
      type !== "all" ? formulas.filter((p) => p.type.includes(type)) : formulas;
    return groupBy(list, type !== "all" ? "category" : "type");
  }, [type, formulas]);

  if (Object.keys(groupedListing).length === 0 && !isInitialLoad) {
    return (
      <List isLoading={isLoading}>
        <List.Item title="No Results" />
      </List>
    );
  }

  return (
    <List
      isLoading={isLoading || isInitialLoad}
      isShowingDetail={showingDetail}
      searchBarPlaceholder={`Search ${
        type === "all" ? "formulas" : type.toLowerCase()
      }`}
      searchBarAccessory={
        <TypeDropdown type="list" command="Formulas" onSelectType={setType} />
      }
      /* onSearchTextChange={setSearchText} */
    >
      {Object.entries(groupedListing).map(([key, formulaList]) => {
        return (
          <List.Section
            title={key}
            /* subtitle={`${searchText ? '' : ` ${formulaList.length}`}`} */ key={
              key
            }
          >
            {formulaList.map((formula) => {
              return (
                <List.Item
                  key={formula.name}
                  icon={
                    formula.name == "false"
                      ? {
                          source: "false.svg",
                          tintColor: { light: "#aaa", dark: "#888" },
                        }
                      : {
                          source: formula.iconReturns,
                          tintColor: { light: "#aaa", dark: "#888" },
                        }
                  }
                  title={formula.name}
                  keywords={[
                    formula.name,
                    formula.other,
                    formula.category,
                    key,
                  ]}
                  /* quickLook={{ path: `${formula.name}.txt`, name: `${formula.name}` }} */
                  detail={
                    <List.Item.Detail
                      markdown={
                        "## " +
                        formula.name +
                        "\n" +
                        formula.description +
                        (formula.examples
                          ? "\n```js\n" + formula.examples + "\n```"
                          : "")
                      }
                      metadata={
                        <Detail.Metadata>
                          <Detail.Metadata.Label
                            title="Type"
                            text={formula.type.slice(0, -1)}
                            icon={{
                              source: `types/${formula.type.toLowerCase()}.svg`,
                              tintColor: {
                                light: "#aaa",
                                dark: "#888",
                                adjustContrast: false,
                              },
                            }}
                          />
                          <Detail.Metadata.Label
                            title="Category"
                            text={formula.category}
                            icon={{
                              source: `categories/${formula.category.toLowerCase()}.svg`,
                              tintColor: {
                                light: "#aaa",
                                dark: "#888",
                                adjustContrast: false,
                              },
                            }}
                          />
                          <Detail.Metadata.Separator />
                          <Detail.Metadata.Label
                            title={
                              formula.name == "current" ||
                              formula.name == "index"
                                ? "Works With"
                                : "Accepts"
                            }
                            text={formula.accepts ? formula.accepts : ""}
                            icon={{
                              source: formula.iconAccepts,
                              tintColor: { light: "#aaa", dark: "#888" },
                            }}
                          />
                          <Detail.Metadata.Label
                            title="Returns"
                            text={formula.returns ? formula.returns : ""}
                            icon={{
                              source: formula.iconReturns,
                              tintColor: { light: "#aaa", dark: "#888" },
                            }}
                          />
                          <Detail.Metadata.Separator />
                          <Detail.Metadata.Link
                            title="More"
                            target={`https://bensomething.notion.site/${formula.linkNotion}`}
                            text={
                              formula.type == "Operators" && formula.other
                                ? formula.other
                                : formula.name
                            }
                          />
                        </Detail.Metadata>
                      }
                    />
                  }
                  actions={
                    <ActionPanel>
                      {formula.exampleBasic && (
                        <Action.Paste
                          icon={{
                            source: "paste.svg",
                            tintColor: {
                              light: Color.Magenta,
                              dark: Color.Magenta,
                            },
                          }}
                          title="Paste Basic Example"
                          content={
                            preferences.notation === "regular"
                              ? formula.exampleBasic
                              : formula.exampleBasicDot
                          }
                        />
                      )}
                      {/* <Action.ToggleQuickLook shortcut={{ modifiers: ["cmd"], key: "y" }} />
                         <Action.Push icon="detail.svg" title="Open Detail" target={<FormulaDetail id={formula.id} />} /> */}
                      <Action
                        icon={{
                          source: "examples.svg",
                          tintColor: {
                            light: Color.SecondaryText,
                            dark: Color.SecondaryText,
                          },
                        }}
                        title={`Search '${formula.name}' Examples`}
                        onAction={() =>
                          launchCommand({
                            name: "examples",
                            type: LaunchType.UserInitiated,
                            context: { exampleSearch: formula.name },
                          })
                        }
                        shortcut={{ modifiers: ["cmd"], key: "e" }}
                      />
                      {formula.linkNotion && (
                        <Action.OpenInBrowser
                          icon={{
                            source: "browser.svg",
                            tintColor: {
                              light: Color.Orange,
                              dark: Color.Orange,
                            },
                          }}
                          title={`More in Browser`}
                          shortcut={{ modifiers: ["cmd"], key: "o" }}
                          url={`https://bensomething.notion.site/${formula.linkNotion}`}
                        />
                      )}
                    </ActionPanel>
                  }
                  accessories={[
                    {
                      text: formula.other,
                      tooltip:
                        formula.other.includes("G") ||
                        formula.other.includes("L")
                          ? ""
                          : formula.type == "Functions"
                          ? "Operator version"
                          : "Function version",
                    },
                    preferences.new
                      ? {
                          text: formula.new
                            ? { color: Color.Yellow, value: "•" }
                            : "",
                          tooltip: "New in 2.0",
                        }
                      : {},
                  ]}
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
