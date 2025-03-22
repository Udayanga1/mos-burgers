package edu.icet.mos.service.impl;

import edu.icet.mos.dto.PaymentType;
import edu.icet.mos.entity.PaymentTypeEntity;
import edu.icet.mos.repository.PaymentTypeRepository;
import edu.icet.mos.service.PaymentTypeService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentTypeServiceImpl implements PaymentTypeService {

    final PaymentTypeRepository repository;
    final ModelMapper mapper;

    @Override
    public void add(PaymentType paymentType) {
        repository.save(mapper.map(paymentType, PaymentTypeEntity.class));
    }
}
