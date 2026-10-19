import { useState } from 'react';
import { View, Text, TextInput, Pressable, Modal, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radius } from '../theme';

// Cabeçalho com saudação, período e unidade (aparece em todas as telas internas)
export function Header({ motorista, onMenu }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Pressable onPress={onMenu} hitSlop={12}>
          <Feather name="menu" size={20} color={colors.textMuted} />
        </Pressable>
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.welcome}>Bem-vindo</Text>
          <Text style={styles.name}>{motorista.nome}</Text>
        </View>
      </View>
      <View style={styles.headerInfo}>
        <View>
          <Text style={styles.infoLabel}>Período:</Text>
          <View style={styles.row}>
            <Text style={styles.infoValue}>{motorista.periodo}</Text>
            <Feather name="sun" size={18} color={colors.sun} style={{ marginLeft: 6 }} />
          </View>
        </View>
        <View style={{ marginLeft: 40 }}>
          <Text style={styles.infoLabel}>Unidade:</Text>
          <Text style={styles.infoValue}>{motorista.unidade}</Text>
        </View>
      </View>
    </View>
  );
}

export function Field({ label, style, ...props }) {
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput placeholderTextColor="#AFAFAF" style={styles.input} {...props} />
    </View>
  );
}

// Campo de seleção simples (abre uma lista em modal)
export function Select({ label, value, options, onChange, placeholder = '', style }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.field, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <Pressable style={[styles.input, styles.select]} onPress={() => setOpen(true)}>
        <Text style={{ color: value ? colors.text : '#AFAFAF', fontSize: 14 }} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={16} color={colors.text} />
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={options}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, item === value && { fontWeight: '700' }]}>{item}</Text>
                  {item === value && <Feather name="check" size={18} color={colors.navy} />}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export function Button({ title, onPress, variant = 'primary', style, icon }) {
  const v = {
    primary: { bg: colors.navy, fg: colors.white },
    warning: { bg: colors.warning, fg: colors.text },
    danger: { bg: colors.danger, fg: colors.text },
    outline: { bg: colors.white, fg: colors.text, border: colors.text },
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: v.bg, opacity: pressed ? 0.8 : 1 },
        v.border && { borderWidth: 1, borderColor: v.border },
        style,
      ]}
    >
      <Text style={[styles.buttonText, { color: v.fg }]}>{title}</Text>
      {icon}
    </Pressable>
  );
}

// Botão grande do menu (Home) e "Nova viagem / Nova abastecida"
export function MenuButton({ title, onPress, icon = 'arrow-right', tall }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuButton, tall && { paddingVertical: 18 }, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Text style={styles.menuText}>{title}</Text>
      <Feather name={icon} size={icon === 'plus-circle' ? 26 : 24} color={colors.white} />
    </Pressable>
  );
}

export function TabBar({ active, onHome, onAdd, onChart }) {
  const item = (name, key, onPress) => (
    <Pressable onPress={onPress} hitSlop={14} style={styles.tabItem}>
      <Feather name={name} size={22} color={active === key ? colors.navy : colors.text} />
    </Pressable>
  );
  return (
    <View style={styles.tabBar}>
      {item('home', 'home', onHome)}
      {item('plus-square', 'add', onAdd)}
      {item('bar-chart-2', 'chart', onChart)}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.divider, marginHorizontal: 4 },
  headerTop: { flexDirection: 'row', alignItems: 'center' },
  welcome: { fontSize: 11, color: colors.textMuted },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  headerInfo: { flexDirection: 'row', marginTop: 10, marginLeft: 26 },
  infoLabel: { fontSize: 11, color: colors.textMuted },
  infoValue: { fontSize: 14, fontWeight: '700', color: colors.text },

  field: { marginBottom: 14 },
  label: { fontSize: 12, color: colors.text, marginBottom: 6 },
  input: { backgroundColor: colors.field, borderRadius: radius.md, paddingHorizontal: 12, height: 44, fontSize: 14, color: colors.text },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.white, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20, maxHeight: '60%' },
  sheetTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: colors.navy },
  option: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between' },
  optionText: { fontSize: 15, color: colors.text },

  button: { height: 46, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  buttonText: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },

  menuButton: { backgroundColor: colors.navy, borderRadius: radius.md, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  menuText: { color: colors.white, fontSize: 13, fontWeight: '500', letterSpacing: 0.3 },

  tabBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 34, paddingTop: 12, paddingBottom: 24, backgroundColor: colors.white },
  tabItem: { padding: 4 },
});
