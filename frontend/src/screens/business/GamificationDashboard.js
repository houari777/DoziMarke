// 📱 frontend/src/screens/business/GamificationDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Share,
} from 'react-native';
import { Card, ProgressBar, Text as PaperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import LevelBadge from '../../components/business/LevelBadge';
import AchievementCard from '../../components/business/AchievementCard';
import ChallengeCard from '../../components/business/ChallengeCard';
import GamificationSystem from '../../utils/gamification';

const XPProgress = ({ xp, levelInfo }) => (
  <View style={styles.xpProgressContainer}>
    <View style={styles.xpHeader}>
      <Text style={styles.xpLabel}>نقاط الخبرة (XP)</Text>
      <Text style={styles.xpValue}>{xp.toLocaleString()}</Text>
    </View>

    <View style={styles.progressContainer}>
      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            { width: `${levelInfo.progress}%` }
          ]}
        />
      </View>

      <View style={styles.levelMarkers}>
        <Text style={styles.currentLevel}>المستوى {levelInfo.level}</Text>
        <Text style={styles.nextLevel}>المستوى {levelInfo.nextLevel}</Text>
      </View>

      <Text style={styles.xpRemaining}>
        {levelInfo.xpToNextLevel.toLocaleString()} XP متبقية للمستوى التالي
      </Text>
    </View>
  </View>
);

const CurrencyDisplay = ({ coins, gems, streak }) => (
  <View style={styles.currencyContainer}>
    <View style={styles.currencyItem}>
      <View style={[styles.currencyIcon, styles.coinsIcon]}>
        <Text style={styles.currencySymbol}>🪙</Text>
      </View>
      <View>
        <Text style={styles.currencyAmount}>{coins}</Text>
        <Text style={styles.currencyLabel}>دوزي كوينز</Text>
      </View>
    </View>

    <View style={styles.currencyItem}>
      <View style={[styles.currencyIcon, styles.gemsIcon]}>
        <Text style={styles.currencySymbol}>💎</Text>
      </View>
      <View>
        <Text style={styles.currencyAmount}>{gems}</Text>
        <Text style={styles.currencyLabel}>أحجار نادرة</Text>
      </View>
    </View>

    <View style={styles.currencyItem}>
      <View style={[styles.currencyIcon, styles.streakIcon]}>
        <Icon name="local-fire-department" size={20} color="#FFF" />
      </View>
      <View>
        <Text style={styles.currencyAmount}>{streak}</Text>
        <Text style={styles.currencyLabel}>يوم متتالي</Text>
      </View>
    </View>
  </View>
);

