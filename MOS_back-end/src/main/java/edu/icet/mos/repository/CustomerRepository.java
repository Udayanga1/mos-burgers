package edu.icet.mos.repository;

import edu.icet.mos.entity.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CustomerRepository extends JpaRepository<CustomerEntity, Integer> {
    List<CustomerEntity> findByName(String name);

    @Modifying
    @Transactional
    @Query(value = "UPDATE customer SET points = points + 150 WHERE id = :customerId", nativeQuery = true)
    void increasePointsBy150(@Param("customerId") Integer customerId);

    @Modifying
    @Transactional
    @Query(value = "UPDATE customer SET points = points - :points WHERE id = :customerId", nativeQuery = true)
    void decreasePoints(@Param("points") Double points, @Param("customerId") Integer customerId);
}
