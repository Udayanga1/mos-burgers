package edu.icet.mos.service;

import edu.icet.mos.dto.CustomerPreference;

import java.util.List;

public interface CustomerPreferenceService {
    void addPreference(CustomerPreference customerPreference);

    List<CustomerPreference> getAll();

    CustomerPreference searchById(Integer id);

    List<CustomerPreference> searchByPreference(String name);

    void delete(Integer id);
}

