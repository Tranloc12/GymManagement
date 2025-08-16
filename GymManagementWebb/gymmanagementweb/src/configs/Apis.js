import axios from "axios"
import { getValidToken } from "../utils/authUtils";

// Cấu hình BASE_URL dựa trên environment
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/GymManagementApp/api';

export const endpoints = {
    'gym-packages': '/gym-packages',
    'gym-packages-mana': '/gym-packages',
    'gym-packages-detail': id => `/gym-packages/${id}`,
    'gym-packages-paginated': '/gym-packages/paginated',
    'gym-packages-with-rating': '/gym-packages/with-rating',
    'login': '/login',
    'register': '/register',
    'current-user': '/secure/current-user',
    'progress-create': '/secure/progress/create/',
    'member-progress': '/secure/progress/my-progress',
    'create-member-info': '/secure/progress/create-member-info',
    'trainer-progress': '/secure/progress/mem-progress',
    'members': '/secure/progress/members',
    'secure-reviews': '/reviews',
    'reviews-by-package': '/reviews/byPackage',
    'reviews-average-by-package': '/reviews/averageByPackage',
    'my-subscriptions': '/secure/subscription/my',
    'trainer-subscriptions': '/secure/subscription/trainer',
    'create-subscription': '/secure/subscription/create/',
    'subscription': id => `/secure/subscription/${id}`,
    'create-workout': '/secure/workout/create/',
    'workout-by-subscription': id => `/secure/workout/subscription/${id}/`,
    'delete-workout': id => `/secure/workout/${id}/`,
    'update-workout': id => `/secure/workout/${id}/`,
    'suggest-workout': id => `/secure/workout/${id}/suggest/`,
    'approve-workout': id => `/secure/workout/${id}/approve/`,
    'statistics-members': '/secure/statistics/members',
    'statistics-revenue': '/secure/statistics/revenue',
    'statistics-gym-usage': '/secure/statistics/gym-usage',
    'create-vnpay-payment': id => `/payment/vnpay/create-payment/${id}`,
    'vnpay-return': '/payment/vnpay/return',
    'trainers': '/trainers',
    'secure-trainers': '/secure/trainers',
    'services': '/services',
    'testimonials': '/testimonials',
}

export const authApis = () => {
    const token = getValidToken();

    if (!token) {
        throw new Error('No valid token found');
    }

    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}

export default axios.create({
    baseURL: BASE_URL
})



