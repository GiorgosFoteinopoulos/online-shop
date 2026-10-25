package com.practice.shop.orders;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record OrderResponse(
        UUID id,
        String status,
        String customerName,
        String customerEmail,
        String total,
        Instant createdAt,
        List<OrderLineResponse> items

) {

    static OrderResponse from(Order order) {
        return new OrderResponse(
                order.getPublicId(),
                order.getStatus().name(),
                order.getCustomerName(),
                order.getCustomerEmail(),
                order.getTotal().toPlainString(),
                order.getCreatedAt(),
                order.getItems().stream().map(OrderLineResponse::from).toList());
    }
}
