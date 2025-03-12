package edu.icet.mos.service;

import edu.icet.mos.dto.Order;
import edu.icet.mos.dto.OrderResponse;
import edu.icet.mos.entity.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderEntity add(Order order);
    List<OrderResponse> getAllOrders();
    OrderResponse getOrderById(Integer orderId);
    OrderEntity updateOrder(Integer orderId, Order order);
}
