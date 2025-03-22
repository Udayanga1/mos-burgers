package edu.icet.mos.repository;

import edu.icet.mos.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Integer> {
    @Modifying
    @Transactional
    @Query(value = "UPDATE orders SET status = :status WHERE id = :customerId", nativeQuery = true)
    void updateStatus(@Param("status") String status, @Param("customerId") Integer customerId);
}
