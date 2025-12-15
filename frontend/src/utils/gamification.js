// 📱 frontend/src/utils/gamification.js
export const GamificationSystem = {
  // =========== نظام المستويات الأساسي ===========
  levels: {
    vendor: {
      1: { name: 'بائع مبتدئ 🌱', xpRequired: 0, color: '#4CAF50', icon: '🌱' },
      5: {
        name: 'بائع محترف ⭐',
        xpRequired: 5000,
        color: '#2196F3',
        icon: '⭐',
      },
      10: {
        name: 'بائع أسطوري 🏆',
        xpRequired: 15000,
        color: '#FF9800',
        icon: '🏆',
      },
      20: {
        name: 'بائع ماسي 💎',
        xpRequired: 50000,
        color: '#9C27B0',
        icon: '💎',
      },
      50: {
        name: 'إمبراطور التجارة 👑',
        xpRequired: 200000,
        color: '#FF5722',
        icon: '👑',
      },
    },

    customer: {
      1: {
        name: 'مستكشف جديد 🎯',
        xpRequired: 0,
        color: '#4CAF50',
        icon: '🎯',
      },
      10: {
        name: 'صياد صفقات 🎪',
        xpRequired: 5000,
        color: '#2196F3',
        icon: '🎪',
      },
      25: {
        name: 'خبير تسوق 🛒',
        xpRequired: 15000,
        color: '#FF9800',
        icon: '🛒',
      },
      50: {
        name: 'سلطان الأسواق 👑',
        xpRequired: 50000,
        color: '#9C27B0',
        icon: '👑',
      },
    },
  },

  // =========== مصادر كسب XP ===========
  xpSources: {
    vendor: {
      sales: {
        perSale: 10,
        largeSale: 50, // للمبيعات فوق 1000 ريال
        repeatCustomer: 25,
        milestone: {
          10: 100,
          50: 500,
          100: 1000,
        },
      },
      engagement: {
        quickReply: 5,
        productUpdate: 3,
        storeOptimization: 10,
        socialShare: 3,
      },
      quality: {
        fiveStarRating: 20,
        positiveReview: 15,
        onTimeShipping: 10,
        zeroComplaints: 30,
      },
      growth: {
        newProduct: 5,
        followerGain: 2,
        salesIncrease: 50, // لزيادة المبيعات 10%
        revenueMilestone: 100, // لكل 10000 ريال إيرادات
      },
    },

    customer: {
      shopping: {
        perPurchase: 10,
        largePurchase: 30,
        repeatPurchase: 20,
        milestone: {
          10: 100,
          50: 500,
        },
      },
      engagement: {
        reviewWritten: 15,
        photoReview: 25,
        questionAsked: 5,
        answerGiven: 10,
      },
      community: {
        inviteFriend: 50,
        reportHelpful: 5,
        contentShared: 10,
        eventParticipation: 30,
      },
    },
  },

  // =========== المكافآت لكل مستوى ===========
  levelRewards: {
    vendor: {
      1: ['الوصول الأساسي للمنصة', '5 منتجات مجانية'],
      5: ['خصم 10% على العمولات', 'تحليلات متقدمة', 'شارة البائع المحترف'],
      10: ['خصم 20% على العمولات', 'دعم فني متميز', 'ظهور مميز في البحث'],
      20: ['خصم 40% على العمولات', 'مدير متجر شخصي', 'ميزة التفاوض الآلي'],
      50: ['0% عمولة لمدة 3 أشهر', 'حساب شركة ماسي', 'دعم على مدار الساعة'],
    },

    customer: {
      1: ['خصم ترحيبي 10%'],
      10: ['دخول السحب الشهري', 'عروض حصرية'],
      25: ['شحن مجاني', 'رعاية خاصة'],
      50: ['مستشار تسوق شخصي', 'هدايا شهرية'],
    },
  },

  // =========== نظام الشارات ===========
  badges: {
    sales: {
      firstSale: {
        name: 'أول عملية بيع 🎯',
        icon: '🎯',
        color: '#4CAF50',
        xp: 100,
      },
      sales100: {
        name: '100 عملية بيع 🏆',
        icon: '🏆',
        color: '#FF9800',
        xp: 500,
      },
      sales1000: {
        name: '1000 عملية بيع 💎',
        icon: '💎',
        color: '#9C27B0',
        xp: 1000,
      },
    },
    quality: {
      rating50: {
        name: 'تصنيف 5 نجوم ⭐',
        icon: '⭐',
        color: '#FFC107',
        xp: 200,
      },
      positive90: { name: 'رضا 90% 😊', icon: '😊', color: '#2196F3', xp: 300 },
      zeroComplaints: {
        name: 'صفر شكاوى ✅',
        icon: '✅',
        color: '#4CAF50',
        xp: 400,
      },
    },
    engagement: {
      quickReplier: {
        name: 'رد سريع ⚡',
        icon: '⚡',
        color: '#9C27B0',
        xp: 50,
      },
      activeDaily: {
        name: 'نشط يومياً 📅',
        icon: '📅',
        color: '#2196F3',
        xp: 150,
      },
      communityHelper: {
        name: 'مساعد المجتمع 🤝',
        icon: '🤝',
        color: '#FF5722',
        xp: 200,
      },
    },
  },

  // =========== دالات المساعدة ===========
  helpers: {
    calculateLevel(xp, userType = 'vendor') {
      const levels = this.levels[userType];
      let currentLevel = 1;
      let nextLevel = 5;

      for (const [level, data] of Object.entries(levels)) {
        const levelNum = parseInt(level);
        if (xp >= data.xpRequired) {
          currentLevel = levelNum;
        }
        if (xp < data.xpRequired) {
          nextLevel = levelNum;
          break;
        }
      }

      const currentLevelData = levels[currentLevel];
      const nextLevelData = levels[nextLevel] || levels[currentLevel];

      const progress = nextLevelData
        ? ((xp - currentLevelData.xpRequired) /
            (nextLevelData.xpRequired - currentLevelData.xpRequired)) *
          100
        : 100;

      return {
        level: currentLevel,
        name: currentLevelData.name,
        nextLevel: nextLevel,
        progress: Math.min(100, Math.max(0, progress)),
        xpToNextLevel: nextLevelData ? nextLevelData.xpRequired - xp : 0,
        currentLevelData,
        nextLevelData,
      };
    },

    calculateXPEarned(action, data = {}) {
      let xp = 0;

      switch (action) {
        case 'sale_completed':
          xp = this.xpSources.vendor.sales.perSale;
          if (data.amount > 1000) xp += this.xpSources.vendor.sales.largeSale;
          if (data.repeatCustomer)
            xp += this.xpSources.vendor.sales.repeatCustomer;
          break;

        case 'product_added':
          xp = this.xpSources.vendor.growth.newProduct;
          break;

        case 'review_received':
          if (data.rating === 5)
            xp = this.xpSources.vendor.quality.fiveStarRating;
          break;

        case 'daily_login':
          xp = data.streak * 5; // 5 xp لكل يوم متتالي
          break;
      }

      return xp;
    },

    getLevelRewards(level, userType = 'vendor') {
      return this.levelRewards[userType][level] || [];
    },

    getBadgeProgress(userData, badgeId) {
      const badgeCategories = Object.values(this.badges);
      for (const category of badgeCategories) {
        if (category[badgeId]) {
          // حساب تقدم الحصول على الشارة
          return {
            badge: category[badgeId],
            progress: 0, // سيتم حسابها من البيانات الفعلية
            requirements: this.getBadgeRequirements(badgeId),
          };
        }
      }
      return null;
    },
  },
};

export default GamificationSystem;
