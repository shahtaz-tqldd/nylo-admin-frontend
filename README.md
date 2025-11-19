# **Nylo Admin Panel — Frontend**

A modern, scalable admin dashboard built for managing the Nylo footwear e-commerce platform.
This application powers the internal operations of Nylo, enabling product management, order fulfillment, analytics, customer communication, team permissions, and storefront configuration—all from a single unified interface.

---

## **Overview**

Nylo Admin Panel is a fully featured internal dashboard built with scalability and real-world e-commerce workflows in mind.
It delivers a clean UI, optimized performance, role-based access, and a modular architecture that supports future expansion.

This project combines:

* **Production-level e-commerce logic**
* **Complex data relationships**
* **Dynamic UI components**
* **Enterprise permission system**
* **Integrated AI messaging**
* **Storefront builder**
* **High-code quality, reusable components, and clean architecture**

---

## **Core Features**

### **1. Product Management**

* Create, update, and organize shoes & collections.
* Variant system with:

  * Color, size & stock management
  * Images per variant
  * Specifications, meta tags & SEO settings
* Dynamic form generation for scalable product creation.

### **2. Customers Module**

* View customer profiles, activity, and purchase history.
* Filtering, search, and sorting for fast data handling.
* Customer behavior overview to support sales insights.

### **3. Orders & Sales**

* Real-time order list with statuses (Pending, Shipped, Delivered, Cancelled)
* Invoice-style order details
* Sales overview with charts and analytics
* Integration-ready for fulfillment & shipping systems

### **4. AI Messaging System**

* “Shop AI Assistant” that stores:

  * Conversations between users and the store AI
  * Message history and customer context
* Helps admins understand customer needs & improve marketing.

### **5. Members & Permissions**

A robust **Role-Based Access Control (RBAC)** system:

* Admins, managers, operators, and custom roles
* Fine-grained permissions for:

  * Products
  * Orders
  * Sales data
  * Storefront settings
  * Member management
* Ensures safe multi-user collaboration in the backend.

### **6. Storefront Configuration**

* Manage homepage content, banners, categories, and featured products
* Update store brand elements: logo, color scheme, SEO settings
* Real-time preview components (if implemented)
* A no-code style interface for business owners

### **7. Settings**

* Global platform preferences
* Payment integration placeholders
* Email/SMS configuration
* API keys, webhooks, and automation hooks

---

## **Tech Stack**

### **Frontend**

* **React + Vite** — extremely fast dev & build times
* **Redux + RTK query** — advanced state management, caching and API calling
* **Tailwind CSS** — rapid UI styling
* **shadcn/ui** — accessible, beautiful, reusable components
* **React Router** — dashboard navigation

### **Architecture**

* Modular file structure
* Reusable UI components (Buttons, Cards, Table, Dialog, Drawer, Status badges, etc.)
* API abstraction layers
* Strong TypeScript models for data consistency
* Responsive design for desktop + tablet

---

## **What did I try to do in this project**

### **Real E-Commerce Complexity**

This isn’t a simple CRUD dashboard.
It deals with real product logic:

* Multiple variants
* Images per variant
* Size → stock mapping
* SEO metadata
* Collections & categories
* Customer behavior insights

### **Enterprise-Grade Permission System**

A fine-grained RBAC system is included in this projects.
It shows:

* Understanding of system security
* Multi-user workflows
* Admin operations handling

### **AI Messaging Module**

A complete chat system has included here to demonstrate:

* Chat history storage
* Admin-to-customer AI interaction logs
* A system ready for AI-driven customer support

### **Storefront Builder**

a configurable CMS for the store. This demonstrates:

* Product-thinking
* Component reusability
* Dynamic UI rendering

### **Production-Ready Code Quality**

The project uses:

* Clean component architecture
* Modern UI/UX
* Optimized rendering patterns
* Effective state management patterns

### **Shows Full-Stack Integration Thinking**

Even though this README is for the frontend, the design clearly supports:

* Scalable backend APIs
* Database-backed product structures
* Complex relational data
* Media uploads
* Real-time updates

---

## **Purpose of This Project**

This project was built to:

* Demonstrate proficiency in **React**, **tailwindcss**, **redux**
* Show mastery of **complex admin dashboard architecture**
* Build production-quality **UI/UX and component systems**
* Showcase understanding of **e-commerce logic and workflows**
* Create a portfolio project that stands out in **scalability and real-world use cases**
