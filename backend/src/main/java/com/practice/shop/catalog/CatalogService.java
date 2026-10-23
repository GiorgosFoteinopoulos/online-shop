package com.practice.shop.catalog;


import com.practice.shop.common.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CatalogService(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    public List<CategoryResponse> listCategories() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    public ProductResponse getProduct(long id) {
        return productRepository.findById(id)
                .map(ProductResponse::from)
                .orElseThrow(() -> new NotFoundException("Product", id));
    }
}

