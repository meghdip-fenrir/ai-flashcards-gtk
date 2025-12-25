import { useAtomValue, useSetAtom } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Button } from "@gtkx/react";
import { isFlippedAtom, flipCardAtom, rateCardAtom } from "../store.js";

export function ActionButtons() {
  const isFlipped = useAtomValue(isFlippedAtom);
  const flipCard = useSetAtom(flipCardAtom);
  const rateCard = useSetAtom(rateCardAtom);

  if (!isFlipped) {
    return (
      <Button
        label="Show Answer"
        onClicked={flipCard}
        cssClasses={["suggested-action", "pill"]}
        halign={Gtk.Align.CENTER}
      />
    );
  }

  return (
    <Box
      orientation={Gtk.Orientation.HORIZONTAL}
      spacing={8}
      halign={Gtk.Align.CENTER}
      homogeneous
    >
      <Button
        label="Again"
        onClicked={() => rateCard("again")}
        cssClasses={["destructive-action"]}
        tooltipText="Completely forgot"
      />
      <Button
        label="Hard"
        onClicked={() => rateCard("hard")}
        tooltipText="Recalled with difficulty"
      />
      <Button
        label="Good"
        onClicked={() => rateCard("good")}
        tooltipText="Recalled correctly"
      />
      <Button
        label="Easy"
        onClicked={() => rateCard("easy")}
        cssClasses={["suggested-action"]}
        tooltipText="Very easy"
      />
    </Box>
  );
}
