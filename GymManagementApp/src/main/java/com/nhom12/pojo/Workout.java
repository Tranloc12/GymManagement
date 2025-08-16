/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.pojo;

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
@Table(name = "workout")
@NamedQueries({
    @NamedQuery(name = "Workout.findAll", query = "SELECT w FROM Workout w"),
    @NamedQuery(name = "Workout.findById", query = "SELECT w FROM Workout w WHERE w.id = :id"),
    @NamedQuery(name = "Workout.findByStartTime", query = "SELECT w FROM Workout w WHERE w.startTime = :startTime"),
    @NamedQuery(name = "Workout.findByEndTime", query = "SELECT w FROM Workout w WHERE w.endTime = :endTime"),
    @NamedQuery(name = "Workout.findByIsWithTrainer", query = "SELECT w FROM Workout w WHERE w.isWithTrainer = :isWithTrainer"),
    @NamedQuery(name = "Workout.findByStatus", query = "SELECT w FROM Workout w WHERE w.status = :status"),
    @NamedQuery(name = "Workout.findByType", query = "SELECT w FROM Workout w WHERE w.type = :type"),
    @NamedQuery(name = "Workout.findByNotified30", query = "SELECT w FROM Workout w WHERE w.notified30 = :notified30"),
    @NamedQuery(name = "Workout.findByNotified15", query = "SELECT w FROM Workout w WHERE w.notified15 = :notified15")})
public class Workout implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "startTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;
    @Column(name = "endTime")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;
    @Column(name = "isWithTrainer")
    private Boolean isWithTrainer;
    @Size(max = 20)
    @Column(name = "status")
    private String status;
    @Size(max = 45)
    @Column(name = "type")
    private String type;
    @Column(name = "notified30")
    private Boolean notified30;
    @Column(name = "notified15")
    private Boolean notified15;
    @JoinColumn(name = "subscriptionId", referencedColumnName = "id")
    @ManyToOne(optional = false)
    private Subscription subscriptionId;

    public Workout() {
    }

    public Workout(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Boolean getIsWithTrainer() {
        return isWithTrainer;
    }

    public void setIsWithTrainer(Boolean isWithTrainer) {
        this.isWithTrainer = isWithTrainer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Boolean getNotified30() {
        return notified30;
    }

    public void setNotified30(Boolean notified30) {
        this.notified30 = notified30;
    }

    public Boolean getNotified15() {
        return notified15;
    }

    public void setNotified15(Boolean notified15) {
        this.notified15 = notified15;
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
        if (!(object instanceof Workout)) {
            return false;
        }
        Workout other = (Workout) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.Workout[ id=" + id + " ]";
    }
    
}
