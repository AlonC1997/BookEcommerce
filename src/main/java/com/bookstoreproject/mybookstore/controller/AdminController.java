package com.bookstoreproject.mybookstore.controller;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import com.bookstoreproject.mybookstore.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    /* If trying to add admin only exist admin can connect throw postman "Basic Auth" and if exist can add a new admin*/
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/addAdmin")
    public ResponseEntity<Object> addAdmin(@RequestBody User admin) {
        User createdAdmin = adminService.addAdmin(admin.getUsername(), admin.getPassword(), admin.getAddress(),admin.getRole(), admin.getName());
        if (createdAdmin != null) {
            return ResponseEntity.ok("Admin was Saved!");
        }
        return ResponseEntity.status(404).body("Error 404, User not Saved!");
    }


}