import { useAtomValue, useSetAtom } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Button, Label } from "@gtkx/react";
import {
  currentIndexAtom,
  totalCardsAtom,
  reviewedCountAtom,
  nextCardAtom,
  prevCardAtom,
} from "../store.js";

export function NavigationBar() {
  const currentIndex = useAtomValue(currentIndexAtom);
  const totalCards = useAtomValue(totalCardsAtom);
  const reviewedCount = useAtomValue(reviewedCountAtom);
  const nextCard = useSetAtom(nextCardAtom);
  const prevCard = useSetAtom(prevCardAtom);

  return (
    <Box orientation={Gtk.Orientation.HORIZONTAL} spacing={12}>
      <Button
        iconName="go-previous-symbolic"
        onClicked={prevCard}
        sensitive={currentIndex > 0}
        tooltipText="Previous card"
      />
      <Label
        label={`Card ${currentIndex + 1} of ${totalCards} | Reviewed: ${reviewedCount}`}
        hexpand
        halign={Gtk.Align.CENTER}
        cssClasses={["dim-label"]}
      />
      <Button
        iconName="go-next-symbolic"
        onClicked={nextCard}
        sensitive={currentIndex < totalCards - 1}
        tooltipText="Next card"
      />
    </Box>
  );
}
