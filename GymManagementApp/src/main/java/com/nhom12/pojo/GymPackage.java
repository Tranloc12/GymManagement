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
import jakarta.persistence.Lob;
import jakarta.persistence.NamedQueries;
import jakarta.persistence.NamedQuery;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.util.Set;

/**
 *
 * @author HP
 */
@Entity
@Table(name = "gym_package")
@NamedQueries({
    @NamedQuery(name = "GymPackage.findAll", query = "SELECT g FROM GymPackage g"),
    @NamedQuery(name = "GymPackage.findById", query = "SELECT g FROM GymPackage g WHERE g.id = :id"),
    @NamedQuery(name = "GymPackage.findByNamePack", query = "SELECT g FROM GymPackage g WHERE g.namePack = :namePack"),
    @NamedQuery(name = "GymPackage.findByPrice", query = "SELECT g FROM GymPackage g WHERE g.price = :price"),
    @NamedQuery(name = "GymPackage.findByDiscount", query = "SELECT g FROM GymPackage g WHERE g.discount = :discount"),
    @NamedQuery(name = "GymPackage.findByChoice", query = "SELECT g FROM GymPackage g WHERE g.choice = :choice"),
    @NamedQuery(name = "GymPackage.findByDayswpt", query = "SELECT g FROM GymPackage g WHERE g.dayswpt = :dayswpt"),
    @NamedQuery(name = "GymPackage.findByIsActive", query = "SELECT g FROM GymPackage g WHERE g.isActive = :isActive")})
public class GymPackage implements Serializable {

    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 100)
    @Column(name = "namePack")
    private String namePack;
    @Lob
    @Size(max = 65535)
    @Column(name = "description")
    private String description;
    @Basic(optional = false)
    @NotNull
    @Column(name = "price")
    private double price;
    @Size(max = 100)
    @Column(name = "choice")
    private String choice;
    @Basic(optional = false)
    @NotNull
    @Column(name = "isActive")
    private boolean isActive;

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;
    // @Max(value=?)  @Min(value=?)//if you know range of your decimal fields consider using these annotations to enforce field validation
    @Column(name = "discount")
    private Double discount;
    @Column(name = "dayswpt")
    private Integer dayswpt;
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "packageId")
    @JsonIgnore
    private Set<Subscription> subscriptionSet;

    public GymPackage() {
    }

    public GymPackage(Integer id) {
        this.id = id;
    }

    public GymPackage(Integer id, String namePack, double price, boolean isActive) {
        this.id = id;
        this.namePack = namePack;
        this.price = price;
        this.isActive = isActive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }


    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }


    public Integer getDayswpt() {
        return dayswpt;
    }

    public void setDayswpt(Integer dayswpt) {
        this.dayswpt = dayswpt;
    }


    public Set<Subscription> getSubscriptionSet() {
        return subscriptionSet;
    }

    public void setSubscriptionSet(Set<Subscription> subscriptionSet) {
        this.subscriptionSet = subscriptionSet;
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
        if (!(object instanceof GymPackage)) {
            return false;
        }
        GymPackage other = (GymPackage) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.nhom12.pojo.GymPackage[ id=" + id + " ]";
    }

    public String getNamePack() {
        return namePack;
    }

    public void setNamePack(String namePack) {
        this.namePack = namePack;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getChoice() {
        return choice;
    }

    public void setChoice(String choice) {
        this.choice = choice;
    }

    public boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(boolean isActive) {
        this.isActive = isActive;
    }
    
}
