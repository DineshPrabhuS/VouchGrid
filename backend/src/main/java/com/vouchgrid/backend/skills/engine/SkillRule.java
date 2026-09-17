package com.vouchgrid.backend.skills.engine;

import java.util.Set;

public interface SkillRule {

    Set<String> detect(String text);

    default Set<String> detect(SkillEvidence evidence) {
        return detect(evidence.searchableText());
    }
}