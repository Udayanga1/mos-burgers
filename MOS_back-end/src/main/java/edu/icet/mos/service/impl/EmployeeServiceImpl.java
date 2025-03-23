package edu.icet.mos.service.impl;

import edu.icet.mos.dto.Employee;
import edu.icet.mos.dto.Login;
import edu.icet.mos.entity.EmployeeEntity;
import edu.icet.mos.payload.response.LoginMessage;
import edu.icet.mos.repository.EmployeeRepository;
import edu.icet.mos.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    final EmployeeRepository repository;
    final PasswordEncoder passwordEncoder;

    @Override
    public String add(Employee employee) {
        EmployeeEntity employeeEntity = new EmployeeEntity(
                employee.getId(),
                employee.getName(),
                employee.getEmail(),
                this.passwordEncoder.encode(employee.getPassword())
        );

        repository.save(employeeEntity);

        return employeeEntity.getName();
    }


    @Override
    public LoginMessage loginEmployee(Login login) {
        String message = "";
        EmployeeEntity employeeEntity1 = repository.findByEmail(login.getEmail());
        if (employeeEntity1 != null) {
            String password = login.getPassword();
            String encodedPassword = employeeEntity1.getPassword();
            Boolean isPasswordRight = passwordEncoder.matches(password, encodedPassword);

            if (isPasswordRight) {
                Optional<EmployeeEntity> employeeEntity = repository.findOneByEmailAndPassword(login.getEmail(), encodedPassword);
                if (employeeEntity.isPresent()) {
                    return new LoginMessage("Login Success:", true);
                } else {
                    return new LoginMessage("Login Failed", false);
                }
            } else {
                return new LoginMessage("Password is Not Correct", false);
            }
        } else {
            return new LoginMessage("Email is Not Correct", false);
        }
    }
}
