package edu.icet.mos.controller;

import edu.icet.mos.dto.Payment;
import edu.icet.mos.dto.PaymentType;
import edu.icet.mos.service.PaymentService;
import edu.icet.mos.service.PaymentTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
@CrossOrigin
public class PaymentController {

    final PaymentTypeService pmtTypeService;
    final PaymentService service;

    @PostMapping("/add")
    public void add(@RequestBody Payment payment){
        System.out.println(payment);
        service.add(payment);
    }

    @PostMapping("/add-payment-type")
    public void addPaymentType(@RequestBody PaymentType paymentType){
        System.out.println(paymentType);
        pmtTypeService.add(paymentType);
    }
}
