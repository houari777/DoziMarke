// ⚡ high-performance/gamification_engine.odin
package gamification_engine

import "core:fmt"
import "core:math"
import "core:time"
import "core:encoding/json"
import "core:container/queue"

// هياكل بيانات النظام التلعبيبي
UserGamificationState :: struct {
    user_id: string,
    xp: int,
    level: int,
    coins: int,
    gems: int,
    streaks: StreakData,
    achievements: map[string]Achievement,
    badges: map[string]Badge,
    daily_challenges: [dynamic]DailyChallenge,
    statistics: UserStatistics,
    last_updated: time.Time,
}

StreakData :: struct {
    login: int,
    sales: int,
    activity: int,
    best_login: int,
    best_sales: int,
}

Achievement :: struct {
    id: string,
    name: string,
    xp_reward: int,
    unlocked_at: time.Time,
    category: string,
}

Badge :: struct {
    id: string,
    name: string,
    icon: string,
    earned_at: time.Time,
    tier: string,
}

DailyChallenge :: struct {
    id: string,
    name: string,
    goal: int,
    progress: int,
    completed: bool,
    rewards: ChallengeRewards,
    expires_at: time.Time,
}

ChallengeRewards :: struct {
    xp: int,
    coins: int,
    gems: int,
}

UserStatistics :: struct {
    total_sales: int,
    total_revenue: f64,
    average_rating: f64,
    response_time: f64, // in seconds
    completion_rate: f64,
}

// ذاكرة التخزين المؤقت للمستخدمين
user_cache: map[string]UserGamificationState
leaderboard_cache: [dynamic]LeaderboardEntry
cache_mutex: sync.Mutex

LeaderboardEntry :: struct {
    user_id: string,
    name: string,
    xp: int,
    level: int,
    sales: int,
    revenue: f64,
    rank: int,
    change: int, // +1 up, -1 down, 0 same
}

// معالجة حدث XP
process_xp_event :: proc(event: json.Value) -> (result: json.Value) {
    start_time := time.now()

    user_id := event["user_id"].(string)
    action := event["action"].(string)
    data := event["data"]

    // احصل على حالة المستخدم من الذاكرة المؤقتة
    cache_mutex.lock()
    user_state, exists := user_cache[user_id]

    if !exists {
    // جلب من قاعدة البيانات إذا لم يكن في الذاكرة المؤقتة
        user_state = load_user_from_db(user_id)
        user_cache[user_id] = user_state
    }

    // حساب XP المكتسب
    xp_earned := calculate_xp_for_action(action, data, user_state)

    // تحديث حالة المستخدم
    update_result := update_user_state(&user_state, action, xp_earned, data)

    // حفظ في الذاكرة المؤقتة
    user_cache[user_id] = user_state

    // تحديث لوحة المتصدرين
    update_leaderboard(user_id, user_state)

    cache_mutex.unlock()

    // تسجيل في قاعدة البيانات (غير متزامن)
    go save_to_database(user_state)

    // إرسال تحديث في الوقت الحقيقي
    go send_realtime_update(user_id, update_result)

    result = json.object(
    "success", json.boolean(true),
    "xp_earned", json.integer(xp_earned),
    "new_total_xp", json.integer(user_state.xp),
    "level", json.integer(user_state.level),
    "level_up", json.boolean(update_result.level_up),
    "processing_time", json.float(time.since(start_time).seconds())
    )

    return
}

// حساب XP للحدث
calculate_xp_for_action :: proc(action: string, data: json.Value, state: UserGamificationState) -> int {
    base_xp: int = 0

    switch action {
    case "sale_completed":
        amount := data["amount"].(f64)
        base_xp = 10

        // مضاعف المبلغ
        if amount > 1000 {
            base_xp += 40
        }

        if amount > 5000 {
            base_xp += 100
        }

        // مضاعف العملاء المتكررين
        if data["repeat_customer"].(bool) {
            base_xp += 25
        }

    case "product_added":
        base_xp = 5

    case "review_received":
        rating := data["rating"].(f64)
        base_xp = int(rating * 4) // 20 XP لـ 5 نجوم

    case "quick_response":
        response_time := data["response_time"].(f64) // بالثواني
        if response_time < 300 { // أقل من 5 دقائق
            base_xp = 10
        }

    case "daily_login":
        base_xp = state.streaks.login * 5 // 5 XP لكل يوم متتالي
    }

    // تطبيق مضاعف السلسلة
    streak_multiplier := 1.0 + (f64(state.streaks.login) * 0.01)
    base_xp = int(f64(base_xp) * streak_multiplier)

    return base_xp
}

