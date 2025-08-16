package com.nhom12.repositories.impl;

import com.nhom12.pojo.Payment;
import com.nhom12.pojo.Subscription;
import com.nhom12.repositories.PaymentRepository;
import org.hibernate.Session;
import org.hibernate.query.Query;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate5.LocalSessionFactoryBean;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

/**
 * Payment Repository Implementation
 *
 * @author HP
 */
@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepository {

    @Autowired
    private LocalSessionFactoryBean factory;

    @Override
    public Payment createPayment(Payment payment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.persist(payment);
        return payment;
    }

    @Override
    public Payment updatePayment(Payment payment) {
        Session s = this.factory.getObject().getCurrentSession();
        s.merge(payment);
        return payment;
    }

    @Override
    public Payment getPaymentBySubscription(Subscription subscription) {
        Session s = this.factory.getObject().getCurrentSession();
        Query<Payment> q = s.createQuery("FROM Payment p WHERE p.subscriptionId = :subscription", Payment.class);
        q.setParameter("subscription", subscription);
        return q.uniqueResult();
    }

    @Override
    public Payment getPaymentById(int id) {
        Session s = this.factory.getObject().getCurrentSession();
        return s.get(Payment.class, id);
    }
}
