package edu.icet.mos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Customer {
    Integer id;
    String name;
    Integer preferenceId;
    Integer points;
}
