import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../../config/defaultValues.config.js";

export const stripe = new Stripe(STRIPE_SECRET_KEY);
