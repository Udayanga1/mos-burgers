package edu.icet.mos.service.impl;

import edu.icet.mos.dto.CustomerPreference;
import edu.icet.mos.dto.Product;
import edu.icet.mos.entity.CustomerPreferenceEntity;
import edu.icet.mos.entity.ProductEntity;
import edu.icet.mos.repository.ProductRepository;
import edu.icet.mos.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
    public Product searchById(Integer id) {
        return mapper.map(repository.findById(id), Product.class);
    }

    @Override
    public List<Product> searchByName(String name) {
        List<ProductEntity> byName = repository.findByNameContaining(name);
        List<Product> productList = new ArrayList<>();

        byName.forEach(productEntity -> {
            productList.add(mapper.map(productEntity, Product.class));
        });
        return productList;
    }

    @Override
    public void update(Product product) {
        repository.save(mapper.map(product, ProductEntity.class));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

}
