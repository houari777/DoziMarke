
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
} from 'react-native';
import { Card, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Loading from '../../components/shared/Loading';

const NegotiationHub = ({ navigation }) => {
  const [negotiations, setNegotiations] = useState([]);
  const [activeNegotiation, setActiveNegotiation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const slideAnim = useRef(new Animated.Value(300)).current;
  const messageInputHeight = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();

  useEffect(() => {
    fetchNegotiations();
    setupWebSocket();
  }, []);

  useEffect(() => {
    if (activeNegotiation) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      fetchMessages(activeNegotiation.id);
      fetchAiSuggestions(activeNegotiation.id);
    }
  }, [activeNegotiation]);

  const fetchNegotiations = async () => {
    try {
      setLoading(true);

      const mockNegotiations = [
        {
          id: 1,
          customerName: 'أحمد محمد',
          productName: 'هاتف ذكي X10',
          customerOffer: 2200,
          originalPrice: 2499,
          customerMax: 2300,
          sellerMin: 2350,
          status: 'active',
          timeRemaining: '2h 30m',
          lastActivity: 'منذ 5 دقائق',
          customerRating: 4.8,
          isNew: true,
        },
        {
          id: 2,
          customerName: 'سارة علي',
          productName: 'ساعة ذكية Pro',
          customerOffer: 850,
          originalPrice: 899,
          customerMax: 870,
          sellerMin: 880,
          status: 'countered',
          timeRemaining: '1d 5h',
          lastActivity: 'منذ ساعة',
          customerRating: 4.9,
          isNew: false,
        },
        {
          id: 3,
          customerName: 'خالد عبدالله',
          productName: 'سماعات لاسلكية',
          customerOffer: 350,
          originalPrice: 399,
          customerMax: 380,
          sellerMin: 370,
          status: 'accepted',
          timeRemaining: 'مكتمل',
          lastActivity: 'منذ يوم',
          customerRating: 4.5,
          isNew: false,
        },
        {
          id: 4,
          customerName: 'فاطمة ناصر',
          productName: 'حذاء رياضي',
          customerOffer: 250,
          originalPrice: 299,
          customerMax: 270,
          sellerMin: 280,
          status: 'rejected',
          timeRemaining: 'منتهي',
          lastActivity: 'منذ 3 أيام',
          customerRating: 4.7,
          isNew: false,
        },
      ];

      setTimeout(() => {
        setNegotiations(mockNegotiations);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      setLoading(false);
    }
  };

  const setupWebSocket = () => {
    // محاكاة اتصال WebSocket للتفاوض المباشر
    setInterval(() => {
      setNegotiations(prev =>
        prev.map(neg =>
          neg.status === 'active'
            ? { ...neg, lastActivity: 'الآن' }
            : neg
        )
      );
    }, 30000);
  };

  const fetchMessages = async (negotiationId) => {
    const mockMessages = [
      {
        id: 1,
        sender: 'customer',
        text: 'مرحباً، هل يمكنني الحصول على خصم على هذا المنتج؟',
        time: '10:30 ص',
        isAI: false,
      },
      {
        id: 2,
        sender: 'ai',
        text: 'اقتراح الذكاء الاصطناعي: يمكنك قبول 2350 ريال مع ضمان الربحية',
        time: '10:31 ص',
        isAI: true,
        suggestion: {
          price: 2350,
          confidence: 85,
          reason: 'سعر متوازن يحقق ربح 15%',
        },
      },
      {
        id: 3,
        sender: 'seller',
        text: 'شكراً لاهتمامك. أفضل سعر يمكنني تقديمه هو 2350 ريال',
        time: '10:35 ص',
        isAI: false,
      },
      {
        id: 4,
        sender: 'customer',
        text: 'ممتاز! أنا موافق على 2350 ريال',
        time: '10:40 ص',
        isAI: false,
      },
    ];

    setMessages(mockMessages);
  };

  const fetchAiSuggestions = async (negotiationId) => {
    const mockSuggestions = [
      {
        id: 1,
        price: 2350,
        confidence: 85,
        reason: 'سعر متوازن يحقق ربح 15% ويحافظ على المنافسة',
        strategy: 'متوازن',
      },
      {
        id: 2,
        price: 2400,
        confidence: 70,
        reason: 'سعر أعلى قليلاً مع إمكانية التفاوض لأسفل',
        strategy: 'عدواني',
      },
      {
        id: 3,
        price: 2300,
        confidence: 60,
        reason: 'سعر تنافسي لضمان البيع السريع',
        strategy: 'تعاوني',
      },
    ];

    setAiSuggestions(mockSuggestions);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'seller',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isAI: false,
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // محاكاة رد الذكاء الاصطنائي
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: 'ai',
        text: 'العميل يبدو مهتماً. جرب عرض 2330 ريال لزيادة فرص القبول',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: true,
      };

      setMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const applyAiSuggestion = (suggestion) => {
    setNewMessage(`أقترح سعر ${suggestion.price} ريال ${suggestion.reason}`);

    Animated.timing(messageInputHeight, {
      toValue: 60,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const acceptNegotiation = (price) => {
    setNegotiations(prev =>
      prev.map(neg =>
        neg.id === activeNegotiation.id
          ? { ...neg, status: 'accepted', customerOffer: price }
          : neg
      )
    );

    setMessages(prev => [
      ...prev,
      {
        id: prev.length + 1,
        sender: 'system',
        text: `✅ تم قبول الصفقة بسعر ${price} ريال`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAI: false,
      },
    ]);
  };

  const rejectNegotiation = () => {
    setNegotiations(prev =>
      prev.map(neg =>
        neg.id === activeNegotiation.id
          ? { ...neg, status: 'rejected' }
          : neg
      )
    );

    setActiveNegotiation(null);
  };

  const NegotiationCard = ({ negotiation }) => (
    <TouchableOpacity
      style={styles.negotiationCard}
      onPress={() => setActiveNegotiation(negotiation)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.customerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {negotiation.customerName.charAt(0)}
            </Text>
          </View>
          <View>
            <Text style={styles.customerName}>{negotiation.customerName}</Text>
            <Text style={styles.productName}>{negotiation.productName}</Text>
          </View>
        </View>

        {negotiation.isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>جديد</Text>
          </View>
        )}
      </View>

      <View style={styles.offerSection}>
        <View style={styles.offerColumn}>
          <Text style={styles.offerLabel">السعر الأصلي</Text>
            <Text style={styles.originalPrice">{negotiation.originalPrice} ر.س</Text>
            </View>

            <Icon name="arrow-forward" size={20} color="#666" />

          <View style={styles.offerColumn}>
            <Text style={styles.offerLabel">عرض العميل</Text>
              <Text style={styles.customerOffer">{negotiation.customerOffer} ر.س</Text>
              </View>
              </View>

              <View style={styles.progressBar}>
              <View style={[styles.progressFill, {
                width: `${((negotiation.customerOffer - negotiation.sellerMin) / (negotiation.originalPrice - negotiation.sellerMin)) * 100}%`
              }]} />
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, styles[negotiation.status]]} />
              <Text style={styles.statusText}>
                {negotiation.status === 'active' ? 'نشط' :
                  negotiation.status === 'countered' ? 'تم الرد' :
                    negotiation.status === 'accepted' ? 'مقبول' : 'مرفوض'}
              </Text>
            </View>

            <Text style={styles.timeText}>{negotiation.timeRemaining}</Text>
          </View>
    </TouchableOpacity>
  );

  const MessageBubble = ({ message }) => (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      style={[
        styles.messageBubble,
        message.sender === 'seller' ? styles.sellerMessage :
          message.sender === 'ai' ? styles.aiMessage : styles.customerMessage,
      ]}
    >
      {message.sender === 'ai' && (
        <View style={styles.aiHeader}>
          <Icon name="auto-awesome" size={16} color="#4CAF50" />
          <Text style={styles.aiLabel">اقتراح الذكاء الاصطناعي</Text>
            </View>
            )}

          <Text style={[
            styles.messageText,
            message.sender === 'ai' && styles.aiMessageText
          ]}>
            {message.text}
          </Text>

          <Text style={styles.messageTime}>{message.time}</Text>

            {message.suggestion && (
              <TouchableOpacity
                style={styles.suggestionButton}
                onPress={() => applyAiSuggestion(message.suggestion)}
              >
                <Text style={styles.suggestionButtonText}>تطبيق هذا الاقتراح</Text>
              </TouchableOpacity>
            )}
        </Animatable.View>
      );

        if (loading) {
        return <Loading message="جاري تحميل التفاوضات..." />;
      }

        return (
        <View style={styles.container}>
      {/* قائمة التفاوضات */}
      <ScrollView style={styles.negotiationsList}>
        <View style={styles.header}>
          <Text style={styles.title">مركز التفاوض الذكي</Text>
            <Text style={styles.subtitle">{negotiations.length} تفاوض نشط</Text>
            </View>

          {negotiations.map(negotiation => (
            <NegotiationCard key={negotiation.id} negotiation={negotiation} />
          ))}
      </ScrollView>

      {/* نافذة التفاوض النشط */}
      {activeNegotiation && (
      <Animated.View
        style={[
          styles.negotiationWindow,
          { transform: [{ translateY: slideAnim }] }
        ]}
      >
        <View style={styles.windowHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setActiveNegotiation(null)}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>

          <View style={styles.windowCustomerInfo}>
            <Text style={styles.windowCustomerName}>
              {activeNegotiation.customerName}
            </Text>
            <Text style={styles.windowProductName}>
              {activeNegotiation.productName}
            </Text>
          </View>

          <View style={styles.ratingBadge}>
            <Icon name="star" size={16} color="#FFC107" />
            <Text style={styles.ratingText}>{activeNegotiation.customerRating}</Text>
          </View>
        </View>

        {/* معلومات السعر */}
        <View style={styles.priceInfo}>
          <View style={styles.priceItem}>
            <Text style={styles.priceLabel">السعر الأصلي</Text>
              <Text style={styles.priceValue">{activeNegotiation.originalPrice} ر.س</Text>
              </View>

              <View style={styles.priceItem}>
              <Text style={styles.priceLabel">أقل سعر لك</Text>
                <Text style={styles.minPrice}>{activeNegotiation.sellerMin} ر.س</Text>
                </View>

                <View style={styles.priceItem}>
                <Text style={styles.priceLabel">أعلى سعر للعميل</Text>
                  <Text style={styles.maxPrice}>{activeNegotiation.customerMax} ر.س</Text>
                  </View>
                  </View>

                {/* اقتراحات الذكاء الاصطناعي */}
                  <View style={styles.aiSuggestions}>
                  <Text style={styles.suggestionsTitle">اقتراحات الذكاء الاصطناعي 💡</Text>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {aiSuggestions.map(suggestion => (
                    <TouchableOpacity
                    key={suggestion.id}
                        style={styles.suggestionCard}
                        onPress={() => applyAiSuggestion(suggestion)}
                  >
                    <View style={styles.suggestionHeader}>
                      <Text style={styles.suggestionPrice}>
                        {suggestion.price} ر.س
                      </Text>
                      <Text style={styles.suggestionConfidence}>
                        {suggestion.confidence}% ثقة
                      </Text>
                    </View>

                    <Text style={styles.suggestionReason} numberOfLines={2}>
                      {suggestion.reason}
                    </Text>

                    <View style={styles.suggestionStrategy}>
                      <Text style={styles.strategyText}>استراتيجية: {suggestion.strategy}</Text>
                    </View>
                  </TouchableOpacity>
                  ))}
                </ScrollView>
          </View>

          {/* سجل المحادثة */}
          <View style={styles.chatContainer}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.messagesList}
              onContentSizeChange={() =>
                scrollViewRef.current?.scrollToEnd({ animated: true })
              }
            >
              {messages.map(message => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </ScrollView>
          </View>

          {/* منطقة إدخال الرسائل */}
          <Animated.View style={[styles.inputContainer, { height: messageInputHeight }]}>
            <TextInput
              style={styles.messageInput}
              placeholder="اكتب رسالتك..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />

            <View style={styles.inputActions}>
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Icon name="send" size={24} color="#2196F3" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.aiButton}
                onPress={() => {
                  const autoMessage = "هل يمكنك تقديم سعر أفضل؟";
                  setNewMessage(autoMessage);
                }}
              >
                <Icon name="auto-awesome" size={20} color="#4CAF50" />
                <Text style={styles.aiButtonText">رد آلي</Text>
                  </TouchableOpacity>
                  </View>
                  </Animated.View>

                {/* أزرار الإجراءات السريعة */}
                <View style={styles.quickActions}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptNegotiation(aiSuggestions[0]?.price || activeNegotiation.customerOffer)}
                  >
                    <Icon name="check" size={20} color="#FFF" />
                    <Text style={styles.acceptButtonText}>قبول الصفقة</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={rejectNegotiation}
                  >
                    <Icon name="close" size={20} color="#FFF" />
                    <Text style={styles.rejectButtonText">رفض</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                      style={styles.autoButton}
                          onPress={() => {
                            // تشغيل التفاوض الآلي بالكامل
                            acceptNegotiation(aiSuggestions[0]?.price);
                          }}
                    >
                      <Icon name="smart-toy" size={20} color="#2196F3" />
                      <Text style={styles.autoButtonText">تفاوض آلي</Text>
                        </TouchableOpacity>
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
                  header: {
                  padding: 20,
                  backgroundColor: '#FFF',
                },
                  title: {
                  fontSize: 28,
                  fontWeight: 'bold',
                  color: '#333',
                },
                  subtitle: {
                  fontSize: 16,
                  color: '#666',
                  marginTop: 5,
                },
                  negotiationsList: {
                  flex: 1,
                },
                  negotiationCard: {
                  backgroundColor: '#FFF',
                  marginHorizontal: 15,
                  marginVertical: 8,
                  padding: 15,
                  borderRadius: 12,
                  elevation: 2,
                },
                  cardHeader: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 15,
                },
                  customerInfo: {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                  avatar: {
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#2196F3',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                },
                  avatarText: {
                  color: '#FFF',
                  fontSize: 16,
                  fontWeight: 'bold',
                },
                  customerName: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                },
                  productName: {
                  fontSize: 14,
                  color: '#666',
                  marginTop: 2,
                },
                  newBadge: {
                  backgroundColor: '#FF5722',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 10,
                },
                  newBadgeText: {
                  color: '#FFF',
                  fontSize: 10,
                  fontWeight: 'bold',
                },
                  offerSection: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 15,
                },
                  offerColumn: {
                  alignItems: 'center',
                },
                  offerLabel: {
                  fontSize: 12,
                  color: '#666',
                  marginBottom: 5,
                },
                  originalPrice: {
                  fontSize: 16,
                  color: '#999',
                  textDecorationLine: 'line-through',
                },
                  customerOffer: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#2196F3',
                },
                  progressBar: {
                  height: 6,
                  backgroundColor: '#E0E0E0',
                  borderRadius: 3,
                  marginBottom: 15,
                  overflow: 'hidden',
                },
                  progressFill: {
                  height: '100%',
                  backgroundColor: '#4CAF50',
                  borderRadius: 3,
                },
                  cardFooter: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
                  statusBadge: {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                  statusDot: {
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginRight: 6,
                },
                  active: {
                  backgroundColor: '#4CAF50',
                },
                  countered: {
                  backgroundColor: '#2196F3',
                },
                  accepted: {
                  backgroundColor: '#8BC34A',
                },
                  rejected: {
                  backgroundColor: '#F44336',
                },
                  statusText: {
                  fontSize: 12,
                  color: '#666',
                },
                  timeText: {
                  fontSize: 12,
                  color: '#FF9800',
                  fontWeight: '500',
                },
                  negotiationWindow: {
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: '#FFF',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  elevation: 10,
                  maxHeight: Dimensions.get('window').height * 0.8,
                },
                  windowHeader: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderBottomWidth: 1,
                  borderBottomColor: '#F0F0F0',
                },
                  backButton: {
                  marginRight: 15,
                },
                  windowCustomerInfo: {
                  flex: 1,
                },
                  windowCustomerName: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333',
                },
                  windowProductName: {
                  fontSize: 14,
                  color: '#666',
                  marginTop: 2,
                },
                  ratingBadge: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFF9C4',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 12,
                },
                  ratingText: {
                  fontSize: 14,
                  fontWeight: 'bold',
                  color: '#333',
                  marginLeft: 5,
                },
                  priceInfo: {
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 15,
                  backgroundColor: '#F8F9FA',
                  margin: 15,
                  borderRadius: 10,
                },
                  priceItem: {
                  alignItems: 'center',
                },
                  priceLabel: {
                  fontSize: 12,
                  color: '#666',
                  marginBottom: 5,
                },
                  priceValue: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                },
                  minPrice: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#F44336',
                },
                  maxPrice: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#4CAF50',
                },
                  aiSuggestions: {
                  paddingHorizontal: 15,
                  marginBottom: 15,
                },
                  suggestionsTitle: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 10,
                },
                  suggestionCard: {
                  backgroundColor: '#F0F9FF',
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 10,
                  width: 180,
                  borderWidth: 1,
                  borderColor: '#B3E5FC',
                },
                  suggestionHeader: {
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8,
                },
                  suggestionPrice: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#2196F3',
                },
                  suggestionConfidence: {
                  fontSize: 12,
                  color: '#4CAF50',
                  backgroundColor: '#E8F5E8',
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 8,
                },
                  suggestionReason: {
                  fontSize: 12,
                  color: '#333',
                  marginBottom: 8,
                },
                  suggestionStrategy: {
                  backgroundColor: '#E3F2FD',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  alignSelf: 'flex-start',
                },
                  strategyText: {
                  fontSize: 10,
                  color: '#2196F3',
                },
                  chatContainer: {
                  flex: 1,
                  maxHeight: 200,
                  paddingHorizontal: 15,
                },
                  messagesList: {
                  flex: 1,
                },
                  messageBubble: {
                  padding: 12,
                  borderRadius: 15,
                  marginBottom: 10,
                  maxWidth: '80%',
                },
                  sellerMessage: {
                  backgroundColor: '#E3F2FD',
                  alignSelf: 'flex-end',
                  borderBottomRightRadius: 5,
                },
                  customerMessage: {
                  backgroundColor: '#F5F5F5',
                  alignSelf: 'flex-start',
                  borderBottomLeftRadius: 5,
                },
                  aiMessage: {
                  backgroundColor: '#F0F9FF',
                  alignSelf: 'center',
                  borderWidth: 1,
                  borderColor: '#B3E5FC',
                },
                  aiHeader: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 5,
                },
                  aiLabel: {
                  fontSize: 10,
                  color: '#4CAF50',
                  marginLeft: 5,
                  fontWeight: '500',
                },
                  messageText: {
                  fontSize: 14,
                  color: '#333',
                },
                  aiMessageText: {
                  fontSize: 13,
                  color: '#333',
                },
                  messageTime: {
                  fontSize: 10,
                  color: '#666',
                  marginTop: 5,
                  textAlign: 'right',
                },
                  suggestionButton: {
                  backgroundColor: '#4CAF50',
                  padding: 8,
                  borderRadius: 8,
                  marginTop: 8,
                },
                  suggestionButtonText: {
                  color: '#FFF',
                  fontSize: 12,
                  fontWeight: 'bold',
                  textAlign: 'center',
                },
                  inputContainer: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#F0F0F0',
                },
                  messageInput: {
                  flex: 1,
                  backgroundColor: '#F5F5F5',
                  borderRadius: 20,
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  fontSize: 14,
                  maxHeight: 80,
                },
                  inputActions: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 10,
                },
                  sendButton: {
                  marginLeft: 10,
                },
                  aiButton: {
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#E8F5E8',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 15,
                },
                  aiButtonText: {
                  fontSize: 12,
                  color: '#4CAF50',
                  marginLeft: 5,
                  fontWeight: '500',
                },
                  quickActions: {
                  flexDirection: 'row',
                  padding: 15,
                  borderTopWidth: 1,
                  borderTopColor: '#F0F0F0',
                },
                  acceptButton: {
                  flex: 1,
                  backgroundColor: '#4CAF50',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 10,
                  marginRight: 10,
                },
                  acceptButtonText: {
                  color: '#FFF',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginLeft: 8,
                },
                  rejectButton: {
                  backgroundColor: '#F44336',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 10,
                  width: 60,
                },
                  rejectButtonText: {
                  color: '#FFF',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginLeft: 8,
                },
                  autoButton: {
                  backgroundColor: '#E3F2FD',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 12,
                  borderRadius: 10,
                  marginLeft: 10,
                  flex: 1,
                },
                  autoButtonText: {
                  color: '#2196F3',
                  fontSize: 14,
                  fontWeight: 'bold',
                  marginLeft: 8,
                },
                });

                  export default NegotiationHub;