import React, { useRef, useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import { colors, spacing, radii, typography } from '../theme';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

const SearchBar: React.FC<Props> = ({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = 'Search your files…',
  autoFocus = false,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.container, focused && styles.containerFocused]}>
      {/* Search icon */}
      <Text style={styles.icon}>🔍</Text>

      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={() => value.trim() && onSubmit(value.trim())}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        selectionColor={colors.primary}
      />

      {/* Clear button */}
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onClear();
            inputRef.current?.focus();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.clearBtn}
        >
          <View style={styles.clearCircle}>
            <Text style={styles.clearX}>✕</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
    gap: spacing.sm,
  },
  containerFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.bgElevated,
  },
  icon: {
    fontSize: 17,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: typography.base,
    fontWeight: typography.regular,
    paddingVertical: 0,
    includeFontPadding: false,
  },
  clearBtn: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearX: {
    color: colors.bgCard,
    fontSize: 10,
    fontWeight: typography.bold,
    lineHeight: 11,
  },
});

export default SearchBar;
