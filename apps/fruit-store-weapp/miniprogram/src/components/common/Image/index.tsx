import { Image, View } from '@tarojs/components';
import { useState } from 'react';
import './Image.scss';

interface ImageProps {
  src: string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix';
  placeholder?: string;
  lazy?: boolean;
  className?: string;
  onClick?: () => void;
}

const ImageComponent: React.FC<ImageProps> = ({
  src,
  mode = 'aspectFill',
  placeholder = '/assets/images/placeholder.png',
  lazy = true,
  className = '',
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setLoaded(true);
  };

  return (
    <View className={`image-component ${className}`} onClick={onClick}>
      {!loaded && (
        <View className="image-component__placeholder">
          <Image src={placeholder} mode="aspectFit" />
        </View>
      )}
      <Image
        src={error ? placeholder : src}
        mode={mode}
        lazyLoad={lazy}
        className={`image-component__img ${loaded ? 'image-component__img--loaded' : ''}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </View>
  );
};

export default ImageComponent;
