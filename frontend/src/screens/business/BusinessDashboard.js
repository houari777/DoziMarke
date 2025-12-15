// 📱 frontend/src/screens/business/BusinessDashboard.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LineChart, BarChart } from 'react-native-chart-kit';
import LevelBadge from '../../components/business/LevelBadge';
import ProgressBar from '../../components/business/ProgressBar';
import AchievementCard from '../../components/business/AchievementCard';
import Loading from '../../components/shared/Loading';
import Header from '../../components/shared/Header';

const BusinessDashboard = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [realTimeStats, setRealTimeStats] = useState({
    sales: 0,
    orders: 0,
    visitors: 0,
    revenue: 0,
  });

  useEffect(() => {
    fetchDashboardData();
    setupWebSocket();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // محاكاة بيانات API
      const mockData = {
        business: {
          name: 'متجر التقنية المتقدمة',
          level: 7,
          xp: 8500,
          rank: 42,
          streak: 14,
          coins: 1250,
          gems: 25,
        },
        stats: {
          dailySales: 15,
          dailyRevenue: 7500,
          pendingOrders: 8,
          activeProducts: 45,
          customerRating: 4.8,
          growthRate: 12.5,
        },
        achievements: [
          { id: 1, name: 'أول عملية بيع 🎯', icon: '🎯', date: '2024-01-15' },
          { id: 2, name: '100 عملية بيع 🏆', icon: '🏆', date: '2024-02-20' },
          { id: 3, name: 'تصنيف 5 نجوم ⭐', icon: '⭐', date: '2024-03-10' },
        ],
        challenges: [
          {
            id: 1,
            name: 'إكمال 10 مبيعات اليوم',
            progress: 7,
            total: 10,
            reward: 100,
          },
          { id: 2, name: 'تحديث 5 منتجات', progress: 3, total: 5, reward: 50 },
          {
            id: 3,
            name: 'الرد على جميع الاستفسارات',
            progress: 100,
            total: 100,
            reward: 75,
          },
        ],
        leaderboard: [
          { rank: 1, name: 'متجر الذهب', xp: 25000 },
          { rank: 2, name: 'بقالة النخبة', xp: 23000 },
          { rank: 3, name: 'متجر التقنية', xp: 21000 },
          { rank: 42, name: 'أنت', xp: 8500 },
        ],
      };

      // محاكاة تأخير الشبكة
      setTimeout(() => {
        setDashboardData(mockData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // محاكاة اتصال WebSocket
    setInterval(() => {
      setRealTimeStats(prev => ({
        sales: prev.sales + Math.floor(Math.random() * 3),
        orders: prev.orders + (Math.random() > 0.5 ? 1 : 0),
        visitors: prev.visitors + Math.floor(Math.random() * 10),
        revenue: prev.revenue + Math.floor(Math.random() * 1000),
      }));
    }, 5000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
    setTimeout(() => setRefreshing(false), 2000);
  };

  if (loading) {
    return <Loading message="جاري تحميل لوحة التحكم..." />;
  }

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header title="لوحة تحكم التاجر" />

      {/* بطاقة المستوى والإحصائيات */}
      <TouchableOpacity
        style={styles.gamificationCard}
        onPress={() => navigation.navigate('GamificationDashboard')}
      >
        <View style={styles.levelSection}>
          <LevelBadge level={dashboardData.business.level} />
          <View style={styles.xpInfo}>
            <Text style={styles.xpText}>
              {dashboardData.business.xp.toLocaleString()} XP
            </Text>
            <Text style={styles.rankText}>
              الترتيب: #{dashboardData.business.rank}
            </Text>
          </View>
        </View>

        <ProgressBar
          currentXP={dashboardData.business.xp}
          nextLevelXP={10000}
          height={10}
        />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Icon name="local-fire-department" size={20} color="#FF9800" />
            <Text style={styles.statValue}>
              {dashboardData.business.streak}
            </Text>
            <Text style={styles.statLabel}>يوم متتالي</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="paid" size={20} color="#4CAF50" />
            <Text style={styles.statValue}>{dashboardData.business.coins}</Text>
            <Text style={styles.statLabel}>عملة</Text>
          </View>

          <View style={styles.statItem}>
            <Icon name="diamond" size={20} color="#9C27B0" />
            <Text style={styles.statValue}>{dashboardData.business.gems}</Text>
            <Text style={styles.statLabel}>أحجار</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* الإحصائيات السريعة */}
      <View style={styles.quickStats}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>المبيعات اليوم</Title>
            <Paragraph style={styles.statValue}>
              {dashboardData.stats.dailySales} عملية
            </Paragraph>
            <View style={styles.statChange}>
              <Icon name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.changeText}>+12%</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>الإيرادات</Title>
            <Paragraph style={styles.statValue}>
              {dashboardData.stats.dailyRevenue.toLocaleString()} ر.س
            </Paragraph>
            <View style={styles.statChange}>
              <Icon name="trending-up" size={16} color="#4CAF50" />
              <Text style={styles.changeText}>+8%</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statTitle}>التقييم</Title>
            <Paragraph style={styles.statValue}>
              {dashboardData.stats.customerRating} ⭐
            </Paragraph>
            <View style={styles.statChange}>
              <Icon name="star" size={16} color="#FFC107" />
              <Text style={styles.changeText}>4.8/5</Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* الرسم البياني */}
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>أداء المبيعات الأسبوعي</Title>
          <LineChart
            data={{
              labels: ['س', 'أ', 'ث', 'أ', 'خ', 'ج', 'س'],
              datasets: [
                {
                  data: [20, 45, 28, 80, 99, 43, 65],
                  color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: { borderRadius: 16 },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* التحديات اليومية */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>تحديات اليوم ⏳</Title>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          {dashboardData.challenges.map((challenge, index) => (
            <TouchableOpacity key={challenge.id} style={styles.challengeItem}>
              <View style={styles.challengeInfo}>
                <Text style={styles.challengeName}>{challenge.name}</Text>
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${
                          (challenge.progress / challenge.total) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.progressText}>
                  {challenge.progress}/{challenge.total}
                </Text>
              </View>
              <View style={styles.rewardBadge}>
                <Text style={styles.rewardText}>+{challenge.reward} XP</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* الإنجازات الحديثة */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>إنجازاتك 🏆</Title>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dashboardData.achievements.map(achievement => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onPress={() => console.log('View achievement details')}
              />
            ))}
          </ScrollView>
        </Card.Content>
      </Card>

      {/* لوحة المتصدرين المصغرة */}
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Title style={styles.sectionTitle}>أفضل التجار هذا الأسبوع 🏅</Title>

          {dashboardData.leaderboard.slice(0, 3).map((item, index) => (
            <View key={index} style={styles.leaderboardItem}>
              <View style={styles.rankContainer}>
                <View
                  style={[
                    styles.rankBadge,
                    item.rank === 1 && styles.rank1,
                    item.rank === 2 && styles.rank2,
                    item.rank === 3 && styles.rank3,
                  ]}
                >
                  <Text style={styles.rankText}>{item.rank}</Text>
                </View>
                <Text style={styles.leaderboardName}>{item.name}</Text>
              </View>
              <Text style={styles.leaderboardXP}>
                {item.xp.toLocaleString()} XP
              </Text>
            </View>
          ))}

          {dashboardData.leaderboard.find(item => item.name === 'أنت') && (
            <View style={styles.yourRank}>
              <Text style={styles.yourRankText}>
                مرتبتك: #{dashboardData.business.rank}
              </Text>
              <TouchableOpacity style={styles.viewFullButton}>
                <Text style={styles.viewFullText}>عرض اللائحة الكاملة</Text>
                <Icon name="chevron-left" size={16} color="#2196F3" />
              </TouchableOpacity>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* التنبيهات الذكية */}
      <Card style={styles.alertCard}>
        <Card.Content>
          <View style={styles.alertHeader}>
            <Icon name="lightbulb" size={24} color="#FFC107" />
            <Title style={styles.alertTitle}>توصيات الذكاء الاصطناعي 💡</Title>
          </View>

          <View style={styles.alertItem}>
            <Icon name="arrow-upward" size={16} color="#4CAF50" />
            <Text style={styles.alertText}>
              خفض سعر المنتج X بنسبة 5% لزيادة المبيعات بنسبة 15% المتوقعة
            </Text>
          </View>

          <View style={styles.alertItem}>
            <Icon name="warning" size={16} color="#F44336" />
            <Text style={styles.alertText}>
              المنافس Y خفض أسعاره، جرب التفاوض الآلي مع الموردين
            </Text>
          </View>

          <TouchableOpacity style={styles.applyAllButton}>
            <Text style={styles.applyAllText}>
              تطبيق جميع التوصيات تلقائياً
            </Text>
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  gamificationCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  levelSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  xpInfo: {
    marginLeft: 15,
    flex: 1,
  },
  xpText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  rankText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  changeText: {
    fontSize: 12,
    color: '#4CAF50',
    marginLeft: 5,
  },
  chartCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#2196F3',
    fontSize: 14,
  },
  challengeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  challengeInfo: {
    flex: 1,
  },
  challengeName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  rewardBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  rewardText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rank1: { backgroundColor: '#FFD700' },
  rank2: { backgroundColor: '#C0C0C0' },
  rank3: { backgroundColor: '#CD7F32' },
  rankText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  leaderboardName: {
    fontSize: 14,
    color: '#333',
  },
  leaderboardXP: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  yourRank: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  yourRankText: {
    fontSize: 14,
    color: '#666',
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewFullText: {
    color: '#2196F3',
    fontSize: 12,
    marginRight: 5,
  },
  alertCard: {
    margin: 15,
    backgroundColor: '#FFF8E1',
    borderWidth: 1,
    borderColor: '#FFECB3',
    elevation: 2,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  alertTitle: {
    fontSize: 16,
    color: '#FF9800',
    marginLeft: 10,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  applyAllButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  applyAllText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default BusinessDashboard;
