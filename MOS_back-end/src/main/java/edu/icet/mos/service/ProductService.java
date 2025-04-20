package edu.icet.mos.service;

import edu.icet.mos.dto.Product;

import java.util.List;

public interface ProductService {
    void addProduct (Product product);

    List<Product> getAll();

    Product searchById(Integer id);

    List<Product> searchByName(String name);

    void update(Product product);

    void delete(Integer id);

}
