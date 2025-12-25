# GTKX Widget Reference

## Container Widgets

### Box
Linear layout container.

```tsx
<Box orientation={Gtk.Orientation.VERTICAL} spacing={12}>
    <Label label="Child 1" />
    <Label label="Child 2" />
</Box>
```

Props:
- `orientation`: `Gtk.Orientation.HORIZONTAL` | `Gtk.Orientation.VERTICAL`
- `spacing`: number (pixels between children)
- `homogeneous`: boolean (equal child sizes)

### Grid
2D grid layout with explicit positioning.

```tsx
<Grid.Root spacing={10} rowSpacing={5} columnSpacing={5}>
    <Grid.Child column={0} row={0}>
        <Label label="Top-left" />
    </Grid.Child>
    <Grid.Child column={1} row={0} columnSpan={2}>
        <Label label="Spans 2 columns" />
    </Grid.Child>
</Grid.Root>
```

Grid.Child props (consumed, not passed to GTK):
- `column`: number (0-indexed)
- `row`: number (0-indexed)
- `columnSpan`: number (default 1)
- `rowSpan`: number (default 1)

### Stack
Shows one child at a time, switchable by name.

```tsx
<Stack.Root visibleChildName="page1">
    <Stack.Page name="page1" title="First" iconName="document-new">
        <Content1 />
    </Stack.Page>
    <Stack.Page name="page2" title="Second">
        <Content2 />
    </Stack.Page>
</Stack.Root>
```

Stack.Page props (consumed):
- `name`: string (required, unique identifier)
- `title`: string (display title)
- `iconName`: string (icon name)

### Notebook
Tabbed container with visible tabs.

```tsx
<Notebook.Root>
    <Notebook.Page label="Tab 1">
        <Content1 />
    </Notebook.Page>
    <Notebook.Page label="Tab 2">
        <Content2 />
    </Notebook.Page>
</Notebook.Root>
```

Notebook.Page props (consumed):
- `label`: string (tab label)

### Paned
Resizable split container with draggable divider.

```tsx
<Paned.Root
    orientation={Gtk.Orientation.HORIZONTAL}
    position={280}
    shrinkStartChild={false}
    shrinkEndChild={false}
>
    <Paned.StartChild>
        <SidePanel />
    </Paned.StartChild>
    <Paned.EndChild>
        <MainContent />
    </Paned.EndChild>
</Paned.Root>
```

Props:
- `orientation`: `Gtk.Orientation.HORIZONTAL` | `Gtk.Orientation.VERTICAL`
- `position`: number (divider position in pixels)
- `shrinkStartChild`: boolean
- `shrinkEndChild`: boolean

## Virtual Scrolling Widgets

### ListView
High-performance scrollable list with virtual rendering and selection support.

```tsx
<ListView.Root
    vexpand
    selected={[selectedId]}
    selectionMode={Gtk.SelectionMode.SINGLE}
    onSelectionChanged={(ids) => setSelectedId(ids[0])}
    renderItem={(item: Item | null) => (
        <Label label={item?.text ?? ""} />
    )}
>
    {items.map(item => (
        <ListView.Item key={item.id} id={item.id} item={item} />
    ))}
</ListView.Root>
```

Props:
- `renderItem`: `(item: T | null) => ReactElement` (required)
- `selected`: string[] (array of selected item IDs)
- `selectionMode`: `Gtk.SelectionMode.SINGLE` | `MULTIPLE` | `NONE`
- `onSelectionChanged`: `(ids: string[]) => void`

ListView.Item props:
- `id`: string (required, unique identifier for selection)
- `item`: T (the data item)

### GridView
Grid-based virtual scrolling. Same API as ListView but renders items in a grid.

```tsx
<GridView.Root
    vexpand
    renderItem={(item: Item | null) => (
        <Box orientation={Gtk.Orientation.VERTICAL}>
            <Image iconName={item?.icon ?? "image-missing"} />
            <Label label={item?.name ?? ""} />
        </Box>
    )}
>
    {items.map(item => (
        <GridView.Item key={item.id} id={item.id} item={item} />
    ))}
</GridView.Root>
```

### ColumnView
Table with sortable columns.

