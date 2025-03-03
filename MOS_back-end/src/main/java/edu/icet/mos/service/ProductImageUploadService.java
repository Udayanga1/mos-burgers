package edu.icet.mos.service;

import org.springframework.web.multipart.MultipartFile;

public interface ProductImageUploadService {
    void upload(MultipartFile file);
}
