import { Action, Alert, Color, confirmAlert } from "@raycast/api";

function DeleteExampleAction(props: { onDelete: () => void }) {
  const options: Alert.Options = {
    title: "Are you sure you want to delete this example?",
    message: "Be careful — this action can't be undone!",
    primaryAction: {
      title: "Delete Example",
      style: Alert.ActionStyle.Destructive,
    },
  };
  const handleConfirmDelete = async () => {
    if (await confirmAlert(options)) {
      props.onDelete();
    }
  };
  return (
    <Action
      icon={{
        source: "trash.svg",
        tintColor: { light: Color.Red, dark: Color.Red },
      }}
      title="Delete Example"
      shortcut={{ modifiers: ["ctrl"], key: "x" }}
      onAction={handleConfirmDelete}
    />
  );
}

export default DeleteExampleAction;
