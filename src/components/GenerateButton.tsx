import { useAtomValue, useSetAtom } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { Box, Button, Label } from "@gtkx/react";
import {
    generateMoreCardsAtom,
    isGeneratingAtom,
    generationErrorAtom,
    clearCardsAtom,
} from "../store.js";

export function GenerateButton() {
    const generateMore = useSetAtom(generateMoreCardsAtom);
    const clearCards = useSetAtom(clearCardsAtom);
    const isGenerating = useAtomValue(isGeneratingAtom);
    const error = useAtomValue(generationErrorAtom);

    const handleGenerateMore = async () => {
        try {
            await generateMore(5);
        } catch {
            // Error already set in store
        }
    };

    return (
        <Box orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
            {error && (
                <Label
                    label={error}
                    cssClasses={["error", "caption"]}
                    halign={Gtk.Align.START}
                />
            )}
            <Button
                iconName="view-refresh-symbolic"
                tooltipText="Generate more cards based on weak areas"
                onClicked={handleGenerateMore}
                sensitive={!isGenerating}
            />
            <Button
                iconName="edit-clear-all-symbolic"
                tooltipText="Start over with a new topic"
                onClicked={clearCards}
                sensitive={!isGenerating}
            />
        </Box>
    );
}
