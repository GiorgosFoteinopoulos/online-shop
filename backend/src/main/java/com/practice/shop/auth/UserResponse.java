package com.practice.shop.auth;

import java.time.Instant;
import com.practice.shop.users.Role;
import com.practice.shop.users.AppUser;

public record UserResponse(
        String email,
        String fullname,
        Role role,
        Instant createdAt
) {

    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getEmail(), user.getFullName(), user.getRole(), user.getCreatedAt());
    }
}
