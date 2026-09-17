package com.vouchgrid.backend.skills.engine;

import org.springframework.stereotype.Component;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Component
public class FilenameSkillRule implements SkillRule {

    private static final Map<String, List<String>> FILE_PATTERNS = Map.ofEntries(
            Map.entry("Java", List.of(".java", "pom.xml", "build.gradle")),
            Map.entry("Spring Boot", List.of("application.properties", "application.yml")),
            Map.entry("Maven", List.of("pom.xml")),
            Map.entry("Gradle", List.of("build.gradle", "settings.gradle")),
            Map.entry("JavaScript", List.of(".js", ".mjs", "package.json")),
            Map.entry("TypeScript", List.of(".ts", ".tsx", "tsconfig.json")),
            Map.entry("React", List.of(".jsx", ".tsx", "vite.config")),
            Map.entry("Python", List.of(".py", "requirements.txt", "pyproject.toml")),
            Map.entry("Go", List.of(".go", "go.mod")),
            Map.entry("C#", List.of(".cs", ".csproj")),
            Map.entry("SQL", List.of(".sql", "migration")),
            Map.entry("Docker", List.of("dockerfile", "docker-compose", ".dockerignore")),
            Map.entry("Kubernetes", List.of("deployment.yml", "deployment.yaml", "helm", "k8s/")),
            Map.entry("Terraform", List.of(".tf", ".tfvars")),
            Map.entry("GitHub", List.of(".github/", "workflows/")),
            Map.entry("OpenAPI", List.of("openapi.yml", "openapi.yaml", "swagger"))
    );

    @Override
    public Set<String> detect(String text) {
        return Set.of();
    }

    @Override
    public Set<String> detect(SkillEvidence evidence) {
        Set<String> detected = new LinkedHashSet<>();
        for (String filename : evidence.filenames()) {
            String normalized = filename.toLowerCase(Locale.ROOT);
            FILE_PATTERNS.forEach((skill, patterns) -> {
                if (patterns.stream().anyMatch(normalized::contains)) detected.add(skill);
            });
        }
        return detected;
    }
}