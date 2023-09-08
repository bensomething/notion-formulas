import { Action, ActionPanel, Detail } from "@raycast/api";
import { useMemo } from "react";

import formulas from "../data/formulas.json";

export default function FormulaDetail(props: { id?: number }) {
    const { id } = props;

    const formula = useMemo(() => {
        return formulas.find((entry) => entry.id === id);
    }, [id]);

    if (!formula) {
        return null; // or render a fallback component indicating the formula is not found
      }
    return (

        <Detail 
            navigationTitle={formula.name + " · Formulas 2.0"}
            markdown={"## " + formula.name + "\n" + formula.description + (formula.examples ? "\n```js\n" + formula.examples + "\n```" : "")}
            metadata={
                <Detail.Metadata>
                          <Detail.Metadata.Label 
                            title="Type" 
                            text={formula.type.slice(0,-1)}
                            icon={{ source:`types/${formula.type.toLowerCase()}.svg`, tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }}
                          />
                          <Detail.Metadata.Separator />
                          <Detail.Metadata.Label 
                            title="Category" 
                            text={formula.category}
                            /* icon={{ source:`categories/${formula.category.toLowerCase()}.svg`, tintColor: { light: "#aaa", dark: "#888", adjustContrast:  false, }, }} */
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
            actions = {
                <ActionPanel>
                <Action.Paste icon="paste.svg" title="Paste Example" content={formula.name} />
                <Action.OpenInBrowser icon="browser.svg" title="More Examples" url={`https://bensomething.notion.site/${formula.name}`} shortcut={{ modifiers: ["cmd"], key: "o" }} />
                </ActionPanel>
            }
        />
    )
}