package com.practice.shop.orders;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PlaceOrderRequest(
        @NotBlank @Size(max = 100) String customerName,
        @NotBlank @Email @Size(max = 254) String customerEmail,
        @NotEmpty @Size(max = 50) List<@Valid OrderLineRequest> items
) {
}
