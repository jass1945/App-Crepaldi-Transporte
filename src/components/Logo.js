import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Aproximação do símbolo da Crepaldi (três "C" concêntricos) feita só com Views.
// Troque por uma imagem (assets/logo.png) quando tiverem o arquivo oficial.
export default function Logo({ size = 90, color = colors.navy, showText = true, light = false }) {
  const c = light ? colors.white : color;
  const ring = (s, w) => ({
    position: 'absolute',
    width: s,
    height: s,
    borderRadius: s / 2,
    borderWidth: w,
    borderColor: c,
    borderRightColor: 'transparent',
    transform: [{ rotate: '-20deg' }],
  });

  return (
    <View style={styles.wrap}>
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <View style={ring(size, size * 0.11)} />
        <View style={[ring(size * 0.7, size * 0.08), { left: size * 0.22 }]} />
        <View style={[ring(size * 0.42, size * 0.06), { left: size * 0.42 }]} />
      </View>
      {showText && (
        <>
          <Text style={[styles.title, { color: c, fontSize: size * 0.36 }]}>CREPALDI</Text>
          <Text style={[styles.subtitle, { color: c, fontSize: size * 0.13 }]}>TRANSPORTES</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  title: { fontWeight: '500', letterSpacing: 1, marginTop: 10 },
  subtitle: { fontWeight: '600', letterSpacing: 1.5 },
});
