package com.jay.cv.project.controllers;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1")
public class AuthControllers {
    @GetMapping("/get-user-details")
    public Object GetUserDetails() {
        return SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

}
