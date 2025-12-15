// 📱 frontend/src/screens/customer/ProductDiscovery.js
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';
import { Searchbar, Chip, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import Loading from '../../components/shared/Loading';

const ProductDiscovery = ({ navigation, route }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState('relevant');
  const [filters, setFilters] = useState({
    category: '',
    price: [0, 5000],
    rating: 0,
    shipping: 'all',
    condition: 'all',
    smartDeals: false,
    liveOnly: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState([]);

  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    fetchProducts();
    fetchAiRecommendations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, sortBy, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const mockProducts = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `منتج ${i + 1}`,
        category: i % 5 === 0 ? 'إلكترونيات' :
          i % 5 === 1 ? 'ملابس' :
            i % 5 === 2 ? 'منزل' :
              i % 5 === 3 ? 'رياضة' : 'كتب',
        price: Math.floor(Math.random() * 5000) + 100,
        originalPrice: Math.floor(Math.random() * 6000) + 100,
        discount: Math.floor(Math.random() * 50),
        rating: (Math.random() * 5).toFixed(1),
        reviews: Math.floor(Math.random() * 1000),
        store: `متجر ${Math.floor(Math.random() * 10) + 1}`,
        storeRating: (Math.random() * 5).toFixed(1),
        image: `https://via.placeholder.com/150?text=Product+${i + 1}`,
        isSmartDeal: Math.random() > 0.7,
        isLive: Math.random() > 0.8,
        shipping: Math.random() > 0.5 ? 'free' : 'paid',
        condition: Math.random() > 0.5 ? 'new' : 'used',
        stock: Math.floor(Math.random() * 100),
      }));

      setTimeout(() => {
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchAiRecommendations = async () => {
    const mockRecommendations = [
      { id: 1, name: 'هواتف ذكية', reason: 'بناءً على مشاهداتك الأخيرة' },
      { id: 2, name: 'أجهزة لاب توب', reason: 'متوافقة مع احتياجات العمل' },
      { id: 3, name: 'سماعات بلوتوث', reason: 'تكملة لإلكترونياتك' },
    ];

    setAiRecommendations(mockRecommendations);
  };

  const applyFilters = () => {
    let filtered = [...products];

    // بحث بالنص
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.store.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // فلترة بالفئة
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(product => product.category === filters.category);
    }

    // فلترة بالسعر
    filtered = filtered.filter(product =>
      product.price >= filters.price[0] && product.price <= filters.price[1]
    );

    // فلترة بالتقييم
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // فلترة بالشحن
    if (filters.shipping !== 'all') {
      filtered = filtered.filter(product => product.shipping === filters.shipping);
    }

    // فلترة بالحالة
    if (filters.condition !== 'all') {
      filtered = filtered.filter(product => product.condition === filters.condition);
    }

    // صفقات ذكية فقط
    if (filters.smartDeals) {
      filtered = filtered.filter(product => product.isSmartDeal);
    }

    // مباشر فقط
    if (filters.liveOnly) {
      filtered = filtered.filter(product => product.isLive);
    }

    // الترتيب
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'best_selling':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // ذي صلة (أفضل مطابقة)
        break;
    }

    setFilteredProducts(filtered);
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      price: [0, 5000],
      rating: 0,
      shipping: 'all',
      condition: 'all',
      smartDeals: false,
      liveOnly: false,
    });
    setSearchQuery('');
    setSortBy('relevant');
  };

  const toggleFilters = () => {
    if (showFilters) {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowFilters(false));
    } else {
      setShowFilters(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

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

                            <TouchableOpacity style={styles.quickViewButton}>
                              <Icon name="zoom-in" size={16} color="#FFF" />
                            </TouchableOpacity>
                          </View>

                          <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>

                    <View style={styles.categoryChip}>
                      <Text style={styles.categoryText">{item.category}</Text>
                        </View>

                        <View style={styles.storeInfo}>
                        <Icon name="store" size={12} color="#666" />
                        <Text style={styles.storeName}>{item.store}</Text>
                        <Text style={styles.storeRating}>{item.storeRating} ⭐</Text>
                    </View>

                    <View style={styles.ratingContainer}>
                      <Icon name="star" size={14} color="#FFC107" />
                      <Text style={styles.rating">{item.rating}</Text>
                        <Text style={styles.reviewCount}>({item.reviews})</Text>
                        </View>

                        <View style={styles.priceContainer}>
                        <Text style={styles.price}>{item.price.toLocaleString()} ر.س</Text>
                        {item.originalPrice > item.price && (
                          <Text style={styles.originalPrice}>
                            {item.originalPrice.toLocaleString()} ر.س
                          </Text>
                        )}
                    </View>

                    <View style={styles.shippingInfo}>
                      <Icon
                        name="local-shipping"
                        size={14}
                        color={item.shipping === 'free' ? '#4CAF50' : '#666'}
                      />
                      <Text style={[
                        styles.shippingText,
                        item.shipping === 'free' && styles.freeShipping
                      ]}>
                        {item.shipping === 'free' ? 'شحن مجاني' : 'شحن مدفوع'}
                      </Text>
                    </View>

                    <View style={styles.stockInfo}>
                      <Text style={styles.stockText}>
                        {item.stock > 10 ? 'متوفر' : item.stock > 0 ? `بقي ${item.stock}` : 'نفذ'}
                      </Text>
                    </View>

                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.cartButton}>
                        <Icon name="shopping-cart" size={16} color="#2196F3" />
                        <Text style={styles.cartButtonText">أضف للسلة</Text>
                          </TouchableOpacity>

                          <TouchableOpacity style={styles.negotiateButton}>
                          <Icon name="tag" size={16} color="#FF9800" />
                          <Text style={styles.negotiateButtonText">تفاوض</Text>
                            </TouchableOpacity>
                            </View>
                            </View>
                            </TouchableOpacity>
                            );

                            if (loading) {
                            return <Loading message="جاري تحميل المنتجات..." />;
                          }

                            return (
                            <View style={styles.container}>
                            {/* شريط البحث والفلترة */}
                            <View style={styles.searchHeader}>
                              <Searchbar
                                placeholder="ابحث عن منتجات..."
                                onChangeText={setSearchQuery}
                                value={searchQuery}
                                style={styles.searchBar}
                                iconColor="#666"
                              />

                              <View style={styles.filterButtons}>
                                <TouchableOpacity
                                  style={styles.sortButton}
                                  onPress={() => {
                                    // عرض خيارات الترتيب
                                  }}
                                >
                                  <Icon name="sort" size={20} color="#666" />
                                  <Text style={styles.sortButtonText">
                                  {sortBy === 'relevant' ? 'الأكثر صلة' :
                                    sortBy === 'price_asc' ? 'السعر: منخفض-عالي' :
                                    sortBy === 'price_desc' ? 'السعر: عالي-منخفض' :
                                    sortBy === 'rating' ? 'الأعلى تقييماً' :
                                    sortBy === 'newest' ? 'الأحدث' : 'الأكثر مبيعاً'}
                                    </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                    style={styles.filterButton}
                                        onPress={toggleFilters}
                                  >
                                    <Icon name="filter-list" size={20} color="#666" />
                                    <Text style={styles.filterButtonText">فلترة</Text>
                                      </TouchableOpacity>
                                      </View>
                                      </View>

                                    {/* التوصيات الذكية */}
                                          {aiRecommendations.length > 0 && (
                                            <View style={styles.aiSection}>
                                              <Text style={styles.aiTitle}>توصيات الذكاء الاصطناعي لك 🤖</Text>
                                              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                {aiRecommendations.map(rec => (
                                                  <TouchableOpacity key={rec.id} style={styles.recommendationCard}>
                                                    <Text style={styles.recommendationName}>{rec.name}</Text>
                                                    <Text style={styles.recommendationReason}>{rec.reason}</Text>
                                                    <TouchableOpacity style={styles.exploreButton}>
                                                      <Text style={styles.exploreButtonText">استكشف</Text>
                                                        </TouchableOpacity>
                                                        </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                  </View>
                                                  )}

                                                {/* نتائج البحث */}
                                                <View style={styles.resultsHeader}>
                                                  <Text style={styles.resultsCount}>
                                                    {filteredProducts.length} منتج
                                                    {searchQuery && ` لـ "${searchQuery}"`}
                                                  </Text>

                                                  <TouchableOpacity onPress={resetFilters}>
                                                    <Text style={styles.resetText}>إعادة التعيين</Text>
                                                  </TouchableOpacity>
                                                </View>

                                                {/* قائمة المنتجات */}
                                                <FlatList
                                                  data={filteredProducts}
                                                  renderItem={renderProduct}
                                                  keyExtractor={item => item.id.toString()}
                                                  numColumns={2}
                                                  contentContainerStyle={styles.productsGrid}
                                                  columnWrapperStyle={styles.columnWrapper}
                                                  ListEmptyComponent={
                                                    <View style={styles.emptyState}>
                                                      <Icon name="search-off" size={80} color="#E0E0E0" />
                                                      <Text style={styles.emptyStateTitle">لا توجد نتائج</Text>
                                                        <Text style={styles.emptyStateText}>
                                                        حاول تغيير كلمات البحث أو الفلاتر
                                                        </Text>
                                                        <Button
                                                        mode="contained"
                                                        onPress={resetFilters}
                                                            style={styles.resetButton}
                                                      >
                                                        إعادة تعيين البحث
                                                      </Button>
                                                    </View>
                                                  }
                                                />

                                                {/* لوحة الفلاتر المنزلقة */}
                                                {showFilters && (
                                                  <Animated.View
                                                    style={[
                                                      styles.filterPanel,
                                                      { transform: [{ translateY: slideAnim }] }
                                                    ]}
                                                  >
                                                    <View style={styles.filterPanelHeader}>
                                                      <Text style={styles.filterPanelTitle">الفلاتر</Text>
                                                        <TouchableOpacity onPress={toggleFilters}>
                                                        <Icon name="close" size={24} color="#333" />
                                                        </TouchableOpacity>
                                                        </View>

                                                        <ScrollView style={styles.filterPanelContent}>
                                                        {/* فئة */}
                                                        <View style={styles.filterSection}>
                                                          <Text style={styles.filterSectionTitle">الفئة</Text>
                                                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                          {['all', 'إلكترونيات', 'ملابس', 'منزل', 'رياضة', 'كتب'].map(category => (
                                                            <Chip
                                                            key={category}
                                                                selected={filters.category === category}
                                                                onPress={() => setFilters({...filters, category})}
                                                                style={styles.categoryChip}
                                                                textStyle={styles.chipText}
                                                          >
                                                            {category === 'all' ? 'الكل' : category}
                                                          </Chip>
                                                          ))}
                                                        </ScrollView>
                                                    </View>

                                                    {/* نطاق السعر */}
                                                    <View style={styles.filterSection}>
                                                      <Text style={styles.filterSectionTitle}>
                                                        السعر: {filters.price[0]} - {filters.price[1]} ر.س
                                                      </Text>
                                                      <Slider
                                                        style={styles.slider}
                                                        minimumValue={0}
                                                        maximumValue={5000}
                                                        step={100}
                                                        value={filters.price[1]}
                                                        onValueChange={(value) => setFilters({
                                                          ...filters,
                                                          price: [filters.price[0], value]
                                                        })}
                                                        minimumTrackTintColor="#2196F3"
                                                        maximumTrackTintColor="#E0E0E0"
                                                        thumbTintColor="#2196F3"
                                                      />
                                                      <View style={styles.priceRangeLabels}>
                                                        <Text style={styles.priceLabel}>0 ر.س</Text>
                                                        <Text style={styles.priceLabel">5000 ر.س</Text>
                                                          </View>
                                                          </View>

                                                        {/* التقييم */}
                                                        <View style={styles.filterSection}>
                                                          <Text style={styles.filterSectionTitle">التقييم</Text>
                                                            <View style={styles.ratingFilter}>
                                                          {[4, 3, 2, 1].map(rating => (
                                                            <TouchableOpacity
                                                            key={rating}
                                                                style={[
                                                                  styles.ratingOption,
                                                                  filters.rating === rating && styles.selectedRating
                                                                ]}
                                                                onPress={() => setFilters({...filters, rating})}
                                                          >
                                                            <Icon name="star" size={16} color="#FFC107" />
                                                            <Text style={styles.ratingOptionText}>{rating}+ ⭐</Text>
                                                          </TouchableOpacity>
                                                          ))}
                                                        </View>
                                                      </View>

                                                      {/* الشحن */}
                                                      <View style={styles.filterSection}>
                                                        <Text style={styles.filterSectionTitle">الشحن</Text>
                                                          <View style={styles.filterOptions}>
                                                        {['all', 'free', 'paid'].map(option => (
                                                          <Chip
                                                          key={option}
                                                              selected={filters.shipping === option}
                                                              onPress={() => setFilters({...filters, shipping: option})}
                                                              style={styles.optionChip}
                                                        >
                                                          {option === 'all' ? 'الكل' :
                                                            option === 'free' ? 'شحن مجاني' : 'شحن مدفوع'}
                                                        </Chip>
                                                        ))}
                                                      </View>
                                                    </View>

                                                    {/* حالة المنتج */}
                                                    <View style={styles.filterSection}>
                                                      <Text style={styles.filterSectionTitle">الحالة</Text>
                                                        <View style={styles.filterOptions}>
                                                      {['all', 'new', 'used'].map(option => (
                                                        <Chip
                                                        key={option}
                                                            selected={filters.condition === option}
                                                            onPress={() => setFilters({...filters, condition: option})}
                                                            style={styles.optionChip}
                                                      >
                                                        {option === 'all' ? 'الكل' :
                                                          option === 'new' ? 'جديد' : 'مستعمل'}
                                                      </Chip>
                                                      ))}
                                                    </View>
                                                  </View>

                                                {/* خيارات خاصة */}
                                                  <View style={styles.filterSection}>
                                                <Text style={styles.filterSectionTitle">خيارات خاصة</Text>

                                                  <TouchableOpacity
                                                  style={styles.specialOption}
                                                  onPress={() => setFilters({...filters, smartDeals: !filters.smartDeals})}
                                                  >
                                                  <View style={styles.optionCheckbox}>
                                                {filters.smartDeals && (
                                                  <Icon name="check" size={16} color="#4CAF50" />
                                                )}
                                            </View>
                                            <View style={styles.optionContent}>
                                      <View style={styles.optionHeader}>
                                        <Icon name="auto-awesome" size={20} color="#4CAF50" />
                                        <Text style={styles.optionTitle">صفقات ذكية فقط</Text>
                                          </View>
                                          <Text style={styles.optionDescription">
                                          عرض المنتجات التي يوصي بها الذكاء الاصطناعي بناءً على تحليل السوق
                                          </Text>
                                          </View>
                                          </TouchableOpacity>

                                          <TouchableOpacity
                                          style={styles.specialOption}
                                              onPress={() => setFilters({...filters, liveOnly: !filters.liveOnly})}
                                        >
                                          <View style={styles.optionCheckbox}>
                                            {filters.liveOnly && (
                                              <Icon name="check" size={16} color="#F44336" />
                                            )}
                                          </View>
                                          <View style={styles.optionContent}>
                                            <View style={styles.optionHeader}>
                                              <Icon name="live-tv" size={20} color="#F44336" />
                                              <Text style={styles.optionTitle">مباشر فقط</Text>
                                                </View>
                                                <Text style={styles.optionDescription">
                                                عرض المنتجات التي تباع مباشرة عبر البث المباشر
                                                </Text>
                                                </View>
                                                </TouchableOpacity>
                                                </View>
                                                </ScrollView>

                                                <View style={styles.filterPanelFooter}>
                                                <Button
                                                  mode="outlined"
                                                  onPress={resetFilters}
                                                  style={styles.clearButton}
                                                >
                                                  مسح الكل
                                                </Button>

                                                <Button
                                                  mode="contained"
                                                  onPress={toggleFilters}
                                                  style={styles.applyButton}
                                                >
                                                  تطبيق الفلاتر
                                                </Button>
                                            </View>
                                          </Animated.View>
                                          )}
                                      </View>
                                      );
                                      };

                                      const styles = StyleSheet.create({
                                      container: {
                                      flex: 1,
                                      backgroundColor: '#F5F5F5',
                                    },
                                      searchHeader: {
                                      backgroundColor: '#FFF',
                                      padding: 15,
                                      elevation: 2,
                                    },
                                      searchBar: {
                                      elevation: 0,
                                      backgroundColor: '#F5F5F5',
                                      borderRadius: 25,
                                      marginBottom: 10,
                                    },
                                      filterButtons: {
                                      flexDirection: 'row',
                                    },
                                      sortButton: {
                                      flex: 1,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: '#F5F5F5',
                                      padding: 10,
                                      borderRadius: 8,
                                      marginRight: 10,
                                    },
                                      sortButtonText: {
                                      fontSize: 12,
                                      color: '#666',
                                      marginLeft: 8,
                                      flex: 1,
                                    },
                                      filterButton: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: '#F5F5F5',
                                      paddingHorizontal: 15,
                                      paddingVertical: 10,
                                      borderRadius: 8,
                                    },
                                      filterButtonText: {
                                      fontSize: 12,
                                      color: '#666',
                                      marginLeft: 8,
                                    },
                                      aiSection: {
                                      backgroundColor: '#FFF',
                                      padding: 15,
                                      marginBottom: 10,
                                    },
                                      aiTitle: {
                                      fontSize: 16,
                                      fontWeight: 'bold',
                                      color: '#333',
                                      marginBottom: 10,
                                    },
                                      recommendationCard: {
                                      backgroundColor: '#F0F9FF',
                                      padding: 12,
                                      borderRadius: 10,
                                      marginRight: 10,
                                      width: 200,
                                      borderWidth: 1,
                                      borderColor: '#B3E5FC',
                                    },
                                      recommendationName: {
                                      fontSize: 14,
                                      fontWeight: 'bold',
                                      color: '#2196F3',
                                      marginBottom: 5,
                                    },
                                      recommendationReason: {
                                      fontSize: 12,
                                      color: '#666',
                                      marginBottom: 10,
                                    },
                                      exploreButton: {
                                      backgroundColor: '#2196F3',
                                      paddingHorizontal: 15,
                                      paddingVertical: 6,
                                      borderRadius: 15,
                                      alignSelf: 'flex-start',
                                    },
                                      exploreButtonText: {
                                      color: '#FFF',
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                    },
                                      resultsHeader: {
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      paddingHorizontal: 15,
                                      paddingVertical: 10,
                                      backgroundColor: '#FFF',
                                    },
                                      resultsCount: {
                                      fontSize: 14,
                                      color: '#333',
                                      fontWeight: '600',
                                    },
                                      resetText: {
                                      fontSize: 12,
                                      color: '#2196F3',
                                    },
                                      productsGrid: {
                                      padding: 10,
                                    },
                                      columnWrapper: {
                                      justifyContent: 'space-between',
                                      marginBottom: 10,
                                    },
                                      productCard: {
                                      width: '48%',
                                      backgroundColor: '#FFF',
                                      borderRadius: 12,
                                      overflow: 'hidden',
                                      elevation: 2,
                                      shadowColor: '#000',
                                      shadowOffset: { width: 0, height: 1 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 2,
                                    },
                                      productImageContainer: {
                                      position: 'relative',
                                      height: 150,
                                    },
                                      productImage: {
                                      width: '100%',
                                      height: '100%',
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
                                      quickViewButton: {
                                      position: 'absolute',
                                      bottom: 5,
                                      left: 5,
                                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                      width: 30,
                                      height: 30,
                                      borderRadius: 15,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    },
                                      productInfo: {
                                      padding: 10,
                                    },
                                      productName: {
                                      fontSize: 12,
                                      fontWeight: '600',
                                      color: '#333',
                                      marginBottom: 5,
                                      height: 32,
                                    },
                                      categoryChip: {
                                      backgroundColor: '#F5F5F5',
                                      alignSelf: 'flex-start',
                                      marginBottom: 8,
                                    },
                                      categoryText: {
                                      fontSize: 10,
                                      color: '#666',
                                      paddingHorizontal: 6,
                                      paddingVertical: 2,
                                    },
                                      storeInfo: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    },
                                      storeName: {
                                      fontSize: 10,
                                      color: '#666',
                                      marginLeft: 4,
                                      marginRight: 8,
                                    },
                                      storeRating: {
                                      fontSize: 10,
                                      color: '#FFC107',
                                      fontWeight: 'bold',
                                    },
                                      ratingContainer: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    },
                                      rating: {
                                      fontSize: 12,
                                      fontWeight: 'bold',
                                      marginLeft: 4,
                                      marginRight: 4,
                                    },
                                      reviewCount: {
                                      fontSize: 10,
                                      color: '#666',
                                    },
                                      priceContainer: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    },
                                      price: {
                                      fontSize: 14,
                                      fontWeight: 'bold',
                                      color: '#2196F3',
                                      marginRight: 8,
                                    },
                                      originalPrice: {
                                      fontSize: 10,
                                      color: '#999',
                                      textDecorationLine: 'line-through',
                                    },
                                      shippingInfo: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    },
                                      shippingText: {
                                      fontSize: 10,
                                      color: '#666',
                                      marginLeft: 4,
                                    },
                                      freeShipping: {
                                      color: '#4CAF50',
                                      fontWeight: '500',
                                    },
                                      stockInfo: {
                                      marginBottom: 8,
                                    },
                                      stockText: {
                                      fontSize: 10,
                                      color: '#4CAF50',
                                      fontWeight: '500',
                                    },
                                      actionButtons: {
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    },
                                      cartButton: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: '#F5F5F5',
                                      paddingHorizontal: 8,
                                      paddingVertical: 6,
                                      borderRadius: 6,
                                      flex: 1,
                                      marginRight: 5,
                                      justifyContent: 'center',
                                    },
                                      cartButtonText: {
                                      fontSize: 10,
                                      color: '#2196F3',
                                      marginLeft: 4,
                                    },
                                      negotiateButton: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: '#FFF3E0',
                                      paddingHorizontal: 8,
                                      paddingVertical: 6,
                                      borderRadius: 6,
                                      flex: 1,
                                      marginLeft: 5,
                                      justifyContent: 'center',
                                    },
                                      negotiateButtonText: {
                                      fontSize: 10,
                                      color: '#FF9800',
                                      marginLeft: 4,
                                    },
                                      emptyState: {
                                      flex: 1,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      padding: 40,
                                      minHeight: 300,
                                    },
                                      emptyStateTitle: {
                                      fontSize: 20,
                                      fontWeight: 'bold',
                                      color: '#666',
                                      marginTop: 20,
                                      marginBottom: 10,
                                    },
                                      emptyStateText: {
                                      fontSize: 16,
                                      color: '#999',
                                      textAlign: 'center',
                                      marginBottom: 30,
                                    },
                                      resetButton: {
                                      paddingHorizontal: 30,
                                    },
                                      filterPanel: {
                                      position: 'absolute',
                                      bottom: 0,
                                      left: 0,
                                      right: 0,
                                      backgroundColor: '#FFF',
                                      borderTopLeftRadius: 20,
                                      borderTopRightRadius: 20,
                                      maxHeight: '80%',
                                      elevation: 10,
                                      shadowColor: '#000',
                                      shadowOffset: { width: 0, height: -2 },
                                      shadowOpacity: 0.1,
                                      shadowRadius: 4,
                                    },
                                      filterPanelHeader: {
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      padding: 20,
                                      borderBottomWidth: 1,
                                      borderBottomColor: '#F0F0F0',
                                    },
                                      filterPanelTitle: {
                                      fontSize: 20,
                                      fontWeight: 'bold',
                                      color: '#333',
                                    },
                                      filterPanelContent: {
                                      padding: 20,
                                      maxHeight: 400,
                                    },
                                      filterPanelFooter: {
                                      flexDirection: 'row',
                                      padding: 20,
                                      borderTopWidth: 1,
                                      borderTopColor: '#F0F0F0',
                                    },
                                      filterSection: {
                                      marginBottom: 20,
                                    },
                                      filterSectionTitle: {
                                      fontSize: 16,
                                      fontWeight: '600',
                                      color: '#333',
                                      marginBottom: 10,
                                    },
                                      categoryChip: {
                                      marginRight: 8,
                                      marginBottom: 5,
                                    },
                                      chipText: {
                                      fontSize: 12,
                                    },
                                      slider: {
                                      width: '100%',
                                      height: 40,
                                    },
                                      priceRangeLabels: {
                                      flexDirection: 'row',
                                      justifyContent: 'space-between',
                                    },
                                      priceLabel: {
                                      fontSize: 12,
                                      color: '#666',
                                    },
                                      ratingFilter: {
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                    },
                                      ratingOption: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      backgroundColor: '#F5F5F5',
                                      paddingHorizontal: 12,
                                      paddingVertical: 8,
                                      borderRadius: 20,
                                      marginRight: 10,
                                      marginBottom: 10,
                                    },
                                      selectedRating: {
                                      backgroundColor: '#E3F2FD',
                                      borderColor: '#2196F3',
                                      borderWidth: 1,
                                    },
                                      ratingOptionText: {
                                      fontSize: 12,
                                      color: '#333',
                                      marginLeft: 5,
                                    },
                                      filterOptions: {
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                    },
                                      optionChip: {
                                      marginRight: 8,
                                      marginBottom: 8,
                                    },
                                      specialOption: {
                                      flexDirection: 'row',
                                      alignItems: 'flex-start',
                                      backgroundColor: '#F8F9FA',
                                      padding: 12,
                                      borderRadius: 10,
                                      marginBottom: 10,
                                    },
                                      optionCheckbox: {
                                      width: 20,
                                      height: 20,
                                      borderRadius: 4,
                                      borderWidth: 2,
                                      borderColor: '#E0E0E0',
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                      marginRight: 12,
                                      marginTop: 2,
                                    },
                                      optionContent: {
                                      flex: 1,
                                    },
                                      optionHeader: {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginBottom: 5,
                                    },
                                      optionTitle: {
                                      fontSize: 14,
                                      fontWeight: '600',
                                      color: '#333',
                                      marginLeft: 8,
                                    },
                                      optionDescription: {
                                      fontSize: 12,
                                      color: '#666',
                                      lineHeight: 16,
                                    },
                                      clearButton: {
                                      flex: 1,
                                      marginRight: 10,
                                    },
                                      applyButton: {
                                      flex: 1,
                                    },
                                    });

                                      export default ProductDiscovery;