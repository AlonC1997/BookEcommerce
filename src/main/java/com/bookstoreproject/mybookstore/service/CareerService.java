package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.BookNotFoundException;
import com.bookstoreproject.mybookstore.Exceptions.CareerNotFoundException;
import com.bookstoreproject.mybookstore.dto.CareerDTO;
import com.bookstoreproject.mybookstore.entity.Career;
import com.bookstoreproject.mybookstore.repository.CareerRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.dao.OptimisticLockingFailureException;
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
    @Cacheable(value = "careersCache", key = "'allCareers'")
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
    @CacheEvict(value = "careersCache", key = "'allCareers'")
    public void createCareer(CareerDTO careerDTO) {
        Career career = modelMapper.map(careerDTO, Career.class);
        careerRepository.save(career);
    }

    @Transactional
    @CacheEvict(value = "careersCache", key = "'allCareers'")
    public void updateCareer(CareerDTO careerDTO) {
        try {
            Career career = careerRepository.findById(careerDTO.getId())
                    .orElseThrow(() -> new CareerNotFoundException("Career not found with id: " + careerDTO.getId()));

            career.setTitle(careerDTO.getTitle());
            career.setDescription(careerDTO.getDescription());
            career.setCategory(careerDTO.getCategory());
            career.setLocation(careerDTO.getLocation());
            career.setLevel(careerDTO.getLevel());
            career.setRequirements(careerDTO.getRequirements());
            career.setDatePosted(careerDTO.getDatePosted());
            career.setAvailable(careerDTO.isAvailable());

            careerRepository.save(career);
        } catch (OptimisticLockingFailureException e) {
            throw new CareerNotFoundException("Career update conflict for career: " + careerDTO.getId());
        }
    }

    @Transactional
    @CacheEvict(value = "careersCache", key = "'allCareers'")
    public void deleteCareer(Long id) {
        try{
            Career career = careerRepository.findById(id)
                    .orElseThrow(() -> new CareerNotFoundException("Career not found with id: " + id));

        careerRepository.delete(career);
        }catch (OptimisticLockingFailureException e) {
            throw new CareerNotFoundException("Carrer delete conflict for carrer: "+ id);
        }
    }
}

