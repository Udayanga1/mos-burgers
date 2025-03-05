package edu.icet.mos.service.impl;

import edu.icet.mos.dto.CustomerPreference;
import edu.icet.mos.entity.CustomerPreferenceEntity;
import edu.icet.mos.repository.CustomerPreferenceRepository;
import edu.icet.mos.service.CustomerPreferenceService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerPreferenceServiceImpl implements CustomerPreferenceService {
    final CustomerPreferenceRepository repository;
    final ModelMapper mapper;

    public void addPreference(CustomerPreference customerPreference) {
        repository.save(mapper.map(customerPreference, CustomerPreferenceEntity.class));
    }

    @Override
    public List<CustomerPreference> getAll() {
        List<CustomerPreference> preferenceList = new ArrayList<>();
        List<CustomerPreferenceEntity> all = repository.findAll();

        all.forEach(cutomerPreferenceEntity -> {
            preferenceList.add(mapper.map(cutomerPreferenceEntity, CustomerPreference.class));
        });

        return preferenceList;
    }

    @Override
    public CustomerPreference searchById(Integer id) {
        return mapper.map(repository.findById(id), CustomerPreference.class);
    }

    @Override
    public List<CustomerPreference> searchByPreference(String preference) {
        List<CustomerPreferenceEntity> byPreference = repository.findByPreferenceContaining(preference);
        List<CustomerPreference> preferenceList = new ArrayList<>();
        byPreference.forEach(preferenceEntity -> {
            preferenceList.add(mapper.map(preferenceEntity, CustomerPreference.class));
        });
        return preferenceList;
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }


}
