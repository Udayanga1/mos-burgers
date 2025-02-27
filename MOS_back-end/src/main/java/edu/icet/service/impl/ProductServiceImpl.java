package edu.icet.service.impl;

import edu.icet.dto.Product;
import edu.icet.entity.ProductEntity;
import edu.icet.repository.ProductRepository;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    final ProductRepository repository;
    final ModelMapper mapper;

    @Override
    public void addProduct(Product product) {
        repository.save(mapper.map(product, ProductEntity.class));
    }

    @Override
    public List<Product> getAll() {
        List<Product> productList = new ArrayList<>();
        List<ProductEntity> all = repository.findAll();

        all.forEach(productEntity -> {
            productList.add(mapper.map(productEntity, Product.class));
        });

        return productList;
    }

    @Override
    public Optional<Product> findById(int id) {
        return repository.findById(id)
                .map(productEntity -> mapper.map(productEntity, Product.class));
    }

    @Override
    public void updateProduct(Product product) {
        if (repository.existsById(product.getId())) {  // Check if product exists
            repository.save(mapper.map(product, ProductEntity.class)); // Save updated product
        } else {
            throw new RuntimeException("Product not found with ID: " + product.getId());
        }
    }

    @Override
    public void deleteProduct(Integer id) {
        if (repository.existsById(id)) {  // Check if product exists before deleting
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found with ID: " + id);
        }
    }


}
