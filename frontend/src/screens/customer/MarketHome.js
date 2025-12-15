
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Searchbar, Card, Title, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Loading from '../../components/shared/Loading';

const MarketHome = ({ navigation }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [liveAuctions, setLiveAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 70],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0.8],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);

      // محاكاة بيانات المميزة
      const mockFeatured = [
        {
          id: 1,
          name: 'عروض نهاية الأسبوع',
          description: 'خصومات تصل إلى 50%',
          image: 'https://via.placeholder.com/300x150/FF6B6B/FFFFFF',
          type: 'banner',
        },
        {
          id: 2,
          name: 'أحدث المنتجات',
          description: 'اكتشف الجديد أولاً بأول',
          image: 'https://via.placeholder.com/300x150/4ECDC4/FFFFFF',
          type: 'banner',
        },
      ];

      // محاكاة الفئات
      const mockCategories = [
        { id: 1, name: 'إلكترونيات', icon: 'devices', color: '#2196F3', count: 245 },
        { id: 2, name: 'ملابس', icon: 'checkroom', color: '#FF9800', count: 189 },
        { id: 3, name: 'منزل', icon: 'home', color: '#4CAF50', count: 156 },
        { id: 4, name: 'رياضة', icon: 'sports', color: '#F44336', count: 98 },
        { id: 5, name: 'كتب', icon: 'menu-book', color: '#9C27B0', count: 76 },
        { id: 6, name: 'أطفال', icon: 'child-care', color: '#FFC107', count: 112 },
      ];

      // محاكاة المنتجات المميزة
      const mockProducts = [
        {
          id: 1,
          name: 'هاتف ذكي X10',
          store: 'متجر التقنية',
          price: 2499,
          originalPrice: 2999,
          discount: 17,
          rating: 4.5,
          image: 'https://via.placeholder.com/150',
          isSmartDeal: true,
          isLive: false,
        },
        {
          id: 2,
          name: 'ساعة ذكية Pro',
          store: 'متجر الالكترونيات',
          price: 899,
          originalPrice: 1099,
          discount: 18,
          rating: 4.7,
          image: 'https://via.placeholder.com/150',
          isSmartDeal: true,
          isLive: true,
        },
        {
          id: 3,
          name: 'حذاء رياضي',
          store: 'متجر الرياضة',
          price: 299,
          originalPrice: 399,
          discount: 25,
          rating: 4.3,
          image: 'https://via.placeholder.com/150',
          isSmartDeal: false,
          isLive: false,
        },
        {
          id: 4,
          name: 'سماعات لاسلكية',
          store: 'متجر الصوتيات',
          price: 399,
          originalPrice: 499,
          discount: 20,
          rating: 4.6,
          image: 'https://via.placeholder.com/150',
          isSmartDeal: true,
          isLive: true,
        },
      ];

      // محاكاة المزادات الحية
      const mockAuctions = [
        {
          id: 1,
          name: 'لوحة فنية نادرة',
          currentBid: 1500,
          endTime: '02:30:15',
          bidders: 12,
          image: 'https://via.placeholder.com/100',
        },
        {
          id: 2,
          name: 'ساعة يد فاخرة',
          currentBid: 3200,
          endTime: '01:15:30',
          bidders: 8,
          image: 'https://via.placeholder.com/100',
        },
        {
          id: 3,
          name: 'جهاز لوحي جديد',
          currentBid: 1800,
          endTime: '03:45:20',
          bidders: 15,
          image: 'https://via.placeholder.com/100',
        },
      ];

      setTimeout(() => {
        setFeaturedProducts(mockProducts);
        setCategories(mockCategories);
        setLiveAuctions(mockAuctions);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching home data:', error);
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeData();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={24} color="#FFF" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>({item.count})</Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {item.isSmartDeal && (
          <View style={styles.smartDealBadge}>
            <Icon name="auto-awesome" size={12} color="#FFF" />
            <Text style={styles.smartDealText">صفقة ذكية</Text>
              </View>
              )}

              {item.isLive && (
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText">مباشر</Text>
                    </View>
                    )}

                        {item.discount > 0 && (
                          <View style={styles.discountBadge}>
                            <Text style={styles.discountText">{item.discount}%</Text>
                              </View>
                              )}
                          </View>

                          <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.storeName}>{item.store}</Text>

                    <View style={styles.priceContainer}>
                      <Text style={styles.price}>{item.price} ر.س</Text>
                      {item.originalPrice && (
                        <Text style={styles.originalPrice}>{item.originalPrice} ر.س</Text>
                      )}
                    </View>

                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={14} color="#FFC107" />
                      <Text style={styles.rating}>{item.rating}</Text>
                      <Text style={styles.ratingCount}>({Math.floor(Math.random() * 100)})</Text>
                    </View>

                    <TouchableOpacity style={styles.quickActionButton}>
                      <Icon name="shopping-cart" size={16} color="#2196F3" />
                      <Text style={styles.quickActionText">أضف للسلة</Text>
                        </TouchableOpacity>
                        </View>
                        </TouchableOpacity>
                        );

                        const renderAuction = ({ item }) => (
                        <TouchableOpacity style={styles.auctionCard}>
                        <Image source={{ uri: item.image }} style={styles.auctionImage} />

                        <View style={styles.auctionInfo}>
                          <Text style={styles.auctionName} numberOfLines={1}>
                            {item.name}
                          </Text>

                          <View style={styles.auctionStats}>
                            <View style={styles.bidInfo}>
                              <Text style={styles.bidLabel">المبلغ الحالي</Text>
                                <Text style={styles.bidAmount}>{item.currentBid} ر.س</Text>
                                </View>

                                <View style={styles.bidderInfo}>
                                <Icon name="people" size={14} color="#666" />
                                <Text style={styles.bidderCount">{item.bidders}</Text>
                                  </View>
                                  </View>

                                  <View style={styles.timerContainer}>
                                  <Icon name="schedule" size={14} color="#FF9800" />
                                  <Text style={styles.timerText}>{item.endTime}</Text>
                            </View>

                            <TouchableOpacity style={styles.bidButton}>
                              <Text style={styles.bidButtonText">المزايدة الآن</Text>
                                </TouchableOpacity>
                                </View>
                                </TouchableOpacity>
                                );

                                if (loading) {
                                return <Loading message="جاري تحميل المتجر..." />;
                              }

                                return (
                              <View style={styles.container}>
                                {/* شريط البحث المتحرك */}
                                <Animated.View style={[styles.header, {
                                  height: headerHeight,
                                  opacity: headerOpacity,
                                }]}>
                                  <View style={styles.headerContent}>
                                    <View style={styles.welcomeSection}>
                                      <Text style={styles.welcomeText}>مرحباً بك في</Text>
                                      <Text style={styles.appName">دوزي ماركت</Text>
                                        </View>

                                        <View style={styles.actions}>
                                        <TouchableOpacity style={styles.notificationButton}>
                                          <Icon name="notifications" size={24} color="#333" />
                                          <View style={styles.notificationBadge}>
                                            <Text style={styles.badgeText">3</Text>
                                              </View>
                                              </TouchableOpacity>

                                              <TouchableOpacity style={styles.cartButton}>
                                              <Icon name="shopping-cart" size={24} color="#333" />
                                              <View style={styles.cartBadge}>
                                                <Text style={styles.badgeText">5</Text>
                                                  </View>
                                                  </TouchableOpacity>
                                                  </View>
                                                  </View>

                                                  <Searchbar
                                                  placeholder="ابحث عن منتجات أو متاجر..."
                                                  onChangeText={setSearchQuery}
                                                      value={searchQuery}
                                                      style={styles.searchBar}
                                                      iconColor="#666"
                                                />
                                </Animated.View>

                                <Animated.ScrollView
                                  style={styles.content}
                                  onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                  )}
                                  scrollEventThrottle={16}
                                  refreshControl={
                                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                                  }
                                >
                                  {/* بانر العرض المميز */}
                                  <View style={styles.bannerSection}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                      <TouchableOpacity style={styles.bannerCard}>
                                        <Image
                                          source={{ uri: 'https://via.placeholder.com/300x150/FF6B6B/FFFFFF' }}
                                          style={styles.bannerImage}
                                        />
                                        <View style={styles.bannerOverlay}>
                                          <Text style={styles.bannerTitle}>عروض نهاية الأسبوع</Text>
                                          <Text style={styles.bannerSubtitle">خصومات تصل إلى 50%</Text>
                                            <TouchableOpacity style={styles.bannerButton}>
                                            <Text style={styles.bannerButtonText">تسوق الآن</Text>
                                            </TouchableOpacity>
                                            </View>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={styles.bannerCard}>
                                            <Image
                                              source={{ uri: 'https://via.placeholder.com/300x150/4ECDC4/FFFFFF' }}
                                              style={styles.bannerImage}
                                            />
                                            <View style={styles.bannerOverlay}>
                                              <Text style={styles.bannerTitle">أحدث المنتجات</Text>
                                                <Text style={styles.bannerSubtitle">اكتشف الجديد أولاً بأول</Text>
                                                <TouchableOpacity style={styles.bannerButton}>
                                                <Text style={styles.bannerButtonText">استعرض</Text>
                                                </TouchableOpacity>
                                                </View>
                                                </TouchableOpacity>
                                                </ScrollView>
                                                </View>

                                              {/* الفئات */}
                                                <View style={styles.section}>
                                                <View style={styles.sectionHeader}>
                                                  <Text style={styles.sectionTitle">التصنيفات</Text>
                                                    <TouchableOpacity>
                                                    <Text style={styles.seeAllText">عرض الكل</Text>
                                                    </TouchableOpacity>
                                                    </View>

                                                    <FlatList
                                                    data={categories}
                                                        renderItem={renderCategory}
                                                        keyExtractor={item => item.id.toString()}
                                                        horizontal
                                                        showsHorizontalScrollIndicator={false}
                                                        contentContainerStyle={styles.categoriesList}
                                                  />
                                                </View>

                                                {/* المنتجات المميزة */}
                                                <View style={styles.section}>
                                                  <View style={styles.sectionHeader}>
                                                    <Text style={styles.sectionTitle">صفقات ذكية خاصة لك 💡</Text>
                                                      <TouchableOpacity>
                                                      <Text style={styles.seeAllText">عرض الكل</Text>
                                                      </TouchableOpacity>
                                                      </View>

                                                      <FlatList
                                                      data={featuredProducts}
                                                          renderItem={renderProduct}
                                                          keyExtractor={item => item.id.toString()}
                                                          horizontal
                                                          showsHorizontalScrollIndicator={false}
                                                          contentContainerStyle={styles.productsList}
                                                    />
                                                  </View>

                                                  {/* المزادات الحية */}
                                                  <View style={styles.section}>
                                                    <View style={styles.sectionHeader}>
                                                      <View style={styles.auctionHeader}>
                                                        <Icon name="gavel" size={20} color="#FF9800" />
                                                        <Text style={styles.sectionTitle">المزادات الحية ⚡</Text>
                                                          </View>
                                                          <TouchableOpacity>
                                                          <Text style={styles.seeAllText">جميع المزادات</Text>
                                                          </TouchableOpacity>
                                                          </View>

                                                          <FlatList
                                                          data={liveAuctions}
                                                              renderItem={renderAuction}
                                                              keyExtractor={item => item.id.toString()}
                                                              horizontal
                                                              showsHorizontalScrollIndicator={false}
                                                              contentContainerStyle={styles.auctionsList}
                                                        />
                                                      </View>

                                                      {/* عروض اليوم */}
                                                      <View style={styles.section}>
                                                        <View style={styles.sectionHeader}>
                                                          <Icon name="flash-on" size={20} color="#F44336" />
                                                          <Text style={styles.sectionTitle">عروض اليوم السريعة ⏰</Text>
                                                            </View>

                                                            <View style={styles.quickOffers}>
                                                            <TouchableOpacity style={styles.quickOfferCard}>
                                                              <View style={styles.offerIcon}>
                                                                <Icon name="local-offer" size={24} color="#FF5722" />
                                                              </View>
                                                              <Text style={styles.offerText">خصم 30% على الإلكترونيات</Text>
                                                                <Text style={offerTimeText">ينتهي خلال 4 ساعات</Text>
                                                                </TouchableOpacity>

                                                                <TouchableOpacity style={styles.quickOfferCard}>
                                                                <View style={styles.offerIcon}>
                                                                  <Icon name="local-shipping" size={24} color="#4CAF50" />
                                                                </View>
                                                                <Text style={styles.offerText">شحن مجاني للطلبات فوق 200 ريال</Text>
                                                                  <Text style={offerTimeText">لمدة محدودة</Text>
                                                                  </TouchableOpacity>
                                                                  </View>
                                                                  </View>

                                                                {/* المتاجر المميزة */}
                                                                  <View style={styles.section}>
                                                                  <View style={styles.sectionHeader}>
                                                                    <Text style={styles.sectionTitle">متاجر مميزة 🏆</Text>
                                                                      <TouchableOpacity>
                                                                      <Text style={styles.seeAllText">جميع المتاجر</Text>
                                                                      </TouchableOpacity>
                                                                      </View>

                                                                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                                      {[1, 2, 3].map((item) => (
                                                                        <TouchableOpacity key={item} style={styles.storeCard}>
                                                                          <Image
                                                                            source={{ uri: 'https://via.placeholder.com/80' }}
                                                                            style={styles.storeImage}
                                                                          />
                                                                          <Text style={styles.storeName">متجر التقنية</Text>
                                                                            <Text style={styles.storeRating}>4.8 ⭐</Text>
                                                                            <Text style={styles.storeProducts}>245 منتج</Text>
                                                                        </TouchableOpacity>
                                                                      ))}
                                                                        </ScrollView>
                                                                        </View>

                                                                      {/* الذكاء الاصطناعي */}
                                                                        <View style={styles.aiSection}>
                                                                      <View style={styles.aiHeader}>
                                                                        <Icon name="auto-awesome" size={24} color="#9C27B0" />
                                                                        <Text style={styles.aiTitle}>مساعد الذكاء الاصطناعي</Text>
                                                                      </View>

                                                                      <Text style={styles.aiDescription">
                                                                        ابحث عن أفضل الصفقات بناءً على تفضيلاتك وإنفاقك السابق
                                                                        </Text>

                                                                        <TouchableOpacity style={styles.aiButton}>
                                                                        <Icon name="smart-toy" size={20} color="#FFF" />
                                                                        <Text style={styles.aiButtonText">ابدأ البحث الذكي</Text>
                                                                          </TouchableOpacity>
                                                                          </View>
                                                                          </Animated.ScrollView>
                                                                          </View>
                                                                          );
                                                                        };

                                                                          const styles = StyleSheet.create({
                                                                          container: {
                                                                          flex: 1,
                                                                          backgroundColor: '#F5F5F5',
                                                                        },
                                                                          header: {
                                                                          backgroundColor: '#FFF',
                                                                          paddingHorizontal: 15,
                                                                          paddingTop: 10,
                                                                          elevation: 4,
                                                                          shadowColor: '#000',
                                                                          shadowOffset: { width: 0, height: 2 },
                                                                          shadowOpacity: 0.1,
                                                                          shadowRadius: 4,
                                                                        },
                                                                          headerContent: {
                                                                          flexDirection: 'row',
                                                                          justifyContent: 'space-between',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          welcomeSection: {},
                                                                          welcomeText: {
                                                                          fontSize: 12,
                                                                          color: '#666',
                                                                        },
                                                                          appName: {
                                                                          fontSize: 20,
                                                                          fontWeight: 'bold',
                                                                          color: '#2196F3',
                                                                        },
                                                                          actions: {
                                                                          flexDirection: 'row',
                                                                        },
                                                                          notificationButton: {
                                                                          marginRight: 15,
                                                                          position: 'relative',
                                                                        },
                                                                          cartButton: {
                                                                          position: 'relative',
                                                                        },
                                                                          notificationBadge: {
                                                                          position: 'absolute',
                                                                          top: -5,
                                                                          right: -5,
                                                                          backgroundColor: '#F44336',
                                                                          width: 18,
                                                                          height: 18,
                                                                          borderRadius: 9,
                                                                          justifyContent: 'center',
                                                                          alignItems: 'center',
                                                                        },
                                                                          cartBadge: {
                                                                          position: 'absolute',
                                                                          top: -5,
                                                                          right: -5,
                                                                          backgroundColor: '#4CAF50',
                                                                          width: 18,
                                                                          height: 18,
                                                                          borderRadius: 9,
                                                                          justifyContent: 'center',
                                                                          alignItems: 'center',
                                                                        },
                                                                          badgeText: {
                                                                          color: '#FFF',
                                                                          fontSize: 10,
                                                                          fontWeight: 'bold',
                                                                        },
                                                                          searchBar: {
                                                                          elevation: 0,
                                                                          backgroundColor: '#F5F5F5',
                                                                          borderRadius: 25,
                                                                          marginBottom: 10,
                                                                        },
                                                                          content: {
                                                                          flex: 1,
                                                                        },
                                                                          bannerSection: {
                                                                          paddingVertical: 15,
                                                                        },
                                                                          bannerCard: {
                                                                          width: 300,
                                                                          height: 150,
                                                                          borderRadius: 12,
                                                                          marginHorizontal: 10,
                                                                          overflow: 'hidden',
                                                                          position: 'relative',
                                                                        },
                                                                          bannerImage: {
                                                                          width: '100%',
                                                                          height: '100%',
                                                                        },
                                                                          bannerOverlay: {
                                                                          position: 'absolute',
                                                                          bottom: 0,
                                                                          left: 0,
                                                                          right: 0,
                                                                          backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                                          padding: 15,
                                                                        },
                                                                          bannerTitle: {
                                                                          color: '#FFF',
                                                                          fontSize: 18,
                                                                          fontWeight: 'bold',
                                                                          marginBottom: 5,
                                                                        },
                                                                          bannerSubtitle: {
                                                                          color: '#FFF',
                                                                          fontSize: 14,
                                                                          marginBottom: 10,
                                                                        },
                                                                          bannerButton: {
                                                                          backgroundColor: '#2196F3',
                                                                          paddingHorizontal: 20,
                                                                          paddingVertical: 8,
                                                                          borderRadius: 20,
                                                                          alignSelf: 'flex-start',
                                                                        },
                                                                          bannerButtonText: {
                                                                          color: '#FFF',
                                                                          fontSize: 14,
                                                                          fontWeight: 'bold',
                                                                        },
                                                                          section: {
                                                                          marginVertical: 10,
                                                                          paddingHorizontal: 15,
                                                                        },
                                                                          sectionHeader: {
                                                                          flexDirection: 'row',
                                                                          justifyContent: 'space-between',
                                                                          alignItems: 'center',
                                                                          marginBottom: 15,
                                                                        },
                                                                          auctionHeader: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                        },
                                                                          sectionTitle: {
                                                                          fontSize: 18,
                                                                          fontWeight: 'bold',
                                                                          color: '#333',
                                                                          marginLeft: 10,
                                                                        },
                                                                          seeAllText: {
                                                                          color: '#2196F3',
                                                                          fontSize: 14,
                                                                        },
                                                                          categoriesList: {
                                                                          paddingRight: 15,
                                                                        },
                                                                          categoryCard: {
                                                                          alignItems: 'center',
                                                                          marginRight: 20,
                                                                        },
                                                                          categoryIcon: {
                                                                          width: 60,
                                                                          height: 60,
                                                                          borderRadius: 30,
                                                                          justifyContent: 'center',
                                                                          alignItems: 'center',
                                                                          marginBottom: 8,
                                                                        },
                                                                          categoryName: {
                                                                          fontSize: 14,
                                                                          color: '#333',
                                                                          marginBottom: 2,
                                                                        },
                                                                          categoryCount: {
                                                                          fontSize: 12,
                                                                          color: '#666',
                                                                        },
                                                                          productsList: {
                                                                          paddingRight: 15,
                                                                        },
                                                                          productCard: {
                                                                          width: 160,
                                                                          backgroundColor: '#FFF',
                                                                          borderRadius: 12,
                                                                          marginRight: 15,
                                                                          padding: 10,
                                                                          elevation: 2,
                                                                          shadowColor: '#000',
                                                                          shadowOffset: { width: 0, height: 1 },
                                                                          shadowOpacity: 0.1,
                                                                          shadowRadius: 2,
                                                                        },
                                                                          productImageContainer: {
                                                                          position: 'relative',
                                                                          marginBottom: 10,
                                                                        },
                                                                          productImage: {
                                                                          width: '100%',
                                                                          height: 120,
                                                                          borderRadius: 8,
                                                                          backgroundColor: '#F0F0F0',
                                                                        },
                                                                          smartDealBadge: {
                                                                          position: 'absolute',
                                                                          top: 5,
                                                                          left: 5,
                                                                          backgroundColor: '#4CAF50',
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          paddingHorizontal: 8,
                                                                          paddingVertical: 4,
                                                                          borderRadius: 10,
                                                                        },
                                                                          smartDealText: {
                                                                          color: '#FFF',
                                                                          fontSize: 10,
                                                                          fontWeight: 'bold',
                                                                          marginLeft: 4,
                                                                        },
                                                                          liveBadge: {
                                                                          position: 'absolute',
                                                                          top: 5,
                                                                          right: 5,
                                                                          backgroundColor: '#F44336',
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          paddingHorizontal: 8,
                                                                          paddingVertical: 4,
                                                                          borderRadius: 10,
                                                                        },
                                                                          liveDot: {
                                                                          width: 6,
                                                                          height: 6,
                                                                          borderRadius: 3,
                                                                          backgroundColor: '#FFF',
                                                                          marginRight: 4,
                                                                        },
                                                                          liveText: {
                                                                          color: '#FFF',
                                                                          fontSize: 10,
                                                                          fontWeight: 'bold',
                                                                        },
                                                                          discountBadge: {
                                                                          position: 'absolute',
                                                                          bottom: 5,
                                                                          right: 5,
                                                                          backgroundColor: '#FF5722',
                                                                          paddingHorizontal: 6,
                                                                          paddingVertical: 3,
                                                                          borderRadius: 6,
                                                                        },
                                                                          discountText: {
                                                                          color: '#FFF',
                                                                          fontSize: 10,
                                                                          fontWeight: 'bold',
                                                                        },
                                                                          productInfo: {
                                                                          flex: 1,
                                                                        },
                                                                          productName: {
                                                                          fontSize: 14,
                                                                          fontWeight: '600',
                                                                          color: '#333',
                                                                          marginBottom: 4,
                                                                        },
                                                                          storeName: {
                                                                          fontSize: 12,
                                                                          color: '#666',
                                                                          marginBottom: 8,
                                                                        },
                                                                          priceContainer: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          marginBottom: 8,
                                                                        },
                                                                          price: {
                                                                          fontSize: 16,
                                                                          fontWeight: 'bold',
                                                                          color: '#2196F3',
                                                                          marginRight: 8,
                                                                        },
                                                                          originalPrice: {
                                                                          fontSize: 12,
                                                                          color: '#999',
                                                                          textDecorationLine: 'line-through',
                                                                        },
                                                                          ratingContainer: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          rating: {
                                                                          fontSize: 12,
                                                                          fontWeight: 'bold',
                                                                          marginLeft: 4,
                                                                          marginRight: 4,
                                                                        },
                                                                          ratingCount: {
                                                                          fontSize: 10,
                                                                          color: '#666',
                                                                        },
                                                                          quickActionButton: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          justifyContent: 'center',
                                                                          backgroundColor: '#F5F5F5',
                                                                          padding: 8,
                                                                          borderRadius: 8,
                                                                        },
                                                                          quickActionText: {
                                                                          fontSize: 12,
                                                                          color: '#2196F3',
                                                                          marginLeft: 5,
                                                                        },
                                                                          auctionsList: {
                                                                          paddingRight: 15,
                                                                        },
                                                                          auctionCard: {
                                                                          width: 200,
                                                                          backgroundColor: '#FFF',
                                                                          borderRadius: 12,
                                                                          marginRight: 15,
                                                                          overflow: 'hidden',
                                                                          elevation: 2,
                                                                        },
                                                                          auctionImage: {
                                                                          width: '100%',
                                                                          height: 120,
                                                                          backgroundColor: '#F0F0F0',
                                                                        },
                                                                          auctionInfo: {
                                                                          padding: 10,
                                                                        },
                                                                          auctionName: {
                                                                          fontSize: 14,
                                                                          fontWeight: '600',
                                                                          color: '#333',
                                                                          marginBottom: 10,
                                                                        },
                                                                          auctionStats: {
                                                                          flexDirection: 'row',
                                                                          justifyContent: 'space-between',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          bidInfo: {},
                                                                          bidLabel: {
                                                                          fontSize: 10,
                                                                          color: '#666',
                                                                          marginBottom: 2,
                                                                        },
                                                                          bidAmount: {
                                                                          fontSize: 16,
                                                                          fontWeight: 'bold',
                                                                          color: '#FF9800',
                                                                        },
                                                                          bidderInfo: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                        },
                                                                          bidderCount: {
                                                                          fontSize: 12,
                                                                          color: '#666',
                                                                          marginLeft: 4,
                                                                        },
                                                                          timerContainer: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          timerText: {
                                                                          fontSize: 12,
                                                                          color: '#FF9800',
                                                                          fontWeight: 'bold',
                                                                          marginLeft: 5,
                                                                        },
                                                                          bidButton: {
                                                                          backgroundColor: '#FF9800',
                                                                          padding: 10,
                                                                          borderRadius: 8,
                                                                          alignItems: 'center',
                                                                        },
                                                                          bidButtonText: {
                                                                          color: '#FFF',
                                                                          fontSize: 14,
                                                                          fontWeight: 'bold',
                                                                        },
                                                                          quickOffers: {
                                                                          flexDirection: 'row',
                                                                          justifyContent: 'space-between',
                                                                        },
                                                                          quickOfferCard: {
                                                                          flex: 1,
                                                                          backgroundColor: '#FFF',
                                                                          borderRadius: 12,
                                                                          padding: 15,
                                                                          marginHorizontal: 5,
                                                                          alignItems: 'center',
                                                                          elevation: 2,
                                                                        },
                                                                          offerIcon: {
                                                                          width: 50,
                                                                          height: 50,
                                                                          borderRadius: 25,
                                                                          backgroundColor: '#FFF7E6',
                                                                          justifyContent: 'center',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          offerText: {
                                                                          fontSize: 14,
                                                                          fontWeight: '600',
                                                                          color: '#333',
                                                                          textAlign: 'center',
                                                                          marginBottom: 5,
                                                                        },
                                                                          offerTimeText: {
                                                                          fontSize: 12,
                                                                          color: '#F44336',
                                                                        },
                                                                          storeCard: {
                                                                          alignItems: 'center',
                                                                          backgroundColor: '#FFF',
                                                                          borderRadius: 12,
                                                                          padding: 15,
                                                                          marginRight: 15,
                                                                          elevation: 2,
                                                                        },
                                                                          storeImage: {
                                                                          width: 80,
                                                                          height: 80,
                                                                          borderRadius: 40,
                                                                          marginBottom: 10,
                                                                        },
                                                                          storeName: {
                                                                          fontSize: 14,
                                                                          fontWeight: 'bold',
                                                                          color: '#333',
                                                                          marginBottom: 5,
                                                                        },
                                                                          storeRating: {
                                                                          fontSize: 12,
                                                                          color: '#FFC107',
                                                                          marginBottom: 5,
                                                                        },
                                                                          storeProducts: {
                                                                          fontSize: 11,
                                                                          color: '#666',
                                                                        },
                                                                          aiSection: {
                                                                          backgroundColor: '#F3E5F5',
                                                                          margin: 15,
                                                                          padding: 20,
                                                                          borderRadius: 15,
                                                                          alignItems: 'center',
                                                                        },
                                                                          aiHeader: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          marginBottom: 10,
                                                                        },
                                                                          aiTitle: {
                                                                          fontSize: 20,
                                                                          fontWeight: 'bold',
                                                                          color: '#9C27B0',
                                                                          marginLeft: 10,
                                                                        },
                                                                          aiDescription: {
                                                                          fontSize: 14,
                                                                          color: '#333',
                                                                          textAlign: 'center',
                                                                          marginBottom: 20,
                                                                          lineHeight: 22,
                                                                        },
                                                                          aiButton: {
                                                                          flexDirection: 'row',
                                                                          alignItems: 'center',
                                                                          backgroundColor: '#9C27B0',
                                                                          paddingHorizontal: 25,
                                                                          paddingVertical: 12,
                                                                          borderRadius: 25,
                                                                        },
                                                                          aiButtonText: {
                                                                          color: '#FFF',
                                                                          fontSize: 16,
                                                                          fontWeight: 'bold',
                                                                          marginLeft: 10,
                                                                        },
                                                                        });

                                                                          export default MarketHome;