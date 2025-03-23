package edu.icet.mos.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Employee {
    private Integer id;
    private String name;
    private String email;
    private String password;
}
