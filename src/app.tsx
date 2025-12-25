import * as Gtk from "@gtkx/ffi/gtk";
import { ApplicationWindow, Box, quit } from "@gtkx/react";
import { NavigationBar } from "./components/NavigationBar.js";
import { FlashcardView } from "./components/FlashcardView.js";
import { ActionButtons } from "./components/ActionButtons.js";

export default function App() {
  return (
    <ApplicationWindow
      title="Anki Flashcards"
      defaultWidth={500}
      defaultHeight={450}
      onCloseRequest={quit}
    >
      <Box
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
        marginTop={24}
        marginBottom={24}
        marginStart={24}
        marginEnd={24}
      >
        <NavigationBar />
        <FlashcardView />
        <ActionButtons />
      </Box>
    </ApplicationWindow>
  );
}

export const appId = "com.meghdip.aidemo";
