package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.Exceptions.ResourceNotFoundException;
import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.entity.CareerFile;
import com.bookstoreproject.mybookstore.service.CareerFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/career-files")
public class CareerFileController {

    @Autowired
    private CareerFileService careerFileService;

    @PostMapping("/uploadFile")
    public ResponseEntity<CareerFileDTO> uploadFile(@RequestParam("file") MultipartFile file,
                                                    @RequestParam("careerId") Long careerId) {
        try {
            CareerFileDTO fileDTO = careerFileService.uploadFile(file, careerId);
            return new ResponseEntity<>(fileDTO, HttpStatus.CREATED);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/download")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<Resource> downloadFile(@RequestParam Long fileId) {
        CareerFileDTO file = careerFileService.getFileById(fileId);
        if (file == null || file.getFileContent() == null) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayResource resource = new ByteArrayResource(file.getFileContent());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(file.getContentType() != null ? file.getContentType() : "application/octet-stream"))
                .contentLength(file.getFileContent().length)
                .body(resource);
    }




    @GetMapping("/getAllFiles")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<List<CareerFileDTO>> getAllFiles() {
        List<CareerFileDTO> files = careerFileService.getAllFiles();
        return ResponseEntity.ok(files);
    }

    @GetMapping("/getFileById")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<CareerFileDTO> getFileById(@RequestParam Long fileId) {
        CareerFileDTO file = careerFileService.getFileById(fileId);
        return file != null ? ResponseEntity.ok(file) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/deleteFile")
    @PreAuthorize("hasAuthority('MAIN_ADMIN')")
    public ResponseEntity<Void> deleteFile(@RequestParam Long fileId) {
        try {
            careerFileService.deleteFile(fileId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


}