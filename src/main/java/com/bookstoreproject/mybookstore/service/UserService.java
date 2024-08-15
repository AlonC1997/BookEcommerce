package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.UserDTO;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.cache.annotation.Cacheable;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
    }
    @Transactional(readOnly = true)
    public Long getLoggedInUserCartId(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));

        Cart cart = Optional.ofNullable(user.getCart())
                .orElseThrow(() -> new UserNotFoundException("Cart not found for user with username: " + username));

        return cart.getId();
    }

    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a user by ID and maps to UserDTO.
     * Throws UserNotFoundException if the user is not found.
     */
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserDTO.class);
    }

    /**
     * Retrieves a user by username and maps to UserDTO.
     * Caches the result to improve performance.
     */
    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#username")
    public UserDTO getUserByUsername(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return modelMapper.map(user, UserDTO.class);
    }

    @Transactional
    public void updateUser(Long id, UserDTO userDTO) throws UserNotFoundException {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

        existingUser.setUsername(userDTO.getUsername());
        existingUser.setName(userDTO.getName());
        existingUser.setAddress(userDTO.getAddress());
        existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

        userRepository.save(existingUser);
    }

    @Transactional
    public void deleteUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }


    @Transactional
    public User addAdmin(String username, String password, String address, String name, String role) {
        User admin = new User();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(role);
        admin.setAddress(address);
        admin.setName(name);
        return userRepository.save(admin);
    }

    @Transactional
    public boolean checkIfUserExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional(readOnly = true)
    public Long getUserIdByUsername(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return user.getId();
    }

    @Transactional
    public void updateName(String username, String newName) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        user.setName(newName);
        userRepository.save(user);
    }

    @Transactional
    public void updateAddress(String username, String newAddress) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        user.setAddress(newAddress);
        userRepository.save(user);
    }

    @Transactional
    public void updatePassword(String username, String newPassword) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
