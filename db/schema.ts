
import { pgTable, text, serial, integer, boolean, decimal, timestamp, uuid } from 'drizzle-orm/pg-core';

// Users (Merchants)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Firebase UID
  email: text('email').notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stores (Tenant)
export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  userId: text('user_id').references(() => users.id).notNull(),
  slug: text('slug').unique().notNull(), // ora.lk/slug
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  phoneNumber: text('phone_number'), // WhatsApp Number
  themeColor: text('theme_color').default('#000000'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').references(() => stores.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price').notNull(),
  imageUrl: text('image_url'),
  isVisible: boolean('is_visible').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Services (for Booking)
export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').references(() => stores.id).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  durationMin: integer('duration_min').notNull(), // e.g., 60 mins
  price: decimal('price').notNull(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookings
export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').references(() => stores.id).notNull(),
  serviceId: integer('service_id').references(() => services.id).notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  customerEmail: text('customer_email'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  status: text('status').default('pending'), // pending, confirmed, cancelled, completed
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders (for Physical Products)
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  storeId: integer('store_id').references(() => stores.id).notNull(),
  customerName: text('customer_name').notNull(),
  customerPhone: text('customer_phone').notNull(),
  totalAmount: decimal('total_amount').notNull(),
  status: text('status').default('pending'), // pending, paid, shipped, delivered, cancelled
  createdAt: timestamp('created_at').defaultNow(),
});

// Order Items
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  priceAtTime: decimal('price_at_time').notNull(),
});
