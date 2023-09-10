import { Form } from "@raycast/api";
import { useState } from "react";

export default function Command() {
    const [nameError, setNameError] = useState<string | undefined>();
    const [exampleError, setExampleError] = useState<string | undefined>();

    function dropNameErrorIfNeeded() {
      if (nameError && nameError.length > 0) {
        setNameError(undefined);
      }
    }

    function dropExampleErrorIfNeeded() {
      if (exampleError && exampleError.length > 0) {
        setNameError(undefined);
      }
    }

  return (
    <Form>
      <Form.TextField
        id="nameField"
        title="Title"
        error={nameError}
        onChange={dropNameErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setNameError("Title is required");
          } else {
            dropNameErrorIfNeeded();
          }
        }}
      />
      <Form.TextArea 
        id="example" 
        title="Example"
        error={exampleError}
        onChange={dropExampleErrorIfNeeded}
        onBlur={(event) => {
          if (event.target.value?.length == 0) {
            setExampleError("An example is required");
          } else {
            dropExampleErrorIfNeeded();
          }
        }}
        />
      <Form.TagPicker id="components" title="Components">
        <Form.TagPicker.Item value="if" title="if" icon="various.svg" />
        <Form.TagPicker.Item value="ifs" title="ifs" icon="various.svg" />
        <Form.TagPicker.Item value="and" title="and" icon="boolean.svg" />
      </Form.TagPicker>
    </Form>
  );
}

function validatePassword(value: string): boolean {
  return value.length >= 8;
}