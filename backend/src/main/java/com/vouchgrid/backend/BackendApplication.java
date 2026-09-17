package com.vouchgrid.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.vouchgrid.backend.githubsync.config.GitHubOAuthProperties;

@SpringBootApplication
@EnableConfigurationProperties(GitHubOAuthProperties.class)
public class BackendApplication {
    public static void main(String[] args) {
        System.setProperty("java.net.preferIPv4Stack", "true");
        SpringApplication.run(BackendApplication.class, args);
    }
}