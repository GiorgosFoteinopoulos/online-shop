package com.practice.shop.orders;

public record OrderLineResponse(
        Long productId,
        String productName,
        String unitPrice,
        int quantity,
        String lineTotal
) {

    static OrderLineResponse from(OrderItem item) {
        return new OrderLineResponse(
                item.getProductId(),
                item.getProductName(),
                item.getUnitPrice().toPlainString(),
                item.getQuantity(),
                item.getLineTotal().toPlainString()
        );
    }
}
