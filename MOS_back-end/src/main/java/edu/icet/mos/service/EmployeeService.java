package edu.icet.mos.service;

import edu.icet.mos.dto.Employee;
import edu.icet.mos.dto.Login;
import edu.icet.mos.payload.response.LoginMessage;

public interface EmployeeService {
    String add(Employee employee);

    LoginMessage loginEmployee(Login login);
}
