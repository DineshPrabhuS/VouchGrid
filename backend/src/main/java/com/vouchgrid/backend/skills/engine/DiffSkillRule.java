package com.vouchgrid.backend.skills.engine;

import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Set;

@Component
public class DiffSkillRule implements SkillRule {

    @Override
    public Set<String> detect(String text) {
        return Set.of();
    }

    @Override
    public Set<String> detect(SkillEvidence evidence) {
        String diff = evidence.diffContent() == null ? "" : evidence.diffContent().toLowerCase(Locale.ROOT);
        Set<String> detected = new LinkedHashSet<>();
        if (diff.contains("@restcontroller") || diff.contains("@getmapping") || diff.contains("@postmapping")) {
            detected.add("Spring Boot");
            detected.add("REST APIs");
        }
        if (diff.contains("@entity") || diff.contains("@query") || diff.contains("jparepository")) {
            detected.add("Hibernate");
            detected.add("SQL");
        }
        if (diff.contains("jwt") || diff.contains("bearer ")) detected.add("JWT");
        if (diff.contains("oauth") || diff.contains("authorization_code")) detected.add("OAuth 2.0");
        if (diff.contains("docker run") || diff.contains("from node:") || diff.contains("from openjdk:")) detected.add("Docker");
        if (diff.contains("useeffect") || diff.contains("usestate") || diff.contains("jsx")) detected.add("React");
        if (diff.contains("select ") || diff.contains("insert into") || diff.contains("create table")) detected.add("SQL");
        return detected;
    }
}