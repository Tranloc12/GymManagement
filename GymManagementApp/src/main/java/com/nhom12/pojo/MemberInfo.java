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
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "member_info")
@NamedQueries({
    @NamedQuery(name = "MemberInfo.findAll", query = "SELECT m FROM MemberInfo m"),
    @NamedQuery(name = "MemberInfo.findById", query = "SELECT m FROM MemberInfo m WHERE m.id = :id"),
    @NamedQuery(name = "MemberInfo.findByHeight", query = "SELECT m FROM MemberInfo m WHERE m.height = :height"),
    @NamedQuery(name = "MemberInfo.findByWeight", query = "SELECT m FROM MemberInfo m WHERE m.weight = :weight"),
    @NamedQuery(name = "MemberInfo.findByGoal", query = "SELECT m FROM MemberInfo m WHERE m.goal = :goal")})
public class MemberInfo implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "height")
    private Integer height;
    @Column(name = "weight")
    private Integer weight;
    @Size(max = 255)
    @Column(name = "goal")
    private String goal;
    @JoinColumn(name = "userId", referencedColumnName = "id")
    @OneToOne(optional = false)
    private User userId;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "memberInfoId")
    @JsonIgnore 
    private Set<TrainingProgress> trainingProgressSet;

    public MemberInfo() {
    }

    public MemberInfo(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public Set<TrainingProgress> getTrainingProgressSet() {
        return trainingProgressSet;
    }

    public void setTrainingProgressSet(Set<TrainingProgress> trainingProgressSet) {
        this.trainingProgressSet = trainingProgressSet;
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
        if (!(object instanceof MemberInfo)) {
            return false;
        }
        MemberInfo other = (MemberInfo) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.MemberInfo[ id=" + id + " ]";
    }
    
}
