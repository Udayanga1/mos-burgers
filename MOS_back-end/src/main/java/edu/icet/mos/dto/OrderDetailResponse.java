package edu.icet.mos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderDetailResponse {
    private Integer productId;
    private String productName;
    private Double productPrice;
    private Double productDiscount;
    private String productCategory;
    private String productImageUrl;
    private Integer quantity;
    private Double price;
}
