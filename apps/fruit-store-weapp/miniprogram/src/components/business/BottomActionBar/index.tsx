import { View, Text } from '@tarojs/components';
import './BottomActionBar.scss';

interface Action {
  icon?: string;
  text: string;
  onClick: () => void;
  testid?: string;
}

interface BottomActionBarProps {
  leftActions?: Action[];
  primaryAction: Action & { testid?: string };
}

const BottomActionBar: React.FC<BottomActionBarProps> = ({
  leftActions = [],
  primaryAction,
}) => {
  return (
    <View className="bottom-action-bar">
      <View className="bottom-action-bar__left">
        {leftActions.map((action, index) => (
          <View
            key={index}
            className="bottom-action-bar__action"
            onClick={action.onClick}
            data-testid={action.testid}
          >
            {action.icon && <Text className="bottom-action-bar__icon">{action.icon}</Text>}
            <Text className="bottom-action-bar__text">{action.text}</Text>
          </View>
        ))}
      </View>
      <View
        className="bottom-action-bar__primary"
        onClick={primaryAction.onClick}
        data-testid={primaryAction.testid}
      >
        <Text className="bottom-action-bar__primary-text">{primaryAction.text}</Text>
      </View>
    </View>
  );
};

export default BottomActionBar;
