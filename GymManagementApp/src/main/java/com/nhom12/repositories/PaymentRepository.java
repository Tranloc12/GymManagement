package com.nhom12.repositories;

import com.nhom12.pojo.Payment;
import com.nhom12.pojo.Subscription;

/**
 * Payment Repository Interface
 * 
 * @author HP
 */
public interface PaymentRepository {

    /**
     * Create payment record
     * 
     * @param payment Payment entity
     * @return Created payment
     */
    Payment createPayment(Payment payment);

    /**
     * Update payment record
     * 
     * @param payment Payment entity
     * @return Updated payment
     */
    Payment updatePayment(Payment payment);

    /**
     * Get payment by subscription
     * 
     * @param subscription Subscription entity
     * @return Payment entity
     */
    Payment getPaymentBySubscription(Subscription subscription);

    /**
     * Get payment by ID
     * 
     * @param id Payment ID
     * @return Payment entity
     */
    Payment getPaymentById(int id);
}
