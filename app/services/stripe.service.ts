export const createPaymentMethod = async (stripe: any, elements: any, cardholderName: string) => {
  if (!stripe || !elements) {
    throw new Error('Stripe has not loaded yet');
  }

  const cardElement = elements.getElement('card');
  if (!cardElement) {
    throw new Error('Card element not found');
  }

  const { error, paymentMethod } = await stripe.createPaymentMethod({
    type: 'card',
    card: cardElement,
    billing_details: {
      name: cardholderName,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return paymentMethod;
};

export const processPaymentAndBookTour = async (
  paymentMethodId: string,
  tourData: {
    postId: string;
    agentId: string;
    date: string;
    time: string;
    consent: any;
  }
) => {
  try {
    const response = await fetch('/api/tour/book-tour', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your auth token header here
      },
      body: JSON.stringify({
        paymentMethodId,
        ...tourData,
      }),
    });

    const data = await response.json();
    
    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.error || 'Failed to process payment');
    }
  } catch (error: any) {
    throw new Error(error.message || 'Payment processing failed');
  }
};