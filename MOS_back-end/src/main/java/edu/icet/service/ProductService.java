package edu.icet.service;

import edu.icet.dto.Product;

import java.util.List;
import java.util.Optional;

public interface ProductService {
    void addProduct(Product product);
    List<Product> getAll();
    Optional<Product> findById(int id);
    void updateProduct(Product product);
    void deleteProduct(Integer id);

}
