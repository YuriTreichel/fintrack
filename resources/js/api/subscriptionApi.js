import axios from 'axios';

const subscriptionApi = {
  createCheckoutSession: async (plan, paymentMethod = 'card') => {
    try {
      const response = await axios.post('/api/subscription/checkout', {
        plan,
        payment_method: paymentMethod
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  },

  redirectToCheckout: async (plan, paymentMethod = 'card') => {
    try {
      const { id, url } = await subscriptionApi.createCheckoutSession(plan, paymentMethod);
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
      return { id, url };
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      throw error;
    }
  }
};

export default subscriptionApi;