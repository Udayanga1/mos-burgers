package edu.icet.mos.controller;

import edu.icet.mos.dto.Product;
import edu.icet.mos.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/product")
@CrossOrigin
@RequiredArgsConstructor
public class ProductController {
    final ProductService service;

    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody Product product){
        service.addProduct(product);
        System.out.println(product);
    }

    @GetMapping("/all")
    @ResponseStatus(HttpStatus.FOUND)
    public List<Product> getAll(){
        return service.getAll();
    }

    @GetMapping("/{id}")
    public Product searchById(@PathVariable Integer id){
        return service.searchById(id);
    }

    @GetMapping("/search/{name}")
    public List<Product> searchByName(@PathVariable String name){
        return service.searchByName(name);
    }

    @PutMapping("/update")
    public void update(@RequestBody Product product){
        service.update(product);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Integer id){
        service.delete(id);
    }
}
