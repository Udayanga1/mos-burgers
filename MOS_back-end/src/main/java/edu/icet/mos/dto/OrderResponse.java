package edu.icet.mos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Integer orderId;
    private Integer customerId;
    private String customerName;
    private Integer customerPoints;
    private String customerContactNo;
    private Date orderDate;
    private String status;
    private Double totalPrice;
    private List<OrderDetailResponse> orderDetails;
}