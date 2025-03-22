package edu.icet.mos.service.impl;

import edu.icet.mos.dto.Payment;
import edu.icet.mos.entity.PaymentEntity;
import edu.icet.mos.repository.PaymentRepository;
import edu.icet.mos.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    final PaymentRepository repository;
    final ModelMapper mapper;

    @Override
    public void add(Payment payment) {
        repository.save(mapper.map(payment, PaymentEntity.class));
    }
}
