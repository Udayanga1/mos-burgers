package edu.icet.mos.controller;

import edu.icet.mos.dto.Order;
import edu.icet.mos.dto.OrderResponse;
import edu.icet.mos.entity.OrderEntity;
import edu.icet.mos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer id) {
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<OrderEntity> updateOrder(@PathVariable Integer id, @RequestBody Order order) {
        OrderEntity updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }
}
