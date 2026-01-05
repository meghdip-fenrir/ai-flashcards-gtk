import { useAtomValue } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { GtkBox, GtkLabel, GtkStack, StackPage } from "@gtkx/react";
import { currentCardAtom, isFlippedAtom } from "../store.js";

export function FlashcardView() {
  const currentCard = useAtomValue(currentCardAtom);
  const isFlipped = useAtomValue(isFlippedAtom);

  return (
    <GtkBox
      orientation={Gtk.Orientation.VERTICAL}
      spacing={12}
      vexpand
      hexpand
      cssClasses={["card"]}
    >
      <GtkStack visibleChildName={isFlipped ? "back" : "front"} vexpand>
        <StackPage name="front" title="Question">
          <GtkBox
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand
            hexpand
            spacing={16}
          >
            <GtkLabel label="Question" cssClasses={["dim-label", "caption"]} />
            <GtkLabel
              label={currentCard.front}
              wrap
              justify={Gtk.Justification.CENTER}
              cssClasses={["title-2"]}
            />
          </GtkBox>
        </StackPage>
        <StackPage name="back" title="Answer">
          <GtkBox
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            vexpand
            hexpand
            spacing={16}
          >
            <GtkLabel label="Answer" cssClasses={["dim-label", "caption"]} />
            <GtkLabel
              label={currentCard.back}
              wrap
              justify={Gtk.Justification.CENTER}
              cssClasses={["title-1"]}
            />
          </GtkBox>
        </StackPage>
      </GtkStack>
    </GtkBox>
  );
}
