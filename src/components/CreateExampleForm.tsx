import { useCallback } from "react";
import { Form, Action, ActionPanel, useNavigation, Color } from "@raycast/api";
import formulas from "../data/formulas.json";

function CreateExampleForm(props: {
  defaultTitle?: string;
  onCreate: (
    title: string,
    example: string,
    categories: string[],
    formulas: string[],
  ) => void;
}) {
  const { onCreate, defaultTitle = "" } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: {
      title: string;
      example: string;
      categories: string[];
      formulas: string[];
    }) => {
      onCreate(
        values.title,
        values.example,
        values.categories,
        values.formulas,
      );
      pop();
    },
    [onCreate, pop],
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Example"
            icon={{
              source: "variable-plus.svg",
              tintColor: { light: Color.Green, dark: Color.Green },
            }}
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        placeholder="New Example"
        defaultValue={defaultTitle}
        title="Title"
      />
      <Form.TextArea id="example" title="Example" placeholder="if(..." />
      <Form.Separator />
      <Form.TagPicker
        id="categories"
        title="Categories"
        placeholder="Add categories..."
      >
        {formulas.map((category) => (
          <Form.TagPicker.Item
            key={`${category.category.toLowerCase()}-${category.id}`}
            value={category.category}
            title={category.category}
            icon={{
              source: `categories/${category.category
                .toLowerCase()
                .replace(/\s+/g, "-")}.svg`,
              tintColor: { light: "#aaa", dark: "#888", adjustContrast: false },
            }}
          />
        ))}
      </Form.TagPicker>
      <Form.TagPicker
        id="formulas"
        title="Components"
        placeholder="Add components..."
      >
        {formulas.map((formula) => (
          <Form.TagPicker.Item
            key={`${formula.name.toLowerCase()}-${formula.id}`}
            value={formula.name}
            title={formula.name}
            icon={{
              source: formula.iconReturns,
              tintColor: { light: "#aaa", dark: "#888" },
            }}
          />
        ))}
      </Form.TagPicker>
    </Form>
  );
}

export default CreateExampleForm;
