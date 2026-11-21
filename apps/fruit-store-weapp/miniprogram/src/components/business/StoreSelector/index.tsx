import { View, Text } from '@tarojs/components';
import { Store } from '../../../types';
import './StoreSelector.scss';

interface StoreSelectorProps {
  stores: Store[];
  selectedId: string | null;
  visible: boolean;
  onSelect: (store: Store) => void;
  onClose: () => void;
  t?: (key: string) => string;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedId,
  visible,
  onSelect,
  onClose,
  t = (k) => k,
}) => {
  if (!visible) return null;

  return (
    <View className="store-selector-overlay" onClick={onClose} data-testid="store-selector-overlay">
      <View className="store-selector" onClick={(e) => e.stopPropagation()}>
        <View className="store-selector__header">
          <Text className="store-selector__title">{t('switchStore')}</Text>
          <Text className="store-selector__close" onClick={onClose} data-testid="store-selector-close">✕</Text>
        </View>
        <View className="store-selector__content">
          {stores.map((store, index) => (
            <View
              key={store.id}
              className={`store-selector__item ${selectedId === store.id ? 'store-selector__item--selected' : ''}`}
              onClick={() => onSelect(store)}
              data-testid={`store-item-${index}`}
            >
              <View className="store-selector__info">
                <Text className="store-selector__name">{store.name}</Text>
                <Text className="store-selector__address">{store.address}</Text>
              </View>
              {selectedId === store.id && (
                <Text className="store-selector__check">✓</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default StoreSelector;
