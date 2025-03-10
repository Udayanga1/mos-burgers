package edu.icet.mos.service;

import edu.icet.mos.dto.Order;
import edu.icet.mos.entity.OrderEntity;

public interface OrderService {
    OrderEntity add(Order order);
}