```tsx
<ColumnView.Root
    sortColumn="name"
    sortOrder={Gtk.SortType.ASCENDING}
    onSortChange={(column, order) => handleSort(column, order)}
>
    <ColumnView.Column
        title="Name"
        id="name"
        expand
        resizable
        sortable
        renderCell={(item: Item | null) => (
            <Label label={item?.name ?? ""} />
        )}
    />
    {items.map(item => (
        <ColumnView.Item key={item.id} id={item.id} item={item} />
    ))}
</ColumnView.Root>
```

ColumnView.Column props:
- `title`: string (column header)
- `id`: string (used for sorting)
- `expand`: boolean (fill available space)
- `resizable`: boolean (user can resize)
- `sortable`: boolean (clicking header triggers sort)
- `fixedWidth`: number (fixed width in pixels)
- `renderCell`: `(item: T | null) => ReactElement`

### DropDown
String selection dropdown.

```tsx
<DropDown.Root>
    {options.map(opt => (
        <DropDown.Item key={opt.value} id={opt.value} label={opt.label} />
    ))}
</DropDown.Root>
```

DropDown.Item props:
- `id`: string (unique identifier)
- `label`: string (display text)

## Header Widgets

### HeaderBar
Title bar with packed widgets at start and end.

```tsx
<HeaderBar.Root>
    <HeaderBar.Start>
        <Button iconName="go-previous-symbolic" />
    </HeaderBar.Start>
    <HeaderBar.End>
        <MenuButton.Root iconName="open-menu-symbolic" />
    </HeaderBar.End>
</HeaderBar.Root>
```

### ActionBar
Bottom action bar with start/end packing.

```tsx
<ActionBar.Root>
    <ActionBar.Start>
        <Button label="Cancel" />
    </ActionBar.Start>
    <ActionBar.End>
        <Button label="Save" cssClasses={["suggested-action"]} />
    </ActionBar.End>
</ActionBar.Root>
```

## Input Widgets

### Entry
Single-line text input. Requires two-way binding for controlled behavior.

```tsx
const [text, setText] = useState("");

<Entry
    text={text}
    onChanged={(entry) => setText(entry.getText())}
    placeholder="Enter text..."
/>
```

### ToggleButton
Toggle button with controlled state. Auto-prevents signal feedback loops.

```tsx
const [active, setActive] = useState(false);

<ToggleButton.Root
    active={active}
    onToggled={() => setActive(!active)}
    label="Toggle me"
/>
```

## Display Widgets

### Label
```tsx
<Label label="Hello World" halign={Gtk.Align.START} wrap useMarkup />
```

### Button
```tsx
<Button label="Click me" onClicked={() => handleClick()} iconName="document-new" />
```

### MenuButton
```tsx
<MenuButton.Root label="Options" iconName="open-menu">
    <MenuButton.Popover>
        <PopoverMenu.Root>
            <Menu.Item label="Action" onActivate={handle} />
        </PopoverMenu.Root>
    </MenuButton.Popover>
</MenuButton.Root>
```

## Menu Widgets

### ApplicationMenu
```tsx
<ApplicationMenu>
    <Menu.Submenu label="File">
        <Menu.Item label="New" onActivate={handleNew} accels="<Control>n" />
        <Menu.Section>
            <Menu.Item label="Quit" onActivate={quit} accels="<Control>q" />
        </Menu.Section>
    </Menu.Submenu>
</ApplicationMenu>
```

### Menu.Item
Props:
- `label`: string
- `onActivate`: `() => void`
- `accels`: string | string[] (e.g., "<Control>n")

### Menu.Section
Groups menu items with optional label.

### Menu.Submenu
Nested submenu.

## Window Widgets

### ApplicationWindow
```tsx
<ApplicationWindow
    title="My App"
    defaultWidth={800}
    defaultHeight={600}
    showMenubar
    onCloseRequest={() => false}
>
    <MainContent />
</ApplicationWindow>
```

## Common Props

All widgets support:
- `hexpand` / `vexpand`: boolean (expand to fill space)
- `halign` / `valign`: `Gtk.Align.START` | `CENTER` | `END` | `FILL`
- `marginStart` / `marginEnd` / `marginTop` / `marginBottom`: number
- `sensitive`: boolean (enabled/disabled)
- `visible`: boolean
- `cssClasses`: string[]
