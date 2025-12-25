import { useAtomValue } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Label, Stack } from "@gtkx/react";
import { currentCardAtom, isFlippedAtom } from "../store.js";

export function FlashcardView() {
  const currentCard = useAtomValue(currentCardAtom);
  const isFlipped = useAtomValue(isFlippedAtom);

  return (
    <Box
      orientation={Gtk.Orientation.VERTICAL}
      spacing={12}
      vexpand
      hexpand
      cssClasses={["card"]}
    >
      <Stack.Root visibleChildName={isFlipped ? "back" : "front"} vexpand>
        <Stack.Page name="front" title="Question">
          <Box
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand
            hexpand
            spacing={16}
          >
            <Label label="Question" cssClasses={["dim-label", "caption"]} />
            <Label
              label={currentCard.front}
              wrap
              justify={Gtk.Justification.CENTER}
              cssClasses={["title-2"]}
            />
          </Box>
        </Stack.Page>
        <Stack.Page name="back" title="Answer">
          <Box
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand
            hexpand
            spacing={16}
          >
            <Label label="Answer" cssClasses={["dim-label", "caption"]} />
            <Label
              label={currentCard.back}
              wrap
              justify={Gtk.Justification.CENTER}
              cssClasses={["title-1"]}
            />
          </Box>
        </Stack.Page>
      </Stack.Root>
    </Box>
  );
}
