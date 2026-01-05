import { useAtomValue, useSetAtom } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { GtkBox, GtkButton, GtkLabel } from "@gtkx/react";
import {
  currentIndexAtom,
  totalCardsAtom,
  reviewedCountAtom,
  nextCardAtom,
  prevCardAtom,
  topicAtom,
} from "../store.js";
import { GenerateButton } from "./GenerateButton.js";

export function NavigationBar() {
  const currentIndex = useAtomValue(currentIndexAtom);
  const totalCards = useAtomValue(totalCardsAtom);
  const reviewedCount = useAtomValue(reviewedCountAtom);
  const topic = useAtomValue(topicAtom);
  const nextCard = useSetAtom(nextCardAtom);
  const prevCard = useSetAtom(prevCardAtom);

  return (
    <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={8}>
      {topic && (
        <GtkLabel
          label={topic}
          cssClasses={["title-4"]}
          halign={Gtk.Align.CENTER}
        />
      )}
      <GtkBox orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
        <GtkButton
          iconName="go-previous-symbolic"
          onClicked={prevCard}
          sensitive={currentIndex > 0}
          tooltipText="Previous card"
        />
        <GtkLabel
          label={`Card ${currentIndex + 1} of ${totalCards} | Reviewed: ${reviewedCount}`}
          hexpand
          halign={Gtk.Align.CENTER}
          cssClasses={["dim-label"]}
        />
        <GtkButton
          iconName="go-next-symbolic"
          onClicked={nextCard}
          sensitive={currentIndex < totalCards - 1}
          tooltipText="Next card"
        />
        <GenerateButton />
      </GtkBox>
    </GtkBox>
  );
}
