import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, progressColor, backgroundColor }) => {
  const containerStyle = { ...styles.container, backgroundColor };
  const progressStyle = {
    ...styles.progress,
    width: `${progress}%`,
    backgroundColor: progressColor,
  };

  return (
    <View style={containerStyle}>
      <View style={progressStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '60%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    borderRadius: 10,
  },
});

export default ProgressBar;
