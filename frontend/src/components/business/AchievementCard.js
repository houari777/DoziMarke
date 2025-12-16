// 📱 frontend/src/components/business/AchievementCard.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AchievementCard = ({ achievement, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{achievement.icon}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{achievement.name}</Text>
        <Text style={styles.date}>{achievement.date}</Text>

        {achievement.xp && (
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{achievement.xp} XP</Text>
          </View>
        )}
      </View>

      <Icon name="share" size={20} color="#2196F3" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  xpBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  xpText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default AchievementCard;