package edu.icet.service.impl;

import edu.icet.dto.Customer;
import edu.icet.dto.Product;
import edu.icet.entity.CustomerEntity;
import edu.icet.entity.ProductEntity;
import edu.icet.repository.CustomerRepository;
import edu.icet.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    final CustomerRepository repository;
    final ModelMapper mapper;

    @Override
    public void addCustomer(Customer customer) {
        repository.save(mapper.map(customer, CustomerEntity.class));
    }

    @Override
    public List<Customer> getAll() {
        List<Customer> customerList = new ArrayList<>();
        List<CustomerEntity> all = repository.findAll();

        all.forEach(customerEntity -> {
            customerList.add(mapper.map(customerEntity, Customer.class));
        });

        return customerList;
    }

    @Override
    public Optional<Customer> findById(int id) {
        return repository.findById(id)
                .map(customerEntity -> mapper.map(customerEntity, Customer.class));
    }

    @Override
    public void updateCustomer(Customer customer) {
        if (repository.existsById(customer.getId())) {  // Check if product exists
            repository.save(mapper.map(customer, CustomerEntity.class)); // Save updated product
        } else {
            throw new RuntimeException("Customer not found with ID: " + customer.getId());
        }
    }

    @Override
    public void deleteCustomer(Integer id) {
        if (repository.existsById(id)) {  // Check if customer exists
            repository.deleteById(id);
        } else {
            throw new RuntimeException("Product not found with ID: " + id);
        }
    }
}
