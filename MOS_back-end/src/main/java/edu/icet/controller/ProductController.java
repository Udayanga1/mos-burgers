package edu.icet.controller;

import edu.icet.dto.Product;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {

    final ProductService service;
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public void addProduct(@RequestBody Product product){
        service.addProduct(product);
        System.out.println(product);
    }
}
