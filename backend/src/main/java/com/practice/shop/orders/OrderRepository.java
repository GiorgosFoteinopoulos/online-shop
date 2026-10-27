package com.practice.shop.orders;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @EntityGraph(attributePaths = "items")
    Optional<Order> findByPublicId(UUID publicId);

    @EntityGraph(attributePaths = "items")
    Optional<Order> findByPublicIdAndUserId(UUID publicId, Long userId);

    @EntityGraph(attributePaths = "items")
    List<Order> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
