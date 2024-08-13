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


}
