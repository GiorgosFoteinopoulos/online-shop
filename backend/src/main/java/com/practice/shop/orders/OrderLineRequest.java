package com.practice.shop.orders;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record OrderLineRequest(
        @NotNull @Positive Long productId,
        @NotNull @Min(1) @Max(99) Integer quantity
) {
}
