
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Logo({
  size = 90,
  color = colors.navy,
  showText = true,
  light = false,
}) {
  const c = light ? colors.white : color;

  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../assets/LogoCrepaldi.png')}
        style={{ width: 200, height: 180 }}
        resizeMode="contain"
      />

      {showText && (
        <>
      

          <Text
            style={[
              styles.subtitle,
              { color: c, fontSize: size * 0.13 },
            ]}
          >
            TRANSPORTES
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  
  subtitle: {
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
