// 📱 frontend/src/components/business/LevelBadge.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GamificationSystem from '../../utils/gamification';

const LevelBadge = ({ level, size = 60 }) => {
  const levelData = GamificationSystem.helpers.calculateLevel(
    GamificationSystem.levels.vendor[level]?.xpRequired || 0,
  );

  const getLevelColor = level => {
    if (level < 5) return '#4CAF50';
    if (level < 10) return '#2196F3';
    if (level < 20) return '#FF9800';
    return '#9C27B0';
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: getLevelColor(level),
        },
      ]}
    >
      <Text style={[styles.levelText, { fontSize: size * 0.3 }]}>{level}</Text>
      <Text style={styles.levelLabel}>المستوى</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  levelText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  levelLabel: {
    color: '#FFF',
    fontSize: 10,
    marginTop: 2,
  },
});

export default LevelBadge;
