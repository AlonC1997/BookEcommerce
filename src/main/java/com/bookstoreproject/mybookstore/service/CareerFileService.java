package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.repository.CareerFileRepository;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.bookstoreproject.mybookstore.Exceptions.CareerFileNotFoundException;
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
    @CacheEvict(value = "careerFiles", allEntries = true)
    public CareerFileDTO uploadFile(MultipartFile file, Long careerId) throws IOException {
        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        CareerFile careerFile = modelMapper.map(file, CareerFile.class);
        careerFile.setFileName(file.getOriginalFilename());
        careerFile.setFileContent(file.getBytes());
        careerFile.setUploadDate(LocalDate.now());
        careerFile.setCareer(career);
        careerFile.setContentType(file.getContentType());

        return convertToDTO(careerFileRepository.save(careerFile));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "careerFiles", key = "#fileId")
    public CareerFileDTO getFileById(Long fileId) {
        CareerFile file = careerFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        CareerFileDTO dto = convertToDTO(file);
        dto.setFileContent(file.getFileContent());
        dto.setContentType(file.getContentType());
        return dto;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "careerFiles")
    public List<CareerFileDTO> getAllFiles() {
        List<CareerFile> files = careerFileRepository.findAll();
        return files.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    @CacheEvict(value = "careerFiles", allEntries = true)
    public void deleteFile(Long fileId) {
        try {
            CareerFile file = careerFileRepository.findById(fileId)
                    .orElseThrow(() -> new CareerFileNotFoundException("File not found with id: " + fileId));
            careerFileRepository.delete(file);
        } catch (OptimisticLockingFailureException e) {
            throw new RuntimeException("Conflict occurred while deleting file with id: " + fileId, e);
        }
    }

    private CareerFileDTO convertToDTO(CareerFile file) {
        return modelMapper.map(file, CareerFileDTO.class);
    }
}
