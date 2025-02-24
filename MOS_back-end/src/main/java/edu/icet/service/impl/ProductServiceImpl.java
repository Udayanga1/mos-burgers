package edu.icet.service.impl;

import edu.icet.dto.Product;
import edu.icet.entity.ProductEntity;
import edu.icet.repository.ProductRepository;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    final ProductRepository repository;
    final ModelMapper mapper;

    @Override
    public void addProduct(Product product) {
        repository.save(mapper.map(product, ProductEntity.class));
    }
}
