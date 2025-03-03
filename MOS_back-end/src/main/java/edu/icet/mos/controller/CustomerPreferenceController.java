package edu.icet.mos.controller;

import edu.icet.mos.dto.CustomerPreference;
import edu.icet.mos.service.CustomerPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer-preference")
@RequiredArgsConstructor
public class CustomerPreferenceController {
    final CustomerPreferenceService service;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody CustomerPreference customerPreference){
        service.addPreference(customerPreference);
        System.out.println(customerPreference);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.FOUND)
    public List<CustomerPreference> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.FOUND)
    public CustomerPreference searchById(@PathVariable Integer id){
        return service.searchById(id);
    }

    @GetMapping("/search/{preference}")
    @ResponseStatus(HttpStatus.FOUND)
    public List<CustomerPreference> searchByName(@PathVariable String preference){
        return service.searchByPreference(preference);
    }

    @DeleteMapping("/delete/{id}")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}
