package edu.icet.mos.controller;

import edu.icet.mos.dto.Order;
import edu.icet.mos.entity.OrderEntity;
import edu.icet.mos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin
public class OrderController {
    final OrderService orderService;

    @PostMapping("/add")
    public ResponseEntity<OrderEntity> createOrder(@RequestBody Order order) {
        System.out.println(order);
        OrderEntity orderEntity = orderService.add(order);
        return ResponseEntity.ok(orderEntity);
    }
}
