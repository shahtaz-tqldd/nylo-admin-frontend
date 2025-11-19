export const DEMO_PRODUCTS = [
  {
    id: 1,
    product: (
      <div className="flx gap-2">
        <img
          src="https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=100"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h2>Nike Air Max 270</h2>
          <p>Shoes</p>
        </div>
      </div>
    ),
    price: 149.99,
    category: "Shoes",
    stock: 24,
    created_at: "2024-01-12",
    order_count: 310,
    status: "active",
  },
  {
    id: 2,
    product: (
      <div className="flx gap-2">
        <img
          src="https://images.unsplash.com/photo-1705096953495-8ea06879b986?q=80&w=100"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h2>Nike Air Max 270</h2>
          <p>Shoes</p>
        </div>
      </div>
    ),
    price: 169.99,
    category: "Shoes",
    stock: 8,
    created_at: "2023-11-05",
    order_count: 210,
    status: "active",
  },
  {
    id: 3,
    product: (
      <div className="flx gap-2">
        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=100"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h2>Nike Air Max 270</h2>
          <p>Shoes</p>
        </div>
      </div>
    ),
    price: 129.99,
    category: "Sneakers",
    stock: 0,
    created_at: "2023-09-18",
    order_count: 98,
    status: "out_of_stock",
  },
  {
    id: 4,
    product: (
      <div className="flx gap-2">
        <img
          src="https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=100"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h2>Nike Air Max 270</h2>
          <p>Shoes</p>
        </div>
      </div>
    ),
    price: 119.99,
    category: "Sneakers",
    stock: 42,
    created_at: "2024-02-20",
    order_count: 520,
    status: "active",
  },
  {
    id: 5,
    product: (
      <div className="flx gap-2">
        <img
          src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=100"
          className="h-10 w-10 rounded-lg object-cover"
        />
        <div>
          <h2>Nike Air Max 270</h2>
          <p>Shoes</p>
        </div>
      </div>
    ),
    price: 139.99,
    category: "Lifestyle",
    stock: 16,
    created_at: "2023-12-01",
    order_count: 185,
    status: "inactive",
  },
];

export const DEMO_COLLECTIONS = [
  {
    id: 1,
    name: "Running Essentials",
    description: "High-performance running shoes built for speed and comfort.",
    productCount: 24,
    tag: "Sports",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600",
  },
  {
    id: 2,
    name: "Casual Streetwear",
    description: "Everyday shoes with the perfect mix of comfort and style.",
    productCount: 18,
    tag: "Casual",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
  },
  {
    id: 3,
    name: "Premium Leather",
    description: "Handcrafted leather shoes designed for timeless fashion.",
    productCount: 12,
    tag: "Luxury",
    image: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=600",
  },
  {
    id: 4,
    name: "Sneaker Culture",
    description: "Iconic and trendy sneakers loved by enthusiasts.",
    productCount: 30,
    tag: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1529810313688-44ea1c2d81d3?q=80&w=600",
  },
  {
    id: 5,
    name: "Outdoor & Hiking",
    description: "Durable footwear built for challenging outdoor trails.",
    productCount: 14,
    tag: "Adventure",
    image:
      "https://images.unsplash.com/photo-1570464197285-9949814674a7?q=80&w=600",
  },
  {
    id: 6,
    name: "Kids Collection",
    description: "Colorful and comfy shoes for active kids.",
    productCount: 20,
    tag: "Kids",
    image:
      "https://images.unsplash.com/photo-1705096953495-8ea06879b986?q=80&w=600",
  },
];
