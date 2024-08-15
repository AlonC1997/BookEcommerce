package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.CareerNotFoundException;
import com.bookstoreproject.mybookstore.dto.CareerDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareerService {

    private final CareerRepository careerRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public CareerService(CareerRepository careerRepository, ModelMapper modelMapper) {
        this.careerRepository = careerRepository;
        this.modelMapper = modelMapper;
    }

    @Transactional(readOnly = true)
    public List<CareerDTO> getAllCareers() {
        return careerRepository.findAll().stream()
                .map(career -> modelMapper.map(career, CareerDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CareerDTO getCareerById(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new CareerNotFoundException("Career not found with id: " + id));
        return modelMapper.map(career, CareerDTO.class);
    }

    @Transactional
    public void createCareer(CareerDTO careerDTO) {
        Career career = modelMapper.map(careerDTO, Career.class);
        careerRepository.save(career);
    }

    @Transactional
    public void updateCareer(CareerDTO careerDTO) {
        Career career = careerRepository.findById(careerDTO.getId())
                .orElseThrow(() -> new CareerNotFoundException("Career not found with id: " + careerDTO.getId()));
        modelMapper.map(careerDTO, career);
        careerRepository.save(career);
    }

    @Transactional
    public void deleteCareer(Long id) {
        Career career = careerRepository.findById(id)
                .orElseThrow(() -> new CareerNotFoundException("Career not found with id: " + id));
        careerRepository.delete(career);
    }
}
