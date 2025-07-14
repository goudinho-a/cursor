import React from 'react';
import './Product.css';

// 商品の型定義
interface ProductProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  numReviews: number;
  prime?: boolean;
  inStock: boolean;
}

const Product: React.FC<ProductProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  numReviews,
  prime = false,
  inStock
}) => {
  // 星評価を表示する関数
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i < rating) {
        stars.push(<span key={i} className="star half">☆</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  // 価格をフォーマットする関数
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
    }).format(price);
  };

  const handleAddToCart = () => {
    console.log(`商品「${name}」をカートに追加しました`);
    // 後でカート機能を実装
  };

  return (
    <div className="product">
      <div className="product__imageContainer">
        <img 
          src={image} 
          alt={name}
          className="product__image"
        />
        {prime && (
          <div className="product__prime">
            <span>Prime</span>
          </div>
        )}
      </div>

      <div className="product__info">
        <h3 className="product__name">{name}</h3>
        
        {/* 評価 */}
        <div className="product__rating">
          <div className="product__stars">
            {renderStars(rating)}
          </div>
          <span className="product__ratingCount">({numReviews})</span>
        </div>

        {/* 価格 */}
        <div className="product__pricing">
          <span className="product__price">{formatPrice(price)}</span>
          {originalPrice && originalPrice > price && (
            <span className="product__originalPrice">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        {/* 在庫状況 */}
        <div className="product__stock">
          {inStock ? (
            <span className="product__inStock">在庫あり</span>
          ) : (
            <span className="product__outOfStock">在庫切れ</span>
          )}
        </div>

        {/* カートに追加ボタン */}
        <button 
          className={`product__addToCart ${!inStock ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={!inStock}
        >
          カートに入れる
        </button>
      </div>
    </div>
  );
};

export default Product;