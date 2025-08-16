/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "review")
@NamedQueries({
        @NamedQuery(name = "Review.findAll", query = "SELECT r FROM Review r"),
        @NamedQuery(name = "Review.findById", query = "SELECT r FROM Review r WHERE r.id = :id"),
        @NamedQuery(name = "Review.findByRating", query = "SELECT r FROM Review r WHERE r.rating = :rating"),
        @NamedQuery(name = "Review.findByReviewTrainer", query = "SELECT r FROM Review r WHERE r.reviewTrainer = :reviewTrainer"),
        @NamedQuery(name = "Review.findByReviewPack", query = "SELECT r FROM Review r WHERE r.reviewPack = :reviewPack"),
        @NamedQuery(name = "Review.findByReviewGym", query = "SELECT r FROM Review r WHERE r.reviewGym = :reviewGym"),
        @NamedQuery(name = "Review.findByCreatedAt", query = "SELECT r FROM Review r WHERE r.createdAt = :createdAt") })
public class Review implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "rating")
    private Integer rating;
    @Size(max = 250)
    @Column(name = "reviewTrainer")
    private String reviewTrainer;
    @Size(max = 250)
    @Column(name = "reviewPack")
    private String reviewPack;
    @Size(max = 250)
    @Column(name = "reviewGym")
    private String reviewGym;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    @Temporal(TemporalType.DATE)
    @Column(name = "createdAt")
    private Date createdAt;
    @JoinColumn(name = "subscriptionId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Subscription subscriptionId;

    public Review() {
    }

    public Review(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getReviewTrainer() {
        return reviewTrainer;
    }

    public void setReviewTrainer(String reviewTrainer) {
        this.reviewTrainer = reviewTrainer;
    }

    public String getReviewPack() {
        return reviewPack;
    }

    public void setReviewPack(String reviewPack) {
        this.reviewPack = reviewPack;
    }

    public String getReviewGym() {
        return reviewGym;
    }

    public void setReviewGym(String reviewGym) {
        this.reviewGym = reviewGym;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Subscription getSubscriptionId() {
        return subscriptionId;
    }

    public void setSubscriptionId(Subscription subscriptionId) {
        this.subscriptionId = subscriptionId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Review)) {
            return false;
        }
        Review other = (Review) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Review[ id=" + id + " ]";
    }

}
