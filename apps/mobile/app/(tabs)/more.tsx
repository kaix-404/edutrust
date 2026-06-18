import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function MoreScreen() {
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F7FB',
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        More
      </Text>

      {[
        ['Role Analysis', '/role'],
        ['Role Recommendations', '/rolerecommend'],
        ['Skills Recommendations', '/skillrecommend'],
        ['Graph Explorer', '/graph'],
        ['Endorsements', '/endorsements'],
        ['Ranking', '/ranking'],
      ].map(([label, route]) => (
        <TouchableOpacity
          key={route}
          onPress={() =>
            router.push(route as any)
          }
          style={{
            backgroundColor: 'white',
            padding: 18,
            borderWidth: 1,
            borderRadius: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 15}}>{label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}