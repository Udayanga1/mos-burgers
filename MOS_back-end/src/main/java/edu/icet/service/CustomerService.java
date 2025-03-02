package edu.icet.service;

import edu.icet.dto.Customer;
import edu.icet.dto.Product;
import io.micrometer.observation.ObservationFilter;

import java.util.List;
import java.util.Optional;

public interface CustomerService {
    void addCustomer(Customer customer);

    List<Customer> getAll();


    Optional<Customer> findById(int id);

    void updateCustomer(Customer customer);

    void deleteCustomer(Integer id);
}
