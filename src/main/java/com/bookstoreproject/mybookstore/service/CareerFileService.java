package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.repository.CareerFileRepository;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareerFileService {

    private final CareerFileRepository careerFileRepository;
    private final CareerRepository careerRepository;
    private final ModelMapper modelMapper;

    public CareerFileService(CareerFileRepository careerFileRepository, CareerRepository careerRepository, ModelMapper modelMapper) {
        this.careerFileRepository = careerFileRepository;
        this.careerRepository = careerRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional
    public CareerFileDTO uploadFile(MultipartFile file, Long careerId) throws IOException {
        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        CareerFile careerFile = new CareerFile();
        careerFile.setFileName(file.getOriginalFilename());
        careerFile.setFileContent(file.getBytes());
        careerFile.setUploadDate(LocalDate.now());
        careerFile.setCareer(career);
        careerFile.setContentType(file.getContentType());

        CareerFile savedFile = careerFileRepository.save(careerFile);
        return convertToDTO(savedFile);
    }

    @Transactional(readOnly = true)
    public CareerFileDTO getFileById(Long fileId) {
        CareerFile file = careerFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        CareerFileDTO dto = convertToDTO(file);
        dto.setFileContent(file.getFileContent());
        dto.setContentType(file.getContentType());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<CareerFileDTO> getAllFiles() {
        List<CareerFile> files = careerFileRepository.findAll();
        return files.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteFile(Long fileId) {
        CareerFile careerFile = careerFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        careerFileRepository.delete(careerFile);
    }

    private CareerFileDTO convertToDTO(CareerFile file) {
        return modelMapper.map(file, CareerFileDTO.class);
    }
}
