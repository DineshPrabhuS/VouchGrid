package com.vouchgrid.backend.skills.engine;

import java.util.LinkedHashSet;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;

@Component
public class CommitMessageSkillRule implements SkillRule {

    private static final Map<String, Pattern> TECHNOLOGY_PATTERNS = Map.ofEntries(
            Map.entry("Java", pattern("\\bjava\\b|spring boot|maven|gradle|jvm")),
            Map.entry("Spring Boot", pattern("spring boot|spring mvc|spring data|spring security")),
            Map.entry("Spring Security", pattern("spring security|security filter|oauth2 resource")),
            Map.entry("Hibernate", pattern("hibernate|jpa|entity manager")),
            Map.entry("Maven", pattern("maven|pom\\.xml")),
            Map.entry("Gradle", pattern("gradle|build\\.gradle")),
            Map.entry("JavaScript", pattern("javascript|\\bjs\\b|node\\.js|npm")),
            Map.entry("TypeScript", pattern("typescript|\\bts\\b|tsconfig")),
            Map.entry("React", pattern("react|jsx|react component")),
            Map.entry("Vite", pattern("vite")),
            Map.entry("Node.js", pattern("node\\.js|express|npm|package\\.json")),
            Map.entry("Python", pattern("\\bpython\\b|django|flask|fastapi|pip")),
            Map.entry("Go", pattern("\\bgolang\\b|\\bgo\\b|go\\.mod")),
            Map.entry("C#", pattern("c#|\\.net|asp\\.net|dotnet")),
            Map.entry("SQL", pattern("\\bsql\\b|query|database|migration|schema")),
            Map.entry("MySQL", pattern("mysql")),
            Map.entry("PostgreSQL", pattern("postgres|postgresql")),
            Map.entry("MongoDB", pattern("mongodb|mongo")),
            Map.entry("Redis", pattern("redis|cache")),
            Map.entry("REST APIs", pattern("rest|endpoint|api|http|controller")),
            Map.entry("GraphQL", pattern("graphql|apollo")),
            Map.entry("JWT", pattern("jwt|json web token|bearer token")),
            Map.entry("OAuth 2.0", pattern("oauth|oauth2|authorization code")),
            Map.entry("OpenID Connect", pattern("openid|oidc")),
            Map.entry("Git", pattern("git|commit|branch|merge|pull request|repository")),
            Map.entry("GitHub", pattern("github|pull request|workflow")),
            Map.entry("Docker", pattern("docker|container|dockerfile")),
            Map.entry("Kubernetes", pattern("kubernetes|k8s|helm|deployment manifest")),
            Map.entry("CI/CD", pattern("ci/cd|pipeline|github actions|continuous integration")),
            Map.entry("AWS", pattern("aws|s3|lambda|ec2|dynamodb")),
            Map.entry("Azure", pattern("azure|app service|aks|cosmos db")),
            Map.entry("Terraform", pattern("terraform|infrastructure as code|\\biac\\b")),
            Map.entry("Linux", pattern("linux|bash|shell script")),
            Map.entry("Testing", pattern("test|testing|junit|mockito|jest|cypress|playwright")),
            Map.entry("OpenAPI", pattern("openapi|swagger")),
            Map.entry("WebSockets", pattern("websocket|stomp|sockjs")),
            Map.entry("Messaging", pattern("kafka|rabbitmq|message queue|event driven"))
    );

    @Override
    public Set<String> detect(String text) {
        String normalized = text == null ? "" : text.toLowerCase(Locale.ROOT);
        Set<String> skills = new LinkedHashSet<>();

        TECHNOLOGY_PATTERNS.forEach((skill, pattern) -> {
            if (pattern.matcher(normalized).find()) {
                skills.add(skill);
            }
        });
        if (!normalized.isBlank() && skills.stream().noneMatch(Set.of("Git", "GitHub")::contains)) {
            skills.add("Git");
        }
        return skills;
    }

    private static Pattern pattern(String expression) {
        return Pattern.compile(expression, Pattern.CASE_INSENSITIVE);
    }
}