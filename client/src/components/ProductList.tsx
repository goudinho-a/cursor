import React from 'react';
import Product from './Product';
import './ProductList.css';

// サンプル商品データ
const sampleProducts = [
  {
    id: '1',
    name: 'Apple iPhone 15 Pro 128GB',
    price: 159800,
    originalPrice: 179800,
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=300&fit=crop',
    rating: 4.5,
    numReviews: 1250,
    prime: true,
    inStock: true
  },
  {
    id: '2',
    name: 'MacBook Air M2 13インチ',
    price: 164800,
    originalPrice: 184800,
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
    rating: 4.8,
    numReviews: 892,
    prime: true,
    inStock: true
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 ワイヤレスヘッドホン',
    price: 49500,
    originalPrice: 55000,
    image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    rating: 4.3,
    numReviews: 2100,
    prime: false,
    inStock: false
  }
];

const ProductList: React.FC = () => {
  return (
    <div className="productList">
      <h2 className="productList__title">おすすめ商品</h2>
      <div className="productList__container">
        {sampleProducts.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.image}
            rating={product.rating}
            numReviews={product.numReviews}
            prime={product.prime}
            inStock={product.inStock}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
