/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.services.impl;

/**
 *
 * @author admin
 */
import com.nhom12.pojo.Review;
import com.nhom12.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import com.nhom12.services.ReviewService;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    @Override
    public Review update(Review review) {
        return reviewRepository.update(review);
    }

    @Override
    public void delete(Integer id) {
        reviewRepository.delete(id);
    }

    @Override
    public Review findById(Integer id) {
        return reviewRepository.findById(id);
    }

    @Override
    public List<Review> findAll() {
        return reviewRepository.findAll();
    }

    @Override
    public List<Review> findBySubscriptionId(Integer subscriptionId) {
        return reviewRepository.findBySubscriptionId(subscriptionId);
    }

    @Override
    public List<Review> findByRating(Integer rating) {
        return reviewRepository.findByRating(rating);
    }

    @Override
    public Double getAverageRatingBySubscriptionId(Integer subscriptionId) {
        return reviewRepository.getAverageRatingBySubscriptionId(subscriptionId);
    }

    @Override
    public List<Review> findByMemberId(Integer memberId) {
        return reviewRepository.findByMemberId(memberId);
    }

    @Override
    public List<Review> findByTrainerId(Integer trainerId) {
        return reviewRepository.findByTrainerId(trainerId);
    }

    @Override
    public List<Review> findByPackageIdWithPagination(Integer packageId, int page, int size) {
        return reviewRepository.findByPackageIdWithPagination(packageId, page, size);
    }

    @Override
    public long countByPackageId(Integer packageId) {
        return reviewRepository.countByPackageId(packageId);
    }

    @Override
    public Double getAverageRatingByPackageId(Integer packageId) {
        return reviewRepository.getAverageRatingByPackageId(packageId);
    }

}