const GamificationDashboard = () => {
  const [userData, setUserData] = useState({
    xp: 8500,
    level: 7,
    coins: 1250,
    gems: 25,
    streak: 14,
    achievements: [
      { id: 1, name: 'أول عملية بيع 🎯', icon: '🎯', date: '2024-01-15', xp: 100 },
      { id: 2, name: '100 عملية بيع 🏆', icon: '🏆', date: '2024-02-20', xp: 500 },
      { id: 3, name: 'تصنيف 5 نجوم ⭐', icon: '⭐', date: '2024-03-10', xp: 200 },
      { id: 4, name: 'رد سريع ⚡', icon: '⚡', date: '2024-03-15', xp: 50 },
    ],
    badges: [
      { id: 1, name: 'بائع نشط', icon: '📅', progress: 80 },
      { id: 2, name: 'جودة متميزة', icon: '⭐', progress: 90 },
      { id: 3, name: 'سرعة التوصيل', icon: '⚡', progress: 95 },
    ],
    challenges: [
      { id: 1, name: 'إكمال 10 مبيعات', type: 'daily', reward: 100, progress: 7, total: 10 },
      { id: 2, name: 'الرد خلال 5 دقائق', type: 'daily', reward: 50, progress: 100, total: 100 },
      { id: 3, name: 'تحقيق 5000 ريال مبيعات', type: 'weekly', reward: 300, progress: 3200, total: 5000 },
      { id: 4, name: 'زيادة التقييم لـ 4.9', type: 'weekly', reward: 200, progress: 4.8, total: 4.9 },
    ],
    recentActivity: [
      { action: 'عملية بيع جديدة', xp: 10, time: 'منذ 5 دقائق' },
      { action: 'تقييم 5 نجوم', xp: 20, time: 'منذ ساعة' },
      { action: 'تسجيل دخول يومي', xp: 70, time: 'منذ 3 ساعات' },
      { action: 'إضافة منتج جديد', xp: 5, time: 'منذ 6 ساعات' },
    ],
  });

  const [activeTab, setActiveTab] = useState('achievements');
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // تحريك مؤشر الدوران
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const levelInfo = GamificationSystem.helpers.calculateLevel(userData.xp);
  const nextLevelRewards = GamificationSystem.helpers.getLevelRewards(levelInfo.nextLevel);

  const shareAchievement = async (achievement) => {
    try {
      await Share.share({
        message: `🎉 لقد حصلت على إنجاز ${achievement.name} في منصة دوزي ماركت!`,
        title: 'شارك إنجازك',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const claimReward = (challengeId) => {
    // محاكاة المطالبة بمكافأة
    setUserData(prev => ({
      ...prev,
      challenges: prev.challenges.map(challenge =>
        challenge.id === challengeId
          ? { ...challenge, progress: challenge.total, claimed: true }
          : challenge
      ),
      coins: prev.coins + 50, // إضافة العملات
    }));
  };

  return (
    <ScrollView style={styles.container}>
      {/* بطاقة المستوى */}
      <Animatable.View
        animation="fadeInDown"
        duration={1000}
        style={styles.levelCard}
      >
        <View style={styles.levelHeader}>
          <LevelBadge level={levelInfo.level} size={80} />

          <View style={styles.levelInfo}>
            <PaperText style={styles.levelName}>{levelInfo.name}</PaperText>
            <Text style={styles.levelDescription}>
              أنت في أعلى {Math.round((userData.xp / 200000) * 100)}% من التجار
            </Text>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>#{42}</Text>
                <Text style={styles.statLabel}>الترتيب</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>{userData.achievements.length}</Text>
                <Text style={styles.statLabel}>إنجازات</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statValue}>{userData.badges.length}</Text>
                <Text style={styles.statLabel}>شارات</Text>
              </View>
            </View>
          </View>
        </View>

        <XPProgress xp={userData.xp} levelInfo={levelInfo} />
        <CurrencyDisplay coins={userData.coins} gems={userData.gems} streak={userData.streak} />
      </Animatable.View>

      {/* مكافآت المستوى التالي */}
      {nextLevelRewards.length > 0 && (
        <Animatable.View
          animation="fadeInUp"
          duration={1000}
          delay={300}
          style={styles.nextLevelCard}
        >
          <View style={styles.rewardsHeader}>
            <Icon name="card-giftcard" size={24} color="#FF9800" />
            <Text style={styles.rewardsTitle}>مكافآت المستوى {levelInfo.nextLevel}</Text>
          </View>

          <View style={styles.rewardsList}>
            {nextLevelRewards.map((reward, index) => (
              <View key={index} style={styles.rewardItem}>
                <Icon name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.rewardText}>{reward}</Text>
              </View>
            ))}
          </View>

          <View style={styles.progressHint}>
            <Icon name="lightbulb" size={16} color="#FFC107" />
            <Text style={styles.hintText}>
              أكمل {levelInfo.xpToNextLevel} XP إضافية لفتح هذه المكافآت
            </Text>
          </View>
        </Animatable.View>
      )}

      {/* أزرار التبويب */}
      <View style={styles.tabContainer}>
        {['achievements', 'challenges', 'badges', 'activity'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabButton, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText
            ]}>
              {tab === 'achievements' && 'الإنجازات 🏆'}
              {tab === 'challenges' && 'التحديات ⚡'}
              {tab === 'badges' && 'الشارات 🎖️'}
              {tab === 'activity' && 'النشاط 📊'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* محتوى التبويب النشط */}
      {activeTab === 'achievements' && (
        <Animatable.View animation="fadeIn" duration={500}>
          <View style={styles.achievementsGrid}>
            {userData.achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onPress={() => shareAchievement(achievement)}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>عرض جميع الإنجازات</Text>
            <Icon name="chevron-left" size={20} color="#2196F3" />
          </TouchableOpacity>
        </Animatable.View>
      )}

      {activeTab === 'challenges' && (
        <Animatable.View animation="fadeIn" duration={500}>
          <View style={styles.challengesList}>
            {userData.challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onClaim={() => claimReward(challenge.id)}
              />
            ))}
          </View>
        </Animatable.View>
      )}

      {activeTab === 'badges' && (
        <Animatable.View animation="fadeIn" duration={500}>
          <View style={styles.badgesContainer}>
            {userData.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeCard}>
                <View style={styles.badgeIconContainer}>
                  <Text style={styles.badgeIcon}>{badge.icon}</Text>
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
                <ProgressBar
                  progress={badge.progress / 100}
                  color="#4CAF50"
                  style={styles.badgeProgress}
                />
                <Text style={styles.progressText}>{badge.progress}%</Text>
              </View>
            ))}
          </View>
        </Animatable.View>
      )}

      {activeTab === 'activity' && (
        <Animatable.View animation="fadeIn" duration={500}>
          <Card style={styles.activityCard}>
            <Card.Content>
              <PaperText style={styles.activityTitle}>النشاط الأخير</PaperText>

              {userData.recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    <Icon name="add-circle" size={20} color="#4CAF50" />
                  </View>

                  <View style={styles.activityInfo}>
                    <Text style={styles.activityAction}>{activity.action}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>

                  <View style={styles.xpBadge}>
                    <Text style={styles.xpBadgeText}>+{activity.xp} XP</Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        </Animatable.View>
      )}

      {/* نصائح لزيادة XP */}
      <Animatable.View
        animation="fadeInUp"
        duration={1000}
        delay={500}
        style={styles.tipsCard}
      >
        <View style={styles.tipsHeader}>
          <Icon name="auto-awesome" size={24} color="#9C27B0" />
          <Text style={styles.tipsTitle}>كيف تزيد نقاط XP بسرعة؟ 🚀</Text>
        </View>

        <View style={styles.tipsList}>
          <View style={styles.tipItem}>
            <Icon name="shopping-cart" size={20} color="#4CAF50" />
            <Text style={styles.tipText}>أكمل 3 مبيعات يومياً (+30 XP)</Text>
          </View>

          <View style={styles.tipItem}>
            <Icon name="star" size={20} color="#FFC107" />
            <Text style={styles.tipText}>احصل على تقييمات 5 نجوم (+20 XP لكل تقييم)</Text>
          </View>

          <View style={styles.tipItem}>
            <Icon name="reply" size={20} color="#2196F3" />
            <Text style={styles.tipText}>رد على الاستفسارات خلال 5 دقائق (+5 XP)</Text>
          </View>

          <View style={styles.tipItem}>
            <Icon name="update" size={20} color="#FF9800" />
            <Text style={styles.tipText}>سجل دخولك يومياً (+5 XP لكل يوم متتالي)</Text>
          </View>
        </View>
      </Animatable.View>

      {/* زر المشاركة */}
      <TouchableOpacity
        style={styles.shareButton}
        onPress={() => shareAchievement({ name: 'تقدمي في النظام التلعبيبي' })}
      >
        <Icon name="share" size={24} color="#FFF" />
        <Text style={styles.shareButtonText}>شارك تقدمك مع الأصدقاء</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  levelInfo: {
    flex: 1,
    marginLeft: 20,
  },
  levelName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 15,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  xpProgressContainer: {
    marginVertical: 20,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  xpLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  xpValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  progressContainer: {
    position: 'relative',
  },
  progressBackground: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
  },
  levelMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  currentLevel: {
    fontSize: 12,
    color: '#666',
  },
  nextLevel: {
    fontSize: 12,
    color: '#666',
  },
  xpRemaining: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#FF9800',
    fontWeight: '500',
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  currencyItem: {
    alignItems: 'center',
  },
  currencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  coinsIcon: {
    backgroundColor: '#FFD700',
  },
  gemsIcon: {
    backgroundColor: '#9C27B0',
  },
  streakIcon: {
    backgroundColor: '#4CAF50',
  },
  currencySymbol: {
    fontSize: 24,
  },
  currencyAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyLabel: {
    fontSize: 12,
    color: '#666',
  },
  nextLevelCard: {
    backgroundColor: '#FFF8E1',
    marginHorizontal: 15,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFECB3',
  },
  rewardsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  rewardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9800',
    marginLeft: 10,
  },
  rewardsList: {
    marginLeft: 10,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rewardText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  progressHint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  hintText: {
    fontSize: 12,
    color: '#856404',
    marginLeft: 10,
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 5,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFF',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    elevation: 2,
  },
  seeAllText: {
    fontSize: 16,
    color: '#2196F3',
    fontWeight: '600',
    marginRight: 10,
  },
  challengesList: {
    paddingHorizontal: 15,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  badgeIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeIcon: {
    fontSize: 30,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  badgeProgress: {
    width: '100%',
    height: 6,
    marginBottom: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  activityCard: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  activityIcon: {
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  xpBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  xpBadgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tipsCard: {
    backgroundColor: '#F3E5F5',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E1BEE7',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9C27B0',
    marginLeft: 10,
  },
  tipsList: {
    marginLeft: 10,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
    flex: 1,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    margin: 15,
    padding: 18,
    borderRadius: 12,
    elevation: 3,
  },
  shareButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default GamificationDashboard;
