package edu.icet.mos.service.impl;

import edu.icet.mos.dto.Order;
import edu.icet.mos.dto.OrderDetailResponse;
import edu.icet.mos.dto.OrderResponse;
import edu.icet.mos.entity.CustomerEntity;
import edu.icet.mos.entity.OrderDetailEntity;
import edu.icet.mos.entity.OrderEntity;
import edu.icet.mos.entity.ProductEntity;
import edu.icet.mos.repository.CustomerRepository;
import edu.icet.mos.repository.OrderDetailRepository;
import edu.icet.mos.repository.OrderRepository;
import edu.icet.mos.repository.ProductRepository;
import edu.icet.mos.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    final OrderRepository orderRepository;
    final CustomerRepository customerRepository;
    final ProductRepository productRepository;
    final OrderDetailRepository orderDetailRepository;

    @Override
    @Transactional
    public OrderEntity add(Order order) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(order.getOrderDate(), formatter);
        Date parsedDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        CustomerEntity customer = customerRepository.findById(order.getCustomerId())
                .orElseThrow(()->new RuntimeException("Customer not found"));
        OrderEntity orderEntity = new OrderEntity();
        orderEntity.setCustomer(customer);
        orderEntity.setOrderDate(parsedDate);
        orderEntity.setStatus(order.getStatus());

        List<OrderDetailEntity> orderDetails = order.getOrderDetails().stream().map(item -> {
            ProductEntity productEntity = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderDetailEntity orderDetail = new OrderDetailEntity();
            orderDetail.setOrder(orderEntity);
            orderDetail.setProduct(productEntity);
            orderDetail.setQuantity(item.getQty());
            orderDetail.setPrice(productEntity.getPrice() * item.getQty());

            return orderDetail;
        }).collect(Collectors.toList());

//        increase customer points by 150
        customerRepository.increasePointsBy150(order.getCustomerId());

        orderEntity.setOrderDetails(orderDetails);
        orderEntity.setTotalPrice(orderDetails.stream().mapToDouble(OrderDetailEntity::getPrice).sum());

        return orderRepository.save(orderEntity);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        List<OrderEntity> orders = orderRepository.findAll();

        return orders.stream().map(order -> new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getCustomer().getPoints(),
                order.getCustomer().getContactNo(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getOrderDetails().stream().map(detail -> new OrderDetailResponse(
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getProduct().getPrice(),
                        detail.getProduct().getDiscount(),
                        detail.getProduct().getCategory(),
                        detail.getProduct().getImageUrl(),
                        detail.getQuantity(),
                        detail.getPrice(),
                        detail.getProduct().getExpiryDate()
                )).collect(Collectors.toList())
        )).collect(Collectors.toList());
    }

    @Override
    public OrderResponse getOrderById(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        return new OrderResponse(
                order.getId(),
                order.getCustomer().getId(),
                order.getCustomer().getName(),
                order.getCustomer().getPoints(),
                order.getCustomer().getContactNo(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalPrice(),
                order.getOrderDetails().stream().map(detail -> new OrderDetailResponse(
                        detail.getProduct().getId(),
                        detail.getProduct().getName(),
                        detail.getProduct().getPrice(),
                        detail.getProduct().getDiscount(),
                        detail.getProduct().getCategory(),
                        detail.getProduct().getImageUrl(),
                        detail.getQuantity(),
                        detail.getPrice(),
                        detail.getProduct().getExpiryDate()
                )).collect(Collectors.toList())
        );
    }

    @Override
    @Transactional
    public OrderEntity updateOrder(Integer orderId, Order order) {
        OrderEntity existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate localDate = LocalDate.parse(order.getOrderDate(), formatter);
        Date parsedDate = Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());

        CustomerEntity customer = customerRepository.findById(order.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        existingOrder.setCustomer(customer);
        existingOrder.setOrderDate(parsedDate);
        existingOrder.setStatus(order.getStatus());

        // Clear existing order details properly to prevent orphan errors
        existingOrder.getOrderDetails().clear();

        List<OrderDetailEntity> updatedOrderDetails = order.getOrderDetails().stream().map(item -> {
            ProductEntity productEntity = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            OrderDetailEntity orderDetail = new OrderDetailEntity();
            orderDetail.setOrder(existingOrder);
            orderDetail.setProduct(productEntity);
            orderDetail.setQuantity(item.getQty());
            orderDetail.setPrice(productEntity.getPrice() * item.getQty());

            return orderDetail;
        }).collect(Collectors.toList());

        existingOrder.getOrderDetails().addAll(updatedOrderDetails);
        existingOrder.setTotalPrice(updatedOrderDetails.stream().mapToDouble(OrderDetailEntity::getPrice).sum());

        return orderRepository.save(existingOrder);
    }


}
