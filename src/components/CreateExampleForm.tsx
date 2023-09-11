import { useCallback } from "react";
import { Form, Action, ActionPanel, useNavigation } from "@raycast/api";
import categories from "../data/formulas.json";

function CreateExampleForm(props: { defaultTitle?: string; onCreate: (title: string, example: string, categories: string[]) => void }) {
  const { onCreate, defaultTitle = "" } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: { title: string, example: string, categories: string[] }) => { 
      onCreate(values.title, values.example, values.categories);
      pop();
    },
    [onCreate, pop]
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Example" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" defaultValue={defaultTitle} title="Title" />
      <Form.TextArea id="example" title="Example" />
      <Form.TagPicker id="categories" title="Categories">
      {categories.map((category) => (
          <Form.TagPicker.Item key={`${category.category.toLowerCase()}-${category.id}`} value={category.category} title={category.category} />
        ))}
      </Form.TagPicker>
    </Form>
  );
}

export default CreateExampleForm;