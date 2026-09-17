package com.vouchgrid.backend.skills.engine;

import java.util.List;

public record SkillEvidence(
        String message,
        List<String> filenames,
        String diffContent,
        int additions,
        int deletions
) {
    public String searchableText() {
        return String.join("\n", message == null ? "" : message,
                String.join("\n", filenames == null ? List.of() : filenames),
                diffContent == null ? "" : diffContent);
    }
}