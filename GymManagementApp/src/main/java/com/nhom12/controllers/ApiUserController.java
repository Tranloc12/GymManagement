package com.nhom12.controllers;

import com.nhom12.dto.LoginRequest;
import com.nhom12.dto.UserForm2;
import com.nhom12.dto.UserForm;
import com.nhom12.pojo.MemberInfo;
import com.nhom12.pojo.User;
import com.nhom12.services.MemberInfoService;
import com.nhom12.services.UserService;
import com.nhom12.utils.JwtUtils;
import java.security.Principal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiUserController {

    @Autowired
    private UserService userService;

    @Autowired
    private MemberInfoService memService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Đăng ký người dùng mới
    @PostMapping(path = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Transactional
    public ResponseEntity<String> create(@RequestBody UserForm userForm) throws ParseException {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

        User user = new User();
        user.setUsername(userForm.getUsername());
        user.setPassword(this.passwordEncoder.encode(userForm.getPassword()));
        user.setEmail(userForm.getEmail());
        user.setUserRole("ROLE_MEMBER");
        user.setDob(sdf.parse(userForm.getDob()));
        user.setIsActive(true);
        this.userService.saveUser(user);

        MemberInfo memInfo = new MemberInfo();
        memInfo.setGoal(userForm.getGoal());
        memInfo.setHeight(Integer.valueOf(userForm.getHeight()));
        memInfo.setWeight(Integer.valueOf(userForm.getWeight()));
        memInfo.setTrainingProgressSet(new HashSet<>());
        memInfo.setUserId(user);
        this.memService.addMemberInfo(memInfo);

        return new ResponseEntity<>("Đăng ký thành công!", HttpStatus.CREATED);
    }

    // Đăng nhập
    @PostMapping("/login")
    @CrossOrigin
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            String username = loginRequest.getUsername();
            String password = loginRequest.getPassword();

            if (username == null || password == null) {
                return ResponseEntity.badRequest().body("Thiếu username hoặc password");
            }

            User userInDb = userService.getUserByUsername(username);
            if (userInDb == null || !passwordEncoder.matches(password, userInDb.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai thông tin đăng nhập");
            }

            String token = JwtUtils.generateToken(username);
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống");
        }
    }

    // Lấy thông tin người dùng hiện tại
    @GetMapping("/secure/current-user")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        // try {
        System.out.println("user name ============= " + principal.getName());
        User user = userService.getUserByUsername(principal.getName());
        return new ResponseEntity<>(user, HttpStatus.OK);
        // } catch (Exception e) {
        // return ResponseEntity.status(HttpStatus.NOT_FOUND)
        // .body(Collections.singletonMap("error", "Người dùng không tồn tại"));
        // }
    }

    // Cập nhật thông tin người dùng
    @PatchMapping(path = "/secure/current-user", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUser(
            Principal principal,
            @RequestParam Map<String, String> params) {
        try {
            User currentUser = userService.getUserByUsername(principal.getName());

            if (params.containsKey("email")) {
                currentUser.setEmail(params.get("email"));
            }

            if (params.containsKey("dob")) {
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                currentUser.setDob(sdf.parse(params.get("dob")));
            }

            User updatedUser = userService.updateUser(currentUser);
            return ResponseEntity.ok(updatedUser);

        } catch (ParseException e) {
            return ResponseEntity.badRequest().body(
                    Collections.singletonMap("error", "Định dạng ngày không hợp lệ (yyyy-MM-dd)"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Lỗi cập nhật"));
        }
    }

    // Đổi mật khẩu
    @PatchMapping(path = "/secure/change-password", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> changePassword(
            Principal principal,
            @RequestBody Map<String, String> passwords) {

        try {
            User user = userService.getUserByUsername(principal.getName());
            String oldPassword = passwords.get("oldPassword");
            String newPassword = passwords.get("newPassword");

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Collections.singletonMap("error", "Mật khẩu cũ không chính xác"));
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userService.updateUser(user);
            return ResponseEntity.ok().body(Collections.singletonMap("message", "Đổi mật khẩu thành công"));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Lỗi hệ thống"));
        }
    }

    @GetMapping("/trainers")
    public List<User> getAllTrainers() {
        return userService.getUsersByRole("ROLE_TRAINER");
    }

    @GetMapping("/members")
    public List<User> getAllMembers() {
        return userService.getUsersByRole("ROLE_MEMBER");
    }

    @GetMapping("/secure/users/trainers")
    public ResponseEntity<List<User>> getSecureTrainers() {
        try {
            List<User> trainers = userService.getUsersByRole("ROLE_TRAINER");
            return new ResponseEntity<>(trainers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/secure/trainers")
    public ResponseEntity<List<User>> getSecureTrainersShort() {
        try {
            List<User> trainers = userService.getUsersByRole("ROLE_TRAINER");
            return new ResponseEntity<>(trainers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
