package edu.icet.mos.repository;

import edu.icet.mos.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    List<ProductEntity> findByName(String name);
}
