/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.nhom12.controllers;

/**
 *
 * @author admin
 */

import com.nhom12.pojo.Review;
import com.nhom12.pojo.User;
import com.nhom12.services.ReviewService;
import com.nhom12.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private UserService userService;

    @GetMapping
    public String listReviews(Model model, Principal principal,
            @RequestParam(name = "subscriptionId", required = false) Integer subscriptionId) {

        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        // Thêm currentUser vào model để navbar hiển thị đúng
        model.addAttribute("currentUser", currentUser);

        if (subscriptionId != null) {
            model.addAttribute("reviews", reviewService.findBySubscriptionId(subscriptionId));
        } else {
            model.addAttribute("reviews", reviewService.findAll());
        }
        return "reviewList";
    }

    @GetMapping("/new")
    public String showReviewForm(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("currentUser", currentUser);
        model.addAttribute("review", new Review());
        return "reviewForm";
    }

    @PostMapping
    public String saveReview(@ModelAttribute Review review, RedirectAttributes redirectAttributes) {
        try {
            reviewService.save(review);
            redirectAttributes.addFlashAttribute("successMessage", "Đánh giá đã được thêm thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi khi thêm đánh giá: " + e.getMessage());
        }
        return "redirect:/reviews";
    }

    @GetMapping("/{id}/edit")
    public String showEditForm(@PathVariable("id") Integer id, Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("currentUser", currentUser);

        Review review = reviewService.findById(id);
        if (review != null) {
            model.addAttribute("review", review);
            return "reviewForm";
        }
        model.addAttribute("errorMessage", "Không tìm thấy đánh giá với ID: " + id);
        return "redirect:/reviews";
    }

    @PostMapping("/{id}")
    public String updateReview(@PathVariable("id") Integer id, @ModelAttribute Review review,
            RedirectAttributes redirectAttributes) {
        try {
            review.setId(id);
            reviewService.update(review);
            redirectAttributes.addFlashAttribute("successMessage", "Đánh giá đã được cập nhật thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi khi cập nhật đánh giá: " + e.getMessage());
        }
        return "redirect:/reviews";
    }

    @GetMapping("/{id}/delete")
    public String deleteReview(@PathVariable("id") Integer id, RedirectAttributes redirectAttributes) {
        try {
            Review review = reviewService.findById(id);
            if (review != null) {
                reviewService.delete(id);
                redirectAttributes.addFlashAttribute("successMessage", "Đánh giá đã được xóa thành công!");
            } else {
                redirectAttributes.addFlashAttribute("errorMessage", "Không tìm thấy đánh giá với ID: " + id);
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi khi xóa đánh giá: " + e.getMessage());
        }
        return "redirect:/reviews";
    }

    @GetMapping("/average")
    public String showAverageRating(@RequestParam("subscriptionId") Integer subscriptionId, Model model,
            Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        model.addAttribute("currentUser", currentUser);

        Double averageRating = reviewService.getAverageRatingBySubscriptionId(subscriptionId);
        model.addAttribute("subscriptionId", subscriptionId);
        model.addAttribute("averageRating", averageRating);
        return "averageRating";
    }
}