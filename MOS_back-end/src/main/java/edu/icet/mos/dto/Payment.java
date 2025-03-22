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
public class Payment {
    private Integer id;
    private Integer customerId;
    private Integer paymentTypeId;
    private Double amount;
    private Date paymentDate;
    private Integer orderId;
}