// تحديث حالة المستخدم
update_user_state :: proc(
state: ^UserGamificationState,
action: string,
xp_earned: int,
data: json.Value
) -> UpdateResult {

    result: UpdateResult

    // تحديث XP
    old_xp := state.xp
    state.xp += xp_earned

    // التحقق من ترقية المستوى
    old_level := state.level
    new_level := calculate_level(state.xp)

    if new_level > old_level {
        state.level = new_level
        result.level_up = true
        result.old_level = old_level
        result.new_level = new_level

        // منح مكافآت المستوى
        grant_level_rewards(state, new_level)
    }

    // تحديث الإحصائيات
    update_statistics(state, action, data)

    // تحديث السلاسل
    update_streaks(state, action)

    // التحقق من الإنجازات
    new_achievements := check_achievements(state, action, data)
    for achievement in new_achievements {
        state.achievements[achievement.id] = achievement
        state.xp += achievement.xp_reward
        result.unlocked_achievements = append(result.unlocked_achievements, achievement)
    }

    // تحديث التحديات اليومية
    update_daily_challenges(state, action, data)

    state.last_updated = time.now()

    return result
}

// حساب المستوى بناءً على XP
calculate_level :: proc(xp: int) -> int {
// معادلة التدرج: كل مستوى يحتاج 1000 XP مضروبة في رقم المستوى
    level := 1
    total_xp_needed := 0

    for {
        xp_needed := level * 1000
        total_xp_needed += xp_needed

        if xp < total_xp_needed {
            return level
        }

        level += 1

        if level > 100 { // حد أقصى للمستوى
            return 100
        }
    }
}

// تحديث لوحة المتصدرين
update_leaderboard :: proc(user_id: string, state: UserGamificationState) {
    entry: LeaderboardEntry

    entry.user_id = user_id
    entry.name = get_user_name(user_id)
    entry.xp = state.xp
    entry.level = state.level
    entry.sales = state.statistics.total_sales
    entry.revenue = state.statistics.total_revenue

    // إيجاد أو إضافة الإدخال
    found := false
    for &item, i in leaderboard_cache {
        if item.user_id == user_id {
            old_rank := item.rank
            item = entry

            // إعادة الترتيب
            sort_leaderboard()

            // حساب التغيير في الترتيب
            new_rank := find_rank(user_id)
            entry.change = old_rank - new_rank
            item.change = entry.change

            found = true
            break
        }
    }

    if !found {
        leaderboard_cache = append(leaderboard_cache, entry)
        sort_leaderboard()
        entry.rank = find_rank(user_id)
        entry.change = 0
    }
}

// فرز لوحة المتصدرين
sort_leaderboard :: proc() {
    n := len(leaderboard_cache)

    for i in 0..<n-1 {
        for j in 0..<n-i-1 {
            if leaderboard_cache[j].xp < leaderboard_cache[j+1].xp {
                leaderboard_cache[j], leaderboard_cache[j+1] =
                leaderboard_cache[j+1], leaderboard_cache[j]
            }
        }
    }

    // تحديث الرتب
    for &entry, i in leaderboard_cache {
        entry.rank = i + 1
    }
}

// إرسال تحديث في الوقت الحقيقي
send_realtime_update :: proc(user_id: string, result: UpdateResult) {
    message := json.object(
    "type", json.string("gamification_update"),
    "user_id", json.string(user_id),
    "xp_earned", json.integer(result.xp_earned),
    "level_up", json.boolean(result.level_up),
    "new_level", json.integer(result.new_level),
    "timestamp", json.float(f64(time.now().unix))
    )

    // إرسال عبر WebSocket
    broadcast_to_user(user_id, json.marshal(message, json.Marshal_Options{indent = false}))
}

