/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Basic;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.Set;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "subscription")
@NamedQueries({
    @NamedQuery(name = "Subscription.findAll", query = "SELECT s FROM Subscription s"),
    @NamedQuery(name = "Subscription.findById", query = "SELECT s FROM Subscription s WHERE s.id = :id"),
    @NamedQuery(name = "Subscription.findByStartDate", query = "SELECT s FROM Subscription s WHERE s.startDate = :startDate"),
    @NamedQuery(name = "Subscription.findByEndDate", query = "SELECT s FROM Subscription s WHERE s.endDate = :endDate"),
    @NamedQuery(name = "Subscription.findByIsActive", query = "SELECT s FROM Subscription s WHERE s.isActive = :isActive"),
    @NamedQuery(name = "Subscription.findByPaymentStatus", query = "SELECT s FROM Subscription s WHERE s.paymentStatus = :paymentStatus"),
    @NamedQuery(name = "Subscription.findByMemberId", query = "SELECT s FROM Subscription s WHERE s.memberId.id = :memberId"),
    @NamedQuery(name = "Subscription.findByRemainingSessions", query = "SELECT s FROM Subscription s WHERE s.remainingSessions = :remainingSessions"),
    @NamedQuery(name = "Subscription.findByNotified7", query = "SELECT s FROM Subscription s WHERE s.notified7 = :notified7")})
public class Subscription implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Column(name = "isActive")
    private boolean isActive;
    @Size(max = 20)
    @Column(name = "paymentStatus")
    private String paymentStatus;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "startDate")
    @Temporal(TemporalType.DATE)
    private Date startDate;
    @Column(name = "endDate")
    @Temporal(TemporalType.DATE)
    private Date endDate;
    @Column(name = "remainingSessions")
    private Integer remainingSessions;
    @Column(name = "notified7")
    private boolean notified7 = false;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subscriptionId")
    @JsonIgnore
    private Set<Workout> workoutSet;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "subscriptionId")
    @JsonIgnore
    private Set<Review> reviewSet;
    @OneToOne(cascade = CascadeType.ALL, mappedBy = "subscriptionId")
    private Payment payment;
    @JoinColumn(name = "packageId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private GymPackage packageId;
    @JoinColumn(name = "memberId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private User memberId;
    @JoinColumn(name = "trainerId", referencedColumnName = "id")
    @ManyToOne
    private User trainerId;

    public Subscription() {
    }

    public Subscription(Integer id) {
        this.id = id;
    }

    public Subscription(Integer id, boolean isActive) {
        this.id = id;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }


    public Integer getRemainingSessions() {
        return remainingSessions;
    }

    public void setRemainingSessions(Integer remainingSessions) {
        this.remainingSessions = remainingSessions;
    }

    public Set<Workout> getWorkoutSet() {
        return workoutSet;
    }

    public void setWorkoutSet(Set<Workout> workoutSet) {
        this.workoutSet = workoutSet;
    }

    public Set<Review> getReviewSet() {
        return reviewSet;
    }

    public void setReviewSet(Set<Review> reviewSet) {
        this.reviewSet = reviewSet;
    }

    public Payment getPayment() {
        return payment;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public GymPackage getPackageId() {
        return packageId;
    }

    public void setPackageId(GymPackage packageId) {
        this.packageId = packageId;
    }

    public User getMemberId() {
        return memberId;
    }

    public void setMemberId(User memberId) {
        this.memberId = memberId;
    }

    public User getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(User trainerId) {
        this.trainerId = trainerId;
    }
    
    public boolean isNotified7() {
        return notified7;
    }

    public void setNotified7(boolean notified7) {
        this.notified7 = notified7;
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
        if (!(object instanceof Subscription)) {
            return false;
        }
        Subscription other = (Subscription) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Subscription[ id=" + id + " ]";
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
    
}
