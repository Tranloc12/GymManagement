/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import com.nhom12.services.WorkoutService;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 *
 * @author HP
 */
@Controller
public class IndexController {
    @Autowired
    private WorkoutService workService;

    @Autowired
    private UserService userService;

    @RequestMapping("/")
    public String index(Model model, Principal principal) {
        model.addAttribute("Workout", this.workService.getWorkout());

        // Nếu user đã login và là admin, load admin data
        if (principal != null) {
            User currentUser = userService.getUserByUsername(principal.getName());
            model.addAttribute("currentUser", currentUser);

            if ("ROLE_ADMIN".equals(currentUser.getUserRole())) {
                // Load admin dashboard data
                List<User> users = userService.getUsers();
                model.addAttribute("users", users);

                // Thống kê tổng quan
                long totalUsers = users.size();
                long totalMembers = users.stream().filter(u -> "ROLE_MEMBER".equals(u.getUserRole())).count();
                long totalTrainers = users.stream().filter(u -> "ROLE_TRAINER".equals(u.getUserRole())).count();
                long totalManagers = users.stream().filter(u -> "ROLE_MANAGER".equals(u.getUserRole())).count();
                long totalAdmins = users.stream().filter(u -> "ROLE_ADMIN".equals(u.getUserRole())).count();

                model.addAttribute("totalUsers", totalUsers);
                model.addAttribute("totalMembers", totalMembers);
                model.addAttribute("totalTrainers", totalTrainers);
                model.addAttribute("totalManagers", totalManagers);
                model.addAttribute("totalAdmins", totalAdmins);
            }
        }

        return "index";
    }
}
