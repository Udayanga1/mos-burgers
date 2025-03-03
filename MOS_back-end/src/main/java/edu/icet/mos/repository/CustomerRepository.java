package edu.icet.mos.repository;

import edu.icet.mos.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
    List<CustomerEntity> findByName(String name);
}
