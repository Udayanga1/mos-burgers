package edu.icet.mos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Product {
    Integer id;
    String name;
    Double price;
    Double discount;
    String category;
    String imageUrl;
    Date expiryDate;
    Integer qty;
}
