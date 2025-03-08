package edu.icet.mos.controller;

import edu.icet.mos.dto.Customer;
import edu.icet.mos.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@RequiredArgsConstructor
@CrossOrigin
public class CustomerController {
    final CustomerService service;

    @PostMapping("/add")
    public void add(@RequestBody Customer customer){
        service.add(customer);
        System.out.println(customer);
    }

    @GetMapping("/all")
    public List<Customer> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Customer searchById(@PathVariable Integer id){
        return service.searchById(id);
    }

    @GetMapping("/search/{name}")
    public List<Customer> searchByName(@PathVariable String name){
        return service.searchByName(name);
    }

    @PutMapping("/update")
    public void update(@RequestBody Customer customer){
        service.update(customer);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}
