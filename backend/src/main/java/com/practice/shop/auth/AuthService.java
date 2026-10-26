package com.practice.shop.auth;


import com.practice.shop.common.ConflictException;
import com.practice.shop.users.AppUser;
import com.practice.shop.users.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.practice.shop.users.Role;

import java.util.Locale;

@Service
public class AuthService {

    private final AppUserRepository users;
    private final PasswordEncoder passwordEncoder;

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);

        if (users.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists!");
        }
        String hash = passwordEncoder.encode(request.password());
        AppUser user = new AppUser(email, hash, request.fullName().trim(), Role.CUSTOMER);

        return UserResponse.from(users.save(user));
    }
}
