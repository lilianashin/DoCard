import React from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { bs } from './colors';

export const Card = ({ style, children }) => (
    <View style={[{
        backgroundColor: bs.surface,
        borderWidth: 1, borderColor: bs.border,
        borderRadius: 16, padding: 16,
        // RN-web safe shadow
        shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
        elevation: 1
    }, style]}>
        {children}
    </View>
);

export const Button = ({ variant='primary', title, onPress, style, textStyle }) => {
    const map = {
        primary:   bs.primary,
        secondary: bs.secondary,
        success:   bs.success,
        danger:    bs.danger,
        warning:   bs.warning,
    };
    const bg = map[variant] || bs.primary;
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [{
                backgroundColor: pressed ? bs.primaryDark : bg,
                borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16
            }, style]}
        >
            <Text style={[{ color: '#fff', fontWeight: '700', textAlign: 'center' }, textStyle]}>{title}</Text>
        </Pressable>
    );
};

export const OutlineButton = ({ title, onPress, style, textStyle }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [{
            borderWidth: 1, borderColor: bs.border, borderRadius: 8,
            paddingVertical: 8, paddingHorizontal: 12,
            backgroundColor: pressed ? '#f1f3f5' : 'transparent'
        }, style]}
    >
        <Text style={[{ color: bs.text, fontWeight: '600', textAlign: 'center' }, textStyle]}>{title}</Text>
    </Pressable>
);

export const Input = React.forwardRef(({ style, ...props }, ref) => (
    <TextInput
        ref={ref}
        placeholderTextColor="#adb5bd"
        style={[{
            borderWidth: 1, borderColor: bs.border, borderRadius: 12, padding: 12,
            backgroundColor: '#fff', color: bs.text
        }, style]}
        {...props}
    />
));

export const Badge = ({ variant='secondary', children, style, textStyle }) => {
    const colors = {
        success:  { bg: '#d4edda', fg: '#155724' },
        warning:  { bg: '#fff3cd', fg: '#856404' },
        danger:   { bg: '#f8d7da', fg: '#721c24' },
        secondary:{ bg: '#e2e3e5', fg: '#383d41' },
    };
    const c = colors[variant] || colors.secondary;
    return (
        <View style={[{ backgroundColor: c.bg, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999 }, style]}>
            <Text style={[{ color: c.fg, fontWeight: '700' }, textStyle]}>{children}</Text>
        </View>
    );
};

export const Progress = ({ value=0, height=8, style }) => (
    <View style={[{ backgroundColor: bs.progressTrack, height, borderRadius: 999, overflow: 'hidden' }, style]}>
        <View style={{ width: `${Math.max(0, Math.min(100, value))}%`, height: '100%', backgroundColor: bs.primary }} />
    </View>
);

export const SectionHeader = ({ title, right }) => (
    <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingVertical: 10, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: bs.border
    }}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: bs.text }}>{title}</Text>
        {right}
    </View>
);
