package edu.icet.controller;

import edu.icet.dto.Product;
import edu.icet.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@CrossOrigin
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


//    public String printText(@RequestBody Map<String, String> request) {
//        String text = request.get("text"); // Extract text from JSON request
//        System.out.println("User Entered: " + text); // Print to console
//        return "Received: " + text;
//    }

    


}