// البث للمستخدم
broadcast_to_user :: proc(user_id: string, message: string) {
// هذا سيتصل بخادم WebSocket الرئيسي
// التنفيذ الفعلي يعتمد على بنية WebSocket الخاصة بك
}

// هيكل نتيجة التحديث
UpdateResult :: struct {
    xp_earned: int,
    level_up: bool,
    old_level: int,
    new_level: int,
    unlocked_achievements: [dynamic]Achievement,
}

// دالات مساعدة
get_user_name :: proc(user_id: string) -> string {
// جلب اسم المستخدم من قاعدة البيانات
    return "تاجر"
}

load_user_from_db :: proc(user_id: string) -> UserGamificationState {
// تحميل من قاعدة البيانات
    return UserGamificationState{
        user_id = user_id,
        xp = 0,
        level = 1,
        coins = 0,
        gems = 0,
    }
}

save_to_database :: proc(state: UserGamificationState) {
// حفظ غير متزامن في قاعدة البيانات
}

grant_level_rewards :: proc(state: ^UserGamificationState, level: int) {
    switch level {
    case 5:
        state.coins += 500
    case 10:
        state.coins += 1500
        state.gems += 5
    case 20:
        state.coins += 5000
        state.gems += 20
    case 50:
        state.gems += 100
    }
}

update_statistics :: proc(state: ^UserGamificationState, action: string, data: json.Value) {
    switch action {
    case "sale_completed":
        state.statistics.total_sales += 1
        state.statistics.total_revenue += data["amount"].(f64)
    case "review_received":
        rating := data["rating"].(f64)
        total_ratings := state.statistics.total_sales
        old_avg := state.statistics.average_rating
        state.statistics.average_rating = (old_avg * f64(total_ratings - 1) + rating) / f64(total_ratings)
    }
}

update_streaks :: proc(state: ^UserGamificationState, action: string) {
    today := time.now()

    switch action {
    case "daily_login":
        state.streaks.login += 1
        if state.streaks.login > state.streaks.best_login {
            state.streaks.best_login = state.streaks.login
        }
    case "sale_completed":
        state.streaks.sales += 1
        if state.streaks.sales > state.streaks.best_sales {
            state.streaks.best_sales = state.streaks.sales
        }
    }
}

check_achievements :: proc(state: ^UserGamificationState, action: string, data: json.Value) -> [dynamic]Achievement {
    achievements: [dynamic]Achievement

    // إنجاز أول عملية بيع
    if action == "sale_completed" && state.statistics.total_sales == 1 {
        append(&achievements, Achievement{
            id = "first_sale",
            name = "أول عملية بيع 🎯",
            xp_reward = 100,
            unlocked_at = time.now(),
            category = "sales",
        })
    }

    // إنجاز 100 عملية بيع
    if action == "sale_completed" && state.statistics.total_sales == 100 {
        append(&achievements, Achievement{
            id = "sales_100",
            name = "100 عملية بيع 🏆",
            xp_reward = 500,
            unlocked_at = time.now(),
            category = "sales",
        })
    }

    // إنجاز تقييم 5 نجوم
    if action == "review_received" && data["rating"].(f64) == 5 {
        append(&achievements, Achievement{
            id = "five_star_rating",
            name = "تقييم 5 نجوم ⭐",
            xp_reward = 50,
            unlocked_at = time.now(),
            category = "quality",
        })
    }

    return achievements
}

update_daily_challenges :: proc(state: ^UserGamificationState, action: string, data: json.Value) {
    for &challenge in state.daily_challenges {
        if !challenge.completed {
            switch action {
            case "sale_completed":
                if challenge.name == "إكمال 5 مبيعات" {
                    challenge.progress += 1
                    if challenge.progress >= challenge.goal {
                        challenge.completed = true
                        state.coins += challenge.rewards.coins
                        state.xp += challenge.rewards.xp
                    }
                }
            }
        }
    }
}

find_rank :: proc(user_id: string) -> int {
    for entry in leaderboard_cache {
        if entry.user_id == user_id {
            return entry.rank
        }
    }
    return 0
}