package com.practice.shop.catalog;


import jakarta.persistence.*;

@Entity
@Table(name = "category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String slug;

    protected Category() {

    }

    public Category(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
    public String getSlug() {
        return slug;
    }
}
