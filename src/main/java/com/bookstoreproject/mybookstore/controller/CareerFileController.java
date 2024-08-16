package com.bookstoreproject.mybookstore.controller;

import com.bookstoreproject.mybookstore.dto.CareerFileDTO;
import com.bookstoreproject.mybookstore.service.CareerFileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/career-files")
public class CareerFileController {

    private final CareerFileService careerFileService;

    public CareerFileController(CareerFileService careerFileService) {
        this.careerFileService = careerFileService;
    }

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

        // Encode the filename - this is needed to support special characters in the filename (e.g. spaces or hebrew characters in the filename)
        String encodedFileName = UriUtils.encode(file.getFileName(), StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + encodedFileName + "\"; filename*=UTF-8''" + encodedFileName)
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