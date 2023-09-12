import { useCallback } from "react";
import {
  Form,
  Action,
  ActionPanel,
  useNavigation,
  clearSearchBar,
  Color,
} from "@raycast/api";
import formulas from "../data/formulas.json";

function EditExampleForm(props: {
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
  const {
    id,
    onEdit,
    defaultTitle = "",
    defaultExample = "",
    defaultCategories = [],
    defaultFormulas = [],
  } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: {
      title: string;
      example: string;
      categories: string[];
      formulas: string[];
    }) => {
      onEdit(
        id,
        values.title,
        values.example,
        values.categories,
        values.formulas,
      );
      clearSearchBar();
      pop();
    },
    [id, onEdit, pop],
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Update Example"
            onSubmit={handleSubmit}
            icon={{
              source: "update.svg",
              tintColor: { light: Color.Green, dark: Color.Green },
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="title"
        defaultValue={defaultTitle}
        placeholder="New Example"
        title="Title"
      />
      <Form.TextArea
        id="example"
        defaultValue={defaultExample}
        title="Example"
        placeholder="if(..."
      />
      <Form.Separator />
      <Form.TagPicker
        id="categories"
        title="Categories"
        defaultValue={defaultCategories}
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
        defaultValue={defaultFormulas}
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

export default EditExampleForm;
