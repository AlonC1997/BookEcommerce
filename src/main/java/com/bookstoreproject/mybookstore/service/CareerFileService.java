package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.repository.CareerFileRepository;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CareerFileService {

    @Autowired
    private CareerFileRepository careerFileRepository;

    @Autowired
    private CareerRepository careerRepository;

    public CareerFileDTO uploadFile(MultipartFile file, Long careerId) throws IOException {
        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        CareerFile careerFile = new CareerFile();
        careerFile.setFileName(file.getOriginalFilename());
        careerFile.setFileContent(file.getBytes());
        careerFile.setUploadDate(LocalDate.now());
        careerFile.setCareer(career);
        careerFile.setContentType(file.getContentType()); // Save content type

        CareerFile savedFile = careerFileRepository.save(careerFile);
        return convertToDTO(savedFile);
    }

    public CareerFileDTO getFileById(Long fileId) {
        Optional<CareerFile> fileOptional = careerFileRepository.findById(fileId);
        if (fileOptional.isPresent()) {
            CareerFile file = fileOptional.get();
            CareerFileDTO dto = convertToDTO(file);
            dto.setFileContent(file.getFileContent()); // Ensure file content is set
            dto.setContentType(file.getContentType()); // Ensure content type is set
            return dto;
        } else {
            throw new RuntimeException("File not found");
        }
    }


    public List<CareerFileDTO> getAllFiles() {
        List<CareerFile> files = careerFileRepository.findAll();
        return files.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private CareerFileDTO convertToDTO(CareerFile file) {
        CareerFileDTO dto = new CareerFileDTO();
        dto.setId(file.getId());
        dto.setFileName(file.getFileName());
        dto.setUploadDate(file.getUploadDate());
        dto.setCareerId(file.getCareer().getId());
        return dto;
    }

    public void deleteFile(Long fileId) {
        CareerFile careerFile = careerFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        careerFileRepository.delete(careerFile);
    }
}
