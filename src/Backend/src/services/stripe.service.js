import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51234567890abcdef');

// Créer un produit et un prix pour l'abonnement mensuel
const createSubscriptionProduct = async () => {
  try {
    // Vérifier si le produit existe déjà
    const products = await stripeInstance.products.list({ limit: 100 });
    let product = products.data.find(p => p.name === 'Premium Subscription');

    if (!product) {
      // Créer le produit
      product = await stripeInstance.products.create({
        name: 'Premium Subscription',
        description: 'Accès à tout le contenu premium des créateurs',
        type: 'service',
      });
    }

    // Créer ou récupérer le prix
    const prices = await stripeInstance.prices.list({ product: product.id, limit: 100 });
    let price = prices.data.find(p => p.unit_amount === 999 && p.recurring?.interval === 'month');

    if (!price) {
      price = await stripeInstance.prices.create({
        product: product.id,
        unit_amount: 999, // $9.99 en cents
        currency: 'usd',
        recurring: { interval: 'month' },
      });
    }

    return { productId: product.id, priceId: price.id };
  } catch (error) {
    console.error('Error creating subscription product:', error);
    throw error;
  }
};

// Créer une session de checkout Stripe
const createCheckoutSession = async (userId, userEmail) => {
  try {
    const { priceId } = await createSubscriptionProduct();

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: userEmail,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:3000'}/subscribe`,
      metadata: {
        userId: userId,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

// Vérifier le statut d'une session
const getSessionStatus = async (sessionId) => {
  try {
    const session = await stripeInstance.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    throw error;
  }
};

// Créer un customer Stripe pour un utilisateur
const createCustomer = async (email, userId) => {
  try {
    const customer = await stripeInstance.customers.create({
      email: email,
      metadata: {
        userId: userId,
      },
    });
    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};

export {
  createSubscriptionProduct,
  createCheckoutSession,
  getSessionStatus,
  createCustomer,
};
