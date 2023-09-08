import { Action, ActionPanel, List, Detail, Color, Cache } from "@raycast/api";
import { useMemo, useState, useEffect } from "react";
import axios from 'axios';
import groupBy from "lodash.groupby";
import TypeDropdown from "./components/type_dropdown";
const LOCAL_FORMULAS = require('./data/formulas.json');
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
  link: string;
  new: string;
}

let cache: Formula[] | null = null;

export default function SearchFormulas() {
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showingDetail, setShowingDetail] = useState(true);
  const [type, setType] = useState<string>("all");
  console.log(process.env.NODE_ENV);
  useEffect(() => {
    const fetchData = async () => {
      setIsInitialLoad(true);
      setIsLoading(true);

      try {
        let data;
        
        if (process.env.NODE_ENV === 'development') {
          data = LOCAL_FORMULAS
        } else {
          const response = await axios.get('https://raw.githubusercontent.com/bensomething/formulas/main/formulas.json');
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

  const listing = useMemo(() => {
    return type !== "all"
      ? formulas.filter((p) => p.type.includes(type))
      : formulas;
  }, [type, formulas]);

  if (listing.length === 0 && !isInitialLoad) {
    return (
      <List isLoading={isLoading}>
        <List.Item
          title="No Results"
        />
      </List>
    );
  }

  return (
    <List
      isLoading={isLoading || isInitialLoad}
      isShowingDetail={showingDetail}
      searchBarPlaceholder="Search formula components"
      searchBarAccessory={
        <TypeDropdown type="grid" command="Formulas" onSelectType={setType} />
      }
    >
      {Object.entries(groupBy(listing, "type")).map(
        ([type, formulaList]) => {
          return (
            <List.Section title={type} key={type}>
              {formulaList.map((formula) => {
                return (
                  <List.Item
                    key={formula.name}
                    icon={{ source: formula.iconReturns, tintColor: { light: "#aaa", dark: "#888" }, }}
                    title={formula.name}
                    keywords={[formula.name, formula.other]}
                    detail={
                      <List.Item.Detail 
                      markdown={"## " + formula.name + "\n" + formula.description + (formula.examples ? "\n```js\n" + formula.examples + "\n```" : "")}
                      metadata={
                        <Detail.Metadata>
                          <Detail.Metadata.Label 
                            title="Type" 
                            text={formula.type.slice(0,-1)}
                            icon={{ source:`types/${formula.type.toLowerCase()}.svg`, tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
                          />
                          <Detail.Metadata.Label 
                            title="Category" 
                            text={formula.category}
                            icon={{ source:`categories/${formula.category.toLowerCase()}.svg`, tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
                          />
                          <Detail.Metadata.Separator />
                          <Detail.Metadata.Label 
                            title={formula.name == "current" || formula.name == "index" ? "Works With" : "Accepts"} 
                            text={ formula.accepts ? formula.accepts : '' }
                            icon={{ source: formula.iconAccepts, tintColor: { light: "#aaa", dark: "#888" }, }}
                          />
                          <Detail.Metadata.Label
                            title="Returns"
                            text={ formula.returns ? formula.returns : '' }
                            icon={{ source: formula.iconReturns, tintColor: { light: "#aaa", dark: "#888" }, }}
                          />
                          <Detail.Metadata.Separator />
                          <Detail.Metadata.Link 
                            title="More" 
                            target={`https://bensomething.notion.site/${formula.link}`} 
                            text={formula.type == "Operators" && formula.other ? formula.other : formula.name} 
                          />
                        </Detail.Metadata>
                        }
                    />
                    }
                    actions={
                      <ActionPanel>
                        <Action.Paste icon="paste.svg" title="Paste Example" content={formula.exampleBasic} />
                        {/* <Action.Push icon="detail.svg" title="Open Detail" target={<FormulaDetail id={formula.id} />} /> */}
                        <Action.OpenInBrowser icon="browser.svg" title={`More in Browser`} /* shortcut={{ modifiers: ["cmd"], key: "o" }} */ url={`https://bensomething.notion.site/${formula.link}`} />
                      </ActionPanel>
                    }
                    accessories={[
                      { text: formula.other, tooltip:formula.other.includes("G") || formula.other.includes("L") ? "" : formula.type == 'Functions' ? "Operator version" : "Function version"},
                      { text: formula.new ? { color: Color.Yellow, value: '•' } : "", tooltip:"New in 2.0"}
                    ]}
                  />
                );
              })}
            </List.Section>
          );
        }
      )}
    </List>
  );
}
