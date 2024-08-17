package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.dto.CareerDTO;
import com.bookstoreproject.mybookstore.service.CareerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/careers")
public class CareerController {

    @Autowired
    private CareerService careerService;

    @GetMapping("/getAllCareers")
    public List<CareerDTO> getAllCareers() {
        return careerService.getAllCareers();
    }

    @GetMapping("/getCareerById")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public CareerDTO getCareerById(@RequestParam Long id) {
        return careerService.getCareerById(id);
    }

    @PostMapping("/createCareer")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<String> createCareer(@RequestBody CareerDTO careerDTO) {
        try {
            careerService.createCareer(careerDTO);
            return new ResponseEntity<>("Career created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create career", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /* This method was added to create multiple careers at once, so its will look nicely in carrer site. you wont see any other use of it in frontend code.*/
    @PostMapping("/createCareers")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<String> createCareers(@RequestBody List<CareerDTO> careerDTOs) {
        try {
            for (CareerDTO careerDTO : careerDTOs) {
                careerService.createCareer(careerDTO);
            }
            return new ResponseEntity<>("Careers created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to create careers", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateCareer")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<String> updateCareer(@RequestParam Long id,
                                               @RequestBody CareerDTO careerDTO) {
        try {
            careerDTO.setId(id);
            careerService.updateCareer(careerDTO);
            return new ResponseEntity<>("Career updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to update career", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteCareer")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<String> deleteCareer(@RequestParam Long id) {
        try {
            careerService.deleteCareer(id);
            return new ResponseEntity<>("Career deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete career", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

