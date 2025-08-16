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
import jakarta.persistence.Lob;
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
@Table(name = "training_progress")
@NamedQueries({
        @NamedQuery(name = "TrainingProgress.findAll", query = "SELECT t FROM TrainingProgress t"),
        @NamedQuery(name = "TrainingProgress.findById", query = "SELECT t FROM TrainingProgress t WHERE t.id = :id"),
        @NamedQuery(name = "TrainingProgress.findByRecordDate", query = "SELECT t FROM TrainingProgress t WHERE t.recordDate = :recordDate"),
        @NamedQuery(name = "TrainingProgress.findByWeight", query = "SELECT t FROM TrainingProgress t WHERE t.weight = :weight"),
        @NamedQuery(name = "TrainingProgress.findByBodyFat", query = "SELECT t FROM TrainingProgress t WHERE t.bodyFat = :bodyFat"),
        @NamedQuery(name = "TrainingProgress.findByMemberInfoId", query = "SELECT t FROM TrainingProgress t WHERE t.memberInfoId.id = :memberInfoId"),
        @NamedQuery(name = "TrainingProgress.findByMuscle", query = "SELECT t FROM TrainingProgress t WHERE t.muscle = :muscle") })
public class TrainingProgress implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    @Column(name = "recordDate")
    @Temporal(TemporalType.DATE)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd", timezone = "Asia/Ho_Chi_Minh")
    private Date recordDate;
    // @Max(value=?) @Min(value=?)//if you know range of your decimal fields
    // consider using these annotations to enforce field validation
    @Column(name = "weight")
    private Double weight;
    @Column(name = "bodyFat")
    private Double bodyFat;
    @Column(name = "muscle")
    private Double muscle;
    @Lob
    @Size(max = 65535)
    @Column(name = "note")
    private String note;
    @JoinColumn(name = "memberInfoId", referencedColumnName = "id")
    @JsonIgnore
    @ManyToOne(optional = false)
    private MemberInfo memberInfoId;

    public TrainingProgress() {
    }

    public TrainingProgress(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Date getRecordDate() {
        return recordDate;
    }

    public void setRecordDate(Date recordDate) {
        this.recordDate = recordDate;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getBodyFat() {
        return bodyFat;
    }

    public void setBodyFat(Double bodyFat) {
        this.bodyFat = bodyFat;
    }

    public Double getMuscle() {
        return muscle;
    }

    public void setMuscle(Double muscle) {
        this.muscle = muscle;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public MemberInfo getMemberInfoId() {
        return memberInfoId;
    }

    public void setMemberInfoId(MemberInfo memberInfoId) {
        this.memberInfoId = memberInfoId;
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
        if (!(object instanceof TrainingProgress)) {
            return false;
        }
        TrainingProgress other = (TrainingProgress) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.TrainingProgress[ id=" + id + " ]";
    }

}
