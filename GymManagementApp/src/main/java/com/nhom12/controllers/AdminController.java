package com.nhom12.controllers;

import com.nhom12.pojo.User;
import com.nhom12.services.UserService;
import com.nhom12.services.SubscriptionService;
import com.nhom12.services.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private WorkoutService workoutService;

    @GetMapping("/")
    public String index(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        // Lấy danh sách tất cả users
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
        model.addAttribute("currentUser", currentUser);

        return "index";
    }

    @GetMapping("/reports")
    public String reports(Model model, Principal principal,
            @RequestParam(name = "month", required = false) Integer month,
            @RequestParam(name = "year", required = false) Integer year) {

        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        // Nếu không có tham số, sử dụng tháng/năm hiện tại
        Calendar cal = Calendar.getInstance();
        if (month == null)
            month = cal.get(Calendar.MONTH) + 1;
        if (year == null)
            year = cal.get(Calendar.YEAR);

        model.addAttribute("selectedMonth", month);
        model.addAttribute("selectedYear", year);
        model.addAttribute("currentUser", currentUser);

        // Thống kê hội viên
        Map<String, Object> memberStats = getMemberStatistics(month, year);
        model.addAttribute("memberStats", memberStats);

        // Thống kê doanh thu
        Map<String, Object> revenueStats = getRevenueStatistics(month, year);
        model.addAttribute("revenueStats", revenueStats);

        // Thống kê sử dụng phòng tập theo khung giờ
        Map<String, Object> usageStats = getUsageStatistics(month, year);
        model.addAttribute("usageStats", usageStats);

        return "reports";
    }

    private Map<String, Object> getMemberStatistics(int month, int year) {
        Map<String, Object> stats = new HashMap<>();

        // Tổng số hội viên
        List<User> allMembers = userService.getUsersByRole("ROLE_MEMBER");
        stats.put("totalMembers", allMembers.size());

        // Hội viên mới trong tháng
        Calendar startOfMonth = Calendar.getInstance();
        startOfMonth.set(year, month - 1, 1, 0, 0, 0);
        Calendar endOfMonth = Calendar.getInstance();
        endOfMonth.set(year, month - 1, endOfMonth.getActualMaximum(Calendar.DAY_OF_MONTH), 23, 59, 59);

        // Tạm thời set newMembers = 0 vì User entity không có createdDate field
        long newMembers = 0;
        stats.put("newMembers", newMembers);

        // Hội viên đang hoạt động (có subscription active)
        long activeMembers = allMembers.stream()
                .filter(u -> {
                    try {
                        return subscriptionService.getActiveSubscription(u) != null;
                    } catch (Exception e) {
                        return false;
                    }
                })
                .count();
        stats.put("activeMembers", activeMembers);

        return stats;
    }

    private Map<String, Object> getRevenueStatistics(int month, int year) {
        Map<String, Object> stats = new HashMap<>();

        // Lấy tất cả subscription trong tháng
        Calendar startOfMonth = Calendar.getInstance();
        startOfMonth.set(year, month - 1, 1, 0, 0, 0);
        Calendar endOfMonth = Calendar.getInstance();
        endOfMonth.set(year, month - 1, endOfMonth.getActualMaximum(Calendar.DAY_OF_MONTH), 23, 59, 59);

        // Tính tổng doanh thu từ subscription
        double totalRevenue = subscriptionService.getAll().stream()
                .filter(s -> s.getStartDate().after(startOfMonth.getTime()) &&
                        s.getStartDate().before(endOfMonth.getTime()))
                .mapToDouble(s -> s.getPackageId().getPrice())
                .sum();

        stats.put("totalRevenue", totalRevenue);
        stats.put("formattedRevenue", String.format("%,.0f", totalRevenue));

        // Số lượng subscription mới
        long newSubscriptions = subscriptionService.getAll().stream()
                .filter(s -> s.getStartDate().after(startOfMonth.getTime()) &&
                        s.getStartDate().before(endOfMonth.getTime()))
                .count();
        stats.put("newSubscriptions", newSubscriptions);

        return stats;
    }

    private Map<String, Object> getUsageStatistics(int month, int year) {
        Map<String, Object> stats = new HashMap<>();

        // Lấy tất cả workout trong tháng
        Calendar startOfMonth = Calendar.getInstance();
        startOfMonth.set(year, month - 1, 1, 0, 0, 0);
        Calendar endOfMonth = Calendar.getInstance();
        endOfMonth.set(year, month - 1, endOfMonth.getActualMaximum(Calendar.DAY_OF_MONTH), 23, 59, 59);

        List<Map<String, Object>> workouts = workoutService.getAll().stream()
                .filter(w -> w.getStartTime().after(startOfMonth.getTime()) &&
                        w.getStartTime().before(endOfMonth.getTime()))
                .filter(w -> "APPROVED".equals(w.getStatus()))
                .map(w -> {
                    Map<String, Object> workoutData = new HashMap<>();
                    Calendar cal = Calendar.getInstance();
                    cal.setTime(w.getStartTime());
                    workoutData.put("hour", cal.get(Calendar.HOUR_OF_DAY));
                    workoutData.put("dayOfWeek", cal.get(Calendar.DAY_OF_WEEK));
                    return workoutData;
                })
                .collect(Collectors.toList());

        // Thống kê theo khung giờ
        Map<Integer, Long> hourlyUsage = workouts.stream()
                .collect(Collectors.groupingBy(
                        w -> (Integer) w.get("hour"),
                        Collectors.counting()));

        // Tạo dữ liệu cho chart (24 giờ)
        List<Map<String, Object>> hourlyData = new ArrayList<>();
        for (int hour = 0; hour < 24; hour++) {
            Map<String, Object> data = new HashMap<>();
            data.put("hour", hour);
            data.put("count", hourlyUsage.getOrDefault(hour, 0L));
            data.put("label", String.format("%02d:00", hour));
            hourlyData.add(data);
        }

        stats.put("hourlyUsage", hourlyData);
        stats.put("totalWorkouts", workouts.size());

        // Tìm khung giờ peak
        int peakHour = hourlyUsage.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(0);
        stats.put("peakHour", String.format("%02d:00", peakHour));

        return stats;
    }

    @GetMapping("/users")
    public String users(Model model, Principal principal) {
        // Kiểm tra quyền admin
        if (principal == null) {
            return "redirect:/login";
        }

        User currentUser = userService.getUserByUsername(principal.getName());
        if (!"ROLE_ADMIN".equals(currentUser.getUserRole())) {
            return "redirect:/";
        }

        List<User> users = userService.getUsers();
        model.addAttribute("users", users);
        model.addAttribute("currentUser", currentUser);

        return "admin/users";
    }
}
