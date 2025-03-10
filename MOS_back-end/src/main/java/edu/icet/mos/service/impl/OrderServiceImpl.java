package edu.icet.mos.service.impl;

import edu.icet.mos.dto.Order;
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
    final OrderDetailRepository orderDetailRepository;
    final CustomerRepository customerRepository;
    final ProductRepository productRepository;

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

        orderEntity.setOrderDetails(orderDetails);
        orderEntity.setTotalPrice(orderDetails.stream().mapToDouble(OrderDetailEntity::getPrice).sum());

        return orderRepository.save(orderEntity);
    }
}
