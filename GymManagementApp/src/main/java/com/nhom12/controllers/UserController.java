/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.dto.UserForm2;
import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import jakarta.validation.Valid;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.security.Principal;

/**
 *
 * @author admin
 */
@Controller
public class UserController {

    @Autowired
    private UserService userServ;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @GetMapping("/login")
    public String loginView() {
        return "login";
    }

    @GetMapping("/users")
    public String addView(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("user", new UserForm2());
        return "addUser";
    }

    // @PostMapping("/add-user")
    // public String addUserView(@ModelAttribute(value = "user") User u) {
    // Map<String, String> params = new HashMap<>();
    // params.put("username", u.getUsername());
    // params.put("password", u.getPassword());
    // params.put("email", u.getEmail());
    // params.put("user_role", u.getUserRole());
    // params.put("dob", u.getDob().toString());
    // this.userServ.addUser(params);
    // return "addUser";
    // }
    @PostMapping("/add-user")
    public String addUserView(
            @ModelAttribute("user") @Valid UserForm2 userForm, // Sử dụng UserForm2
            BindingResult result, // Thêm BindingResult để xử lý validation
            Model model,
            RedirectAttributes redirectAttributes,
            Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }
        if (result.hasErrors()) {
            
            return "addUser";
        }

        try {
            // Map<String, String> params = new HashMap<>();
            // params.put("username", userForm.getUsername());
            // params.put("password", userForm.getPassword());
            // params.put("confirmPassword", userForm.getConfirmPassword());
            // params.put("email", userForm.getEmail());
            // params.put("user_role", userForm.getUserRole());
            // params.put("is_active", "1");
            // params.put("dob", userForm.getDob().toString());

            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date dob = dateFormat.parse(userForm.getDob().toString());
            User u = new User();
            u.setDob(dob);

            u.setEmail(userForm.getEmail());
            u.setUsername(userForm.getUsername());
            u.setPassword(this.passwordEncoder.encode(userForm.getPassword()));
            u.setUserRole(userForm.getUserRole());
            u.setIsActive(true);

            userServ.saveUser(u);

            redirectAttributes.addFlashAttribute("successMessage", "Thêm người dùng thành công!");
            return "redirect:/users";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Đăng ký thất bại: " + e.getMessage());
            return "addUser";
        }
    }

    @GetMapping("/trainers")
    public String listTrainers(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("trainers", userServ.getUsersByRole("ROLE_TRAINER"));
        return "trainerList"; // file trainerList.html
    }

    @GetMapping("/members")
    public String listMembers(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userServ.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("members", userServ.getUsersByRole("ROLE_MEMBER"));
        return "memberList"; // file memberList.html
    }
}
