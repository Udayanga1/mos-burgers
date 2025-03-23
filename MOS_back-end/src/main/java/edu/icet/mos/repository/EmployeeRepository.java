package edu.icet.mos.repository;

import edu.icet.mos.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Integer> {

    EmployeeEntity findByEmail(String email);

    Optional<EmployeeEntity> findOneByEmailAndPassword(String email, String password);
}
