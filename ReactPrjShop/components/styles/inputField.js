import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 

const InputField = ({
  label,
  icon,
  secureTextEntry,
  keyboardType,
  onChangeText,
  value,
  onEyePress,
}) => {
  return (
    <View style={styles.container}>
      {icon && <MaterialIcons name={icon} size={24} color="#AD40AF" style={styles.icon} />}
      <TextInput
        placeholder={label}
        placeholderTextColor="#CCC"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        style={[styles.textInput, { color: '#fff' }]}
        onChangeText={onChangeText}
        value={value}
      />
      {secureTextEntry !== undefined && (
        <TouchableOpacity onPress={onEyePress} style={styles.eyeIcon}>
          <MaterialIcons 
            name={secureTextEntry ? 'visibility-off' : 'visibility'} 
            size={24} 
            color="#ccc" 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 25,
  },
  icon: {
    marginRight: 10,
    color: "#CCC"
  },
  textInput: {
    flex: 1,
    paddingVertical: 0,
  },
  eyeIcon: {
    marginLeft: 10,
  },
});

export default InputField;
