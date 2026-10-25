package com.practice.shop.orders;

import com.practice.shop.catalog.Product;
import com.practice.shop.catalog.ProductRepository;
import com.practice.shop.common.BadRequestException;
import com.practice.shop.common.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public OrderResponse placeOrder(PlaceOrderRequest request) {
        Map<Long, Integer> quantities = new HashMap<>();
        for (OrderLineRequest line : request.items()) {
            if (quantities.put(line.productId(), line.quantity()) != null) {
                throw new BadRequestException("Product " + line.productId() + " appears more than once.");
            }
        }
        Map<Long, Product> products = productRepository.findAllById(quantities.keySet()).stream()
                .collect(Collectors.toMap(Product::getId, Function.identity()));

        Order order = new Order(request.customerName().strip(),
                request.customerEmail().strip().toLowerCase(Locale.ROOT));

        quantities.forEach((productId, quantity) -> {
            Product product = products.get(productId);
            if (product == null) {
                throw new NotFoundException("Product", productId);
            }
            product.decreaseStock(quantity);
            order.addItem(product.getId(),product.getName(), product.getPrice(), quantity);
        });
        return OrderResponse.from(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrder(UUID publicId) {
        return orderRepository.findByPublicId(publicId)
                .map(OrderResponse::from)
                .orElseThrow(() -> new NotFoundException("Order", publicId));
    }
}
