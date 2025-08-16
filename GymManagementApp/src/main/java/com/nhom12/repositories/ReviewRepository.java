/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.repositories;

import com.nhom12.pojo.Review;
import java.util.List;

/**
 *
 * @author HP
 */
public interface ReviewRepository {
    Review save(Review review);

    Review update(Review review);

    void delete(Integer id);

    Review findById(Integer id);

    List<Review> findAll();

    List<Review> findBySubscriptionId(Integer subscriptionId);

    List<Review> findByRating(Integer rating);

    Double getAverageRatingBySubscriptionId(Integer subscriptionId);

    List<Review> findByMemberId(Integer memberId);

    List<Review> findByTrainerId(Integer trainerId);

    // Phân trang cho reviews theo package
    List<Review> findByPackageIdWithPagination(Integer packageId, int page, int size);

    long countByPackageId(Integer packageId);

    // Tính rating trung bình theo package
    Double getAverageRatingByPackageId(Integer packageId);
}
