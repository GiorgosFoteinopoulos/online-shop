package com.practice.shop.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface ProductRepository extends JpaRepository<Product, Long> {

    @EntityGraph(attributePaths = "category")  
    @Query("""
            select p from Product p
            where (:categorySlug is null or p.category.slug = :categorySlug)
              and lower(p.name) like lower(concat('%', :search, '%'))
            """)
    Page<Product> search(@Param("categorySlug") String categorySlug,
                         @Param("search") String search,
                         Pageable pageable);
}
