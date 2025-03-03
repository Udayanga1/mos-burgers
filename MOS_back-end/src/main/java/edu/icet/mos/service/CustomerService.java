package edu.icet.mos.service;

import edu.icet.mos.dto.Customer;

import java.util.List;

public interface CustomerService {
    void add(Customer customer);

    List<Customer> getAll();

    Customer searchById(Integer id);

    List<Customer> searchByName(String name);

    void update(Customer customer);

    void delete(Integer id);
}
