import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import * as Gtk from "@gtkx/ffi/gtk";
import { GtkBox, GtkButton, GtkEntry, GtkLabel } from "@gtkx/react";
import {
    generateFromTopicAtom,
    isGeneratingAtom,
    generationErrorAtom,
} from "../store.js";

export function TopicInput() {
    const [topic, setTopic] = useState("");
    const generateFromTopic = useSetAtom(generateFromTopicAtom);
    const isGenerating = useAtomValue(isGeneratingAtom);
    const error = useAtomValue(generationErrorAtom);

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        try {
            await generateFromTopic(topic.trim());
        } catch {
            // Error is already set in store
        }
    };

    const handleKeyPress = (entry: InstanceType<typeof Gtk.Entry>) => {
        // Generate on Enter key (check if text changed significantly)
        const text = entry.getText();
        if (text === topic && topic.trim()) {
            handleGenerate();
        }
    };

    return (
        <GtkBox
            orientation={Gtk.Orientation.VERTICAL}
            spacing={24}
            valign={Gtk.Align.CENTER}
            halign={Gtk.Align.CENTER}
            hexpand
            vexpand
        >
            <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <GtkLabel
                    label="Welcome to AI Flashcards"
                    cssClasses={["title-1"]}
                />
                <GtkLabel
                    label="Enter a topic to generate your first set of flashcards"
                    cssClasses={["dim-label"]}
                />
            </GtkBox>

            <GtkBox orientation={Gtk.Orientation.VERTICAL} spacing={12}>
                <GtkEntry
                    text={topic}
                    onChanged={(entry: InstanceType<typeof Gtk.Entry>) => setTopic(entry.getText())}
                    placeholderText="e.g., World War II, Python Programming, Biology..."
                    hexpand
                    sensitive={!isGenerating}
                    onActivate={handleKeyPress}
                />

                <GtkButton
                    label={isGenerating ? "Generating..." : "Generate Flashcards"}
                    onClicked={() => { handleGenerate(); }}
                    cssClasses={["suggested-action", "pill"]}
                    halign={Gtk.Align.CENTER}
                    sensitive={!isGenerating && topic.trim().length > 0}
                />

                {error && (
                    <GtkLabel
                        label={error}
                        cssClasses={["error"]}
                        halign={Gtk.Align.CENTER}
                        wrap
                    />
                )}
            </GtkBox>

            <GtkLabel
                label="Tip: Be specific for better results. 'French Revolution causes' works better than just 'History'"
                cssClasses={["dim-label", "caption"]}
                halign={Gtk.Align.CENTER}
                wrap
            />
        </GtkBox>
    );
}
