import * as Gtk from "@gtkx/ffi/gtk";
import {
  AdwApplicationWindow,
  AdwToolbarView,
  AdwHeaderBar,
  Toolbar,
  GtkBox,
  quit,
  AdwWindowTitle,
} from "@gtkx/react";
import { useAtomValue } from "jotai";
import { hasCardsAtom } from "./store.js";
import { NavigationBar } from "./components/NavigationBar.js";
import { FlashcardView } from "./components/FlashcardView.js";
import { ActionButtons } from "./components/ActionButtons.js";
import { TopicInput } from "./components/TopicInput.js";

function MainContent() {
  const hasCards = useAtomValue(hasCardsAtom);

  if (!hasCards) {
    return <TopicInput />;
  }

  return (
    <>
      <NavigationBar />
      <FlashcardView />
      <ActionButtons />
    </>
  );
}

export default function App() {
  return (
    <AdwApplicationWindow
      defaultWidth={550}
      defaultHeight={500}
      onCloseRequest={quit}
    >
      <AdwToolbarView>
        <Toolbar.Top>
          <AdwHeaderBar />
        </Toolbar.Top>
        <GtkBox
          orientation={Gtk.Orientation.VERTICAL}
          spacing={16}
          marginTop={24}
          marginBottom={24}
          marginStart={24}
          marginEnd={24}
        >
          <MainContent />
        </GtkBox>
      </AdwToolbarView>
    </AdwApplicationWindow>
  );
}

export const appId = "com.meghdip.aidemo";
