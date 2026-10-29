package com.practice.shop.auth;


import com.practice.shop.common.ConflictException;
import com.practice.shop.common.UnauthorizedException;
import com.practice.shop.security.JwtService;
import com.practice.shop.users.AppUser;
import com.practice.shop.users.AppUserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.practice.shop.users.Role;

import java.util.Locale;

@Service
public class AuthService {

   private static final String INVALID_CREDENTIALS = "Invalid email or password";

   private final AppUserRepository users;
   private final PasswordEncoder passwordEncoder;
   private final JwtService jwtService;

    public AuthService(AppUserRepository users, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.users = users;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (users.existsByEmail(email)) {
            throw new ConflictException("An account with this email already exists!");
        }
        String hash = passwordEncoder.encode(request.password());
        AppUser user = new AppUser(email, hash, request.fullName().trim(), Role.CUSTOMER);

        return UserResponse.from(users.save(user));
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        AppUser user = users.findByEmail(email).orElse(null);

        if (user == null || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException(INVALID_CREDENTIALS);
        }
        Jwt token = jwtService.createToken(user);
        return new LoginResponse(token.getTokenValue(), token.getExpiresAt(), UserResponse.from(user));
    }

    @Transactional(readOnly = true)
    public UserResponse me(String email) {
        return users.findByEmail(email)
                .map(UserResponse::from)
                .orElseThrow(() -> new UnauthorizedException("Account not found"));
    }
    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
