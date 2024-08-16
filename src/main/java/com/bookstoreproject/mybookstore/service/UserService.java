package com.bookstoreproject.mybookstore.service;

import com.bookstoreproject.mybookstore.Exceptions.UserNotFoundException;
import com.bookstoreproject.mybookstore.dto.UserDTO;
import com.bookstoreproject.mybookstore.entity.Cart;
import com.bookstoreproject.mybookstore.entity.User;
import com.bookstoreproject.mybookstore.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.OptimisticLockingFailureException;

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
    @Cacheable(value = "users")
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(user -> modelMapper.map(user, UserDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#id")
    public UserDTO getUserById(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        return modelMapper.map(user, UserDTO.class);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "users", key = "#username")
    public UserDTO getUserByUsername(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return modelMapper.map(user, UserDTO.class);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void updateUser(Long id, UserDTO userDTO) throws UserNotFoundException {
        try {
            User existingUser = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));

            existingUser.setUsername(userDTO.getUsername());
            existingUser.setName(userDTO.getName());
            existingUser.setAddress(userDTO.getAddress());
            existingUser.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            userRepository.save(existingUser);
        } catch (OptimisticLockingFailureException e) {
            throw new UserNotFoundException("Conflict occurred while updating user with id: " + id);
        }
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void deleteUser(Long id) throws UserNotFoundException {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public User addAdmin(String username, String password, String address, String name, String role) {
        User admin = new User();
        admin.setUsername(username);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setRole(role);
        admin.setAddress(address);
        admin.setName(name);
        return userRepository.save(admin);
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "userExistence", key = "#username")
    public boolean checkIfUserExists(String username) {
        return userRepository.existsByUsername(username);
    }

    @Transactional
    @Cacheable(value = "userId", key = "#username")
    public Long getUserIdByUsername(String username) throws UserNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        return user.getId();
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void updateName(String username, String newName) throws UserNotFoundException {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
            user.setName(newName);
            userRepository.save(user);
        } catch (OptimisticLockingFailureException e) {
            throw new UserNotFoundException("Conflict occurred while updating name for user with username: " + username);
        }
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void updateAddress(String username, String newAddress) throws UserNotFoundException {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
            user.setAddress(newAddress);
            userRepository.save(user);
        } catch (OptimisticLockingFailureException e) {
            throw new UserNotFoundException("Conflict occurred while updating address for user with username: " + username);
        }
    }

    @Transactional
    @CacheEvict(value = "users", allEntries = true)
    public void updatePassword(String username, String newPassword) throws UserNotFoundException {
        try {
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
        } catch (OptimisticLockingFailureException e) {
            throw new UserNotFoundException("Conflict occurred while updating password for user with username: " + username);
        }
    }
}
