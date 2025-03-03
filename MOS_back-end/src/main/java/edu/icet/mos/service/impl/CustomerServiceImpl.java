package edu.icet.mos.service.impl;

import edu.icet.mos.dto.Customer;
import edu.icet.mos.dto.Product;
import edu.icet.mos.entity.CustomerEntity;
import edu.icet.mos.entity.ProductEntity;
import edu.icet.mos.repository.CustomerRepository;
import edu.icet.mos.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {
    final CustomerRepository repository;
    final ModelMapper mapper;

    @Override
    public void add(Customer customer) {
        repository.save(mapper.map(customer, CustomerEntity.class));
    }

    @Override
    public List<Customer> getAll() {
        List<Customer> customerList = new ArrayList<>();
        List<CustomerEntity> all = repository.findAll();
        all.forEach(customerEntity -> customerList.add(mapper.map(customerEntity, Customer.class)));
        return customerList;
    }

    @Override
    public Customer searchById(Integer id) {
        return mapper.map(repository.findById(id), Customer.class);
    }

    @Override
    public List<Customer> searchByName(String name) {
        List<CustomerEntity> byName = repository.findByName(name);
        List<Customer> customerList = new ArrayList<>();

        byName.forEach(customerEntity -> {
            customerList.add(mapper.map(customerEntity, Customer.class));
        });
        return customerList;
    }

    @Override
    public void update(Customer customer) {
        repository.save(mapper.map(customer, CustomerEntity.class));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }
}
