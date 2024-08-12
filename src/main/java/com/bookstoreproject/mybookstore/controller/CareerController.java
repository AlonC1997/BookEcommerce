package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.dto.CareerDTO;
import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.service.CareerService;
import com.bookstoreproject.mybookstore.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
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

    @PostMapping("/uploadFiles")
    public ResponseEntity<String> uploadFiles(@RequestParam Long careerId,
                                              @RequestParam("files") MultipartFile[] files) {
        try {
            careerService.uploadFiles(careerId, files);
            return new ResponseEntity<>("Files uploaded successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to upload files", HttpStatus.INTERNAL_SERVER_ERROR);
        }
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

    @GetMapping("/getAllFiles")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public List<CareerFileDTO> getAllFiles() {
        return careerService.getAllFiles();
    }

    @GetMapping("/getFile")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<Resource> getFile(@RequestParam Long fileId) {
        try {
            CareerFile careerFile = careerService.getFileById(fileId);
            Path file = Paths.get("uploads").resolve(careerFile.getFileName());
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String contentType = Files.probeContentType(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Path file = Paths.get("uploads").resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (!resource.exists()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String contentType = Files.probeContentType(file);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}

