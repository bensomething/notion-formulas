import { useCallback } from "react";
import { Form, Action, ActionPanel, useNavigation } from "@raycast/api";
import categories from "../data/formulas.json";

function EditExampleForm(props: { defaultTitle?: string; defaultExample?: string; defaultCategories?: string[]; onEdit: (title: string, example: string, categories: string[]) => void }) {
  const { onEdit, defaultTitle = "", defaultExample = "", defaultCategories = [] } = props;
  const { pop } = useNavigation();

  const handleSubmit = useCallback(
    (values: { title: string, example: string, categories: string[] }) => {
      onEdit(values.title, values.example, values.categories);
      pop();
    },
    [onEdit, pop]
  );

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Update Example" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="title" defaultValue={defaultTitle} title="Title" />
      <Form.TextArea id="example" defaultValue={defaultExample} title="Example" />
      <Form.TagPicker id="categories" title="Categories" defaultValue={defaultCategories}>
        {categories.map((category) => (
          <Form.TagPicker.Item key={`${category.category.toLowerCase()}-${category.id}`} value={category.category} title={category.category} />
        ))}
      </Form.TagPicker>
    </Form>
  );
}

export default EditExampleForm;