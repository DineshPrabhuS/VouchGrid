package com.vouchgrid.backend.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vouchgrid.backend.auth.dto.AuthResponse;
import com.vouchgrid.backend.auth.service.GithubAuthService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final GithubAuthService githubAuthService;

    @GetMapping("/mock-login")
    public AuthResponse mockLogin() {

        return githubAuthService.mockLogin();
    }
}