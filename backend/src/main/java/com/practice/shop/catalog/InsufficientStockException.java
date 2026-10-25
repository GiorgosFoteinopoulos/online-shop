package com.practice.shop.catalog;

public class InsufficientStockException extends RuntimeException {

    private final Long productId;
    private final int available;
    private final int requested;

    public InsufficientStockException(Long productId, String productName, int available, int requested) {
        super(available == 0
        ? productName + " is out of stock."
                : "Only " + available + " left of " + productName + ", requested " + requested + ".");
        this.productId = productId;
        this.available = available;
        this.requested = requested;
    }

    public Long getProductId() {
        return productId;
    }
    public int getAvailable() {
        return available;
    }
    public int getRequested() {
        return requested;
    }
}
