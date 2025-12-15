// 📱 frontend/src/screens/business/ProductManager.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Card, Title, Paragraph, Button, Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import Loading from '../../components/shared/Loading';

const ProductManager = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: null,
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(
        product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // محاكاة بيانات API
      const mockProducts = [
        {
          id: 1,
          name: 'هاتف ذكي X10',
          description: 'أحدث طراز بشاشة 6.7 بوصة',
          price: 2499,
          stock: 15,
          category: 'إلكترونيات',
          image: 'https://via.placeholder.com/150',
          rating: 4.5,
          sales: 120,
          status: 'active',
        },
        {
          id: 2,
          name: 'ساعة ذكية Pro',
          description: 'تتبع اللياقة والنوم',
          price: 899,
          stock: 8,
          category: 'إلكترونيات',
          image: 'https://via.placeholder.com/150',
          rating: 4.7,
          sales: 85,
          status: 'active',
        },
        {
          id: 3,
          name: 'حذاء رياضي',
          description: 'مريح ومناسب للرياضة',
          price: 299,
          stock: 0,
          category: 'ملابس',
          image: 'https://via.placeholder.com/150',
          rating: 4.3,
          sales: 200,
          status: 'out_of_stock',
        },
        {
          id: 4,
          name: 'كتاب البرمجة المتقدمة',
          description: 'أفضل كتاب لتعليم البرمجة',
          price: 149,
          stock: 25,
          category: 'كتب',
          image: 'https://via.placeholder.com/150',
          rating: 4.8,
          sales: 45,
          status: 'active',
        },
        {
          id: 5,
          name: 'سماعات لاسلكية',
          description: 'جودة صوت عالية',
          price: 399,
          stock: 12,
          category: 'إلكترونيات',
          image: 'https://via.placeholder.com/150',
          rating: 4.6,
          sales: 78,
          status: 'active',
        },
      ];

      setTimeout(() => {
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      Alert.alert('خطأ', 'فشل في تحميل المنتجات');
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleImagePick = () => {
    const options = {
      title: 'اختر صورة المنتج',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setNewProduct({ ...newProduct, image: response.assets[0].uri });
      }
    });
  };

  const addProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      Alert.alert('خطأ', 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    const product = {
      id: products.length + 1,
      ...newProduct,
      rating: 0,
      sales: 0,
      status: 'active',
    };

    setProducts([product, ...products]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      image: null,
    });
    setModalVisible(false);
    Alert.alert('نجاح', 'تم إضافة المنتج بنجاح');
  };

  const updateProductStatus = (productId, status) => {
    setProducts(
      products.map(product =>
        product.id === productId ? { ...product, status } : product,
      ),
    );
  };

  const ProductCard = ({ product }) => (
    <Card style={styles.productCard}>
      <Card.Content>
        <View style={styles.productHeader}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <View style={styles.productInfo}>
            <Title style={styles.productName}>{product.name}</Title>
            <Paragraph style={styles.productCategory}>
              {product.category}
            </Paragraph>
            <View style={styles.productStats}>
              <Text style={styles.productPrice}>{product.price} ر.س</Text>
              <Text style={styles.productStock}>المخزون: {product.stock}</Text>
            </View>
          </View>
        </View>

        <Paragraph style={styles.productDescription} numberOfLines={2}>
          {product.description}
        </Paragraph>

        <View style={styles.productFooter}>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.salesText}>({product.sales} مبيع)</Text>
          </View>

          <View style={styles.productActions}>
            <TouchableOpacity
              style={[styles.statusBadge, styles[product.status]]}
              onPress={() =>
                updateProductStatus(
                  product.id,
                  product.status === 'active' ? 'inactive' : 'active',
                )
              }
            >
              <Text style={styles.statusText}>
                {product.status === 'active'
                  ? 'نشط'
                  : product.status === 'out_of_stock'
                  ? 'نفذ'
                  : 'غير نشط'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => {
                setSelectedProduct(product);
                setModalVisible(true);
              }}
            >
              <Icon name="edit" size={20} color="#2196F3" />
            </TouchableOpacity>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="inventory" size={80} color="#E0E0E0" />
      <Text style={styles.emptyStateTitle}>لا توجد منتجات</Text>
      <Text style={styles.emptyStateText}>
        ابدأ بإضافة منتجك الأول لتظهر في المتجر
      </Text>
      <Button
        mode="contained"
        onPress={() => setModalVisible(true)}
        style={styles.addFirstButton}
      >
        إضافة أول منتج
      </Button>
    </View>
  );

  if (loading) {
    return <Loading message="جاري تحميل المنتجات..." />;
  }

  return (
    <View style={styles.container}>
      {/* شريط البحث والإجراءات */}
      <View style={styles.header}>
        <Searchbar
          placeholder="ابحث عن منتج..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* إحصائيات سريعة */}
      <View style={styles.statsOverview}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{products.length}</Text>
          <Text style={styles.statLabel}>إجمالي المنتجات</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {products.filter(p => p.status === 'active').length}
          </Text>
          <Text style={styles.statLabel}>نشطة</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {products.filter(p => p.status === 'out_of_stock').length}
          </Text>
          <Text style={styles.statLabel}>نفذت</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {products.reduce((sum, p) => sum + p.sales, 0)}
          </Text>
          <Text style={styles.statLabel}>إجمالي المبيعات</Text>
        </View>
      </View>

      {/* قائمة المنتجات */}
      {products.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.productsList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>لا توجد نتائج للبحث</Text>
            </View>
          }
        />
      )}

      {/* نافذة إضافة/تعديل منتج */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* صورة المنتج */}
              <TouchableOpacity
                style={styles.imagePicker}
                onPress={handleImagePick}
              >
                {newProduct.image || selectedProduct?.image ? (
                  <Image
                    source={{ uri: newProduct.image || selectedProduct?.image }}
                    style={styles.selectedImage}
                  />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Icon name="add-a-photo" size={40} color="#666" />
                    <Text style={styles.imagePlaceholderText}>
                      اختر صورة للمنتج
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* حقول النموذج */}
              <TextInput
                style={styles.input}
                placeholder="اسم المنتج *"
                value={newProduct.name || selectedProduct?.name || ''}
                onChangeText={text =>
                  setNewProduct({ ...newProduct, name: text })
                }
              />

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="وصف المنتج"
                multiline
                numberOfLines={3}
                value={
                  newProduct.description || selectedProduct?.description || ''
                }
                onChangeText={text =>
                  setNewProduct({ ...newProduct, description: text })
                }
              />

              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="السعر *"
                  keyboardType="numeric"
                  value={
                    newProduct.price || selectedProduct?.price?.toString() || ''
                  }
                  onChangeText={text =>
                    setNewProduct({ ...newProduct, price: text })
                  }
                />

                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="الكمية *"
                  keyboardType="numeric"
                  value={
                    newProduct.stock || selectedProduct?.stock?.toString() || ''
                  }
                  onChangeText={text =>
                    setNewProduct({ ...newProduct, stock: text })
                  }
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="الفئة (مثال: إلكترونيات)"
                value={newProduct.category || selectedProduct?.category || ''}
                onChangeText={text =>
                  setNewProduct({ ...newProduct, category: text })
                }
              />

              {/* توصيات الذكاء الاصطناعي */}
              <View style={styles.aiRecommendations}>
                <View style={styles.aiHeader}>
                  <Icon name="auto-awesome" size={20} color="#4CAF50" />
                  <Text style={styles.aiTitle}>توصيات الذكاء الاصطناعي</Text>
                </View>

                <View style={styles.aiTip}>
                  <Text style={styles.aiTipText}>
                    💡 السعر المقترح: 2,399 ر.س (بناءً على أسعار المنافسين)
                  </Text>
                </View>

                <View style={styles.aiTip}>
                  <Text style={styles.aiTipText}>
                    🎯 المخزون الأمثل: 20 قطعة (بناءً على الطلب المتوقع)
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                إلغاء
              </Button>

              <Button
                mode="contained"
                onPress={addProduct}
                style={styles.saveButton}
              >
                {selectedProduct ? 'تحديث' : 'حفظ'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    marginRight: 10,
    elevation: 0,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  statsOverview: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  productsList: {
    padding: 15,
  },
  productCard: {
    marginBottom: 15,
    elevation: 3,
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
  },
  productDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    marginRight: 10,
  },
  salesText: {
    fontSize: 12,
    color: '#666',
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  active: {
    backgroundColor: '#E8F5E8',
  },
  inactive: {
    backgroundColor: '#FFEBEE',
  },
  out_of_stock: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  editButton: {
    padding: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
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
  addFirstButton: {
    paddingHorizontal: 30,
  },
  noResults: {
    padding: 40,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  aiRecommendations: {
    backgroundColor: '#F0F9FF',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginLeft: 10,
  },
  aiTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  aiTipText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  cancelButton: {
    flex: 1,
    marginRight: 10,
  },
  saveButton: {
    flex: 1,
  },
});

export default ProductManager;
