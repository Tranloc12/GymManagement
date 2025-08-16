/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.repositories.impl;

/**
 *
 * @author HP
 */
import com.nhom12.pojo.Review;
import com.nhom12.repositories.ReviewRepository;
import java.util.List;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author HP
 */
@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Review save(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(review);
        s.flush();
        return review;
    }

    @Override
    public Review update(Review review) {
        Session s = this.factory.getObject().getCurrentSession();
        s.update(review);
        return review;
    }

    @Override
    public void delete(Integer id) {
        Session s = this.factory.getObject().getCurrentSession();
        Review review = s.get(Review.class, id);
        if (review != null) {
            s.delete(review);
        }
    }

    @Override
    public Review findById(Integer id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(Review.class, id);
    }

    @Override
    public List<Review> findAll() {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery("FROM Review", Review.class);
        return q.getResultList();
    }

    @Override
    public List<Review> findBySubscriptionId(Integer subscriptionId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery("FROM Review r WHERE r.subscriptionId.id = :subscriptionId", Review.class);
        q.setParameter("subscriptionId", subscriptionId);
        return q.getResultList();
    }

    @Override
    public List<Review> findByRating(Integer rating) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery("FROM Review r WHERE r.rating = :rating", Review.class);
        q.setParameter("rating", rating);
        return q.getResultList();
    }

    @Override
    public Double getAverageRatingBySubscriptionId(Integer subscriptionId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Double> q = s.createQuery(
                "SELECT AVG(r.rating) FROM Review r WHERE r.subscriptionId.id = :subscriptionId", Double.class);
        q.setParameter("subscriptionId", subscriptionId);
        Double result = q.uniqueResult();
        return result != null ? result : 0.0;
    }

    @Override
    public List<Review> findByMemberId(Integer memberId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery(
                "FROM Review r WHERE r.subscriptionId.memberId.id = :memberId", Review.class);
        q.setParameter("memberId", memberId);
        return q.getResultList();
    }

    @Override
    public List<Review> findByTrainerId(Integer trainerId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery(
                "FROM Review r WHERE r.subscriptionId.trainerId.id = :trainerId", Review.class);
        q.setParameter("trainerId", trainerId);
        return q.getResultList();
    }

    @Override
    public List<Review> findByPackageIdWithPagination(Integer packageId, int page, int size) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Review> q = s.createQuery(
                "FROM Review r WHERE r.subscriptionId.packageId.id = :packageId ORDER BY r.createdAt DESC",
                Review.class);
        q.setParameter("packageId", packageId);
        q.setFirstResult(page * size);
        q.setMaxResults(size);
        return q.getResultList();
    }

    @Override
    public long countByPackageId(Integer packageId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Long> q = s.createQuery(
                "SELECT COUNT(r) FROM Review r WHERE r.subscriptionId.packageId.id = :packageId",
                Long.class);
        q.setParameter("packageId", packageId);
        return q.uniqueResult();
    }

    @Override
    public Double getAverageRatingByPackageId(Integer packageId) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Double> q = s.createQuery(
                "SELECT AVG(CAST(r.rating AS double)) FROM Review r WHERE r.subscriptionId.packageId.id = :packageId",
                Double.class);
        q.setParameter("packageId", packageId);
        Double result = q.uniqueResult();
        return result != null ? result : 0.0;
    }

}
