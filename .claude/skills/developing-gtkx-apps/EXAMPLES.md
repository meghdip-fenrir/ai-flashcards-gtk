# GTKX Code Examples

## Application Structure

### Basic App with State

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { ApplicationWindow, Box, Label, quit } from "@gtkx/react";
import { useCallback, useState } from "react";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

let nextId = 1;

export const App = () => {
    const [todos, setTodos] = useState<Todo[]>([]);

    const addTodo = useCallback((text: string) => {
        setTodos((prev) => [...prev, { id: nextId++, text, completed: false }]);
    }, []);

    const toggleTodo = useCallback((id: number) => {
        setTodos((prev) =>
            prev.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    }, []);

    return (
        <ApplicationWindow title="Todo App" defaultWidth={400} defaultHeight={500} onCloseRequest={quit}>
            <Box orientation={Gtk.Orientation.VERTICAL} spacing={16} marginTop={16} marginStart={16} marginEnd={16}>
                <Label label="Todo App" />
            </Box>
        </ApplicationWindow>
    );
};

export const appId = "com.gtkx.todo";
```

## Layout Patterns

### Grid for Forms

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { Button, Entry, Grid, Label } from "@gtkx/react";
import { useState } from "react";

const FormLayout = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    return (
        <Grid.Root rowSpacing={8} columnSpacing={12}>
            <Grid.Child column={0} row={0}>
                <Label label="Name:" halign={Gtk.Align.END} />
            </Grid.Child>
            <Grid.Child column={1} row={0}>
                <Entry text={name} onChanged={(e) => setName(e.getText())} hexpand />
            </Grid.Child>
            <Grid.Child column={0} row={1}>
                <Label label="Email:" halign={Gtk.Align.END} />
            </Grid.Child>
            <Grid.Child column={1} row={1}>
                <Entry text={email} onChanged={(e) => setEmail(e.getText())} hexpand />
            </Grid.Child>
            <Grid.Child column={0} row={2} columnSpan={2}>
                <Button label="Submit" halign={Gtk.Align.END} marginTop={8} />
            </Grid.Child>
        </Grid.Root>
    );
};
```

### Stack with StackSwitcher

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Label, Stack, StackSwitcher } from "@gtkx/react";

const TabContainer = () => (
    <Box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
        <StackSwitcher.Root
            ref={(switcher: Gtk.StackSwitcher | null) => {
                if (switcher) {
                    const stack = switcher.getParent()?.getLastChild() as Gtk.Stack | null;
                    if (stack) switcher.setStack(stack);
                }
            }}
        />
        <Stack.Root transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT} transitionDuration={200}>
            <Stack.Page name="page1" title="First">
                <Label label="First Page Content" />
            </Stack.Page>
            <Stack.Page name="page2" title="Second">
                <Label label="Second Page Content" />
            </Stack.Page>
        </Stack.Root>
    </Box>
);
```

## Virtual Scrolling Lists

### ListView with Selection

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Label, ListView } from "@gtkx/react";
import { useState } from "react";

interface Task {
    id: string;
    title: string;
    completed: boolean;
}

const tasks: Task[] = [
    { id: "1", title: "Learn GTK4", completed: true },
    { id: "2", title: "Build React app", completed: false },
];

const TaskList = () => {
    const [selectedId, setSelectedId] = useState<string | undefined>();

    return (
        <Box cssClasses={["card"]} heightRequest={250}>
            <ListView.Root
                vexpand
                selected={selectedId ? [selectedId] : []}
                onSelectionChanged={(ids) => setSelectedId(ids[0])}
                renderItem={(task: Task | null) => (
                    <Label
                        label={task?.title ?? ""}
                        cssClasses={task?.completed ? ["dim-label"] : []}
                        halign={Gtk.Align.START}
                        marginStart={12}
                        marginTop={8}
                        marginBottom={8}
                    />
                )}
            >
                {tasks.map((task) => (
                    <ListView.Item key={task.id} id={task.id} item={task} />
                ))}
            </ListView.Root>
        </Box>
    );
};
```

### HeaderBar with Navigation

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { ApplicationWindow, Box, Button, HeaderBar, Label, quit } from "@gtkx/react";
import { useState } from "react";

const AppWithHeaderBar = () => {
    const [page, setPage] = useState("home");

    return (
        <ApplicationWindow title="My App" defaultWidth={600} defaultHeight={400} onCloseRequest={quit}>
            <Box orientation={Gtk.Orientation.VERTICAL}>
                <HeaderBar.Root>
                    <HeaderBar.Start>
                        {page !== "home" && (
                            <Button iconName="go-previous-symbolic" onClicked={() => setPage("home")} />
                        )}
                    </HeaderBar.Start>
                    <HeaderBar.End>
                        <Button iconName="emblem-system-symbolic" onClicked={() => setPage("settings")} />
                    </HeaderBar.End>
                </HeaderBar.Root>
                <Label label={page === "home" ? "Home Page" : "Settings Page"} vexpand />
            </Box>
        </ApplicationWindow>
    );
};
```

## Menus

### MenuButton with PopoverMenu

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Label, Menu, MenuButton, PopoverMenu } from "@gtkx/react";
import { useState } from "react";

const MenuDemo = () => {
    const [lastAction, setLastAction] = useState<string | null>(null);

    return (
        <Box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
            <Label label={`Last action: ${lastAction ?? "(none)"}`} />
            <MenuButton.Root label="Actions">
                <MenuButton.Popover>
                    <PopoverMenu.Root>
                        <Menu.Item label="New" onActivate={() => setLastAction("New")} accels="<Control>n" />
                        <Menu.Item label="Open" onActivate={() => setLastAction("Open")} accels="<Control>o" />
                        <Menu.Item label="Save" onActivate={() => setLastAction("Save")} accels="<Control>s" />
                    </PopoverMenu.Root>
                </MenuButton.Popover>
            </MenuButton.Root>
        </Box>
    );
};
```

## Component Props Pattern

### List Item Component

```tsx
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Button, CheckButton, Label } from "@gtkx/react";

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => (
    <Box orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
        <CheckButton active={todo.completed} onToggled={() => onToggle(todo.id)} />
        <Label label={todo.text} hexpand cssClasses={todo.completed ? ["dim-label"] : []} />
        <Button iconName="edit-delete-symbolic" onClicked={() => onDelete(todo.id)} cssClasses={["flat"]} />
    </Box>
);
```
