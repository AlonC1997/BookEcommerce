package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.dto.CareerDTO;
import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.repository.CareerFileRepository;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareerService {

    @Autowired
    private CareerRepository careerRepository;

    @Autowired
    private CareerFileRepository careerFileRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Transactional
    public List<CareerDTO> getAllCareers() {
        List<Career> careers = careerRepository.findAll();
        return careers.stream()
                .map(career -> modelMapper.map(career, CareerDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public CareerDTO getCareerById(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career not found"));
        return modelMapper.map(career, CareerDTO.class);
    }

    @Transactional
    public void createCareer(CareerDTO careerDTO) {
        Career career = new Career();
        modelMapper.map(careerDTO, career);
        careerRepository.save(career);
    }

    @Transactional
    public void updateCareer(CareerDTO careerDTO) {
        Career career = careerRepository.findById(careerDTO.getId())
                .orElseThrow(() -> new RuntimeException("Career not found"));

        career.setDatePosted(careerDTO.getDatePosted());
        career.setAvailable(careerDTO.isAvailable());
        career.setLocation(careerDTO.getLocation());
        career.setCategory(careerDTO.getCategory());
        career.setTitle(careerDTO.getTitle());
        career.setDescription(careerDTO.getDescription());
        career.setLevel(careerDTO.getLevel());
        career.setRequirements(careerDTO.getRequirements());

        careerRepository.save(career);
    }

    @Transactional
    public void deleteCareer(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Career not found"));
        careerRepository.delete(career);
    }

    @Transactional
    public void uploadFiles(Long careerId, MultipartFile[] files) throws IOException {
        Career career = careerRepository.findById(careerId)
                .orElseThrow(() -> new RuntimeException("Career not found"));

        for (MultipartFile file : files) {
            CareerFile careerFile = new CareerFile();
            careerFile.setFileName(file.getOriginalFilename());
            careerFile.setFileContent(file.getBytes());
            careerFile.setCareer(career);
            careerFileRepository.save(careerFile);
        }
    }

    @Transactional
    public CareerFile getFileById(Long fileId) {
        return careerFileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Transactional
    public List<CareerFileDTO> getAllFiles() {
        List<CareerFile> careerFiles = careerFileRepository.findAll();
        return careerFiles.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CareerFileDTO convertToDTO(CareerFile careerFile) {
        CareerFileDTO dto = new CareerFileDTO();
        dto.setId(careerFile.getId());
        dto.setFileName(careerFile.getFileName());
        dto.setFileType(careerFile.getFileType());
        return dto;
    }

}
