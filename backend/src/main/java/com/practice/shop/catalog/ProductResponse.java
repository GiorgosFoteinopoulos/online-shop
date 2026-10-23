package com.practice.shop.catalog;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String price,
        int stock,
        boolean inStock,
        String imageUrl,
        CategoryResponse category
) {

    static ProductResponse from(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice().toPlainString(),
                product.getStock(),
                product.getStock() > 0,
                product.getImageUrl(),
                CategoryResponse.from(product.getCategory()));
    }
}
