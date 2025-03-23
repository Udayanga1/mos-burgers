package edu.icet.mos.controller;

import edu.icet.mos.dto.Employee;
import edu.icet.mos.dto.Login;
import edu.icet.mos.payload.response.LoginMessage;
import edu.icet.mos.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/employee")
@CrossOrigin
@RequiredArgsConstructor
public class EmployeeController {

    final EmployeeService service;

    @PostMapping("/add")
    public String saveEmployee(@RequestBody Employee employee){
        String name = service.add(employee);
        return name;
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginEmployee(@RequestBody Login login){
        LoginMessage loginMessage = service.loginEmployee(login);
        return ResponseEntity.ok(loginMessage);
    }
}
