package edu.icet.mos.repository;


import edu.icet.mos.entity.CustomerPreferenceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CustomerPreferenceRepository extends JpaRepository<CustomerPreferenceEntity, Integer> {
    List<CustomerPreferenceEntity> findByPreferenceContaining(String name);
}

