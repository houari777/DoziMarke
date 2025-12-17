#+feature dynamic-literals
package main

import "core:fmt"
import "core:time"
import "core:sync"
import "core:encoding/json"


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

// ذاكرة التخزين المؤقت
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
    change: int,
}

// نتيجة التحديث
UpdateResult :: struct {
    xp_earned: int,
    level_up: bool,
    old_level: int,
    new_level: int,
    unlocked_achievements: [dynamic]Achievement,
}

// دوال مساعدة
calculate_level :: proc(xp: int) -> int {
    level := 1
    total_xp_needed := 0
    for {
        xp_needed := level * 1000
        total_xp_needed += xp_needed
        if xp < total_xp_needed { return level }
        level += 1
        if level > 100 { return 100 }
    }
    return 1
}

calculate_xp_for_action :: proc(action: string, data: json.Value, state: UserGamificationState) -> int {
    base_xp: int = 0
    data_map, is_map := data.(map[string]json.Value)
    if !is_map { return 0 }

    switch action {
    case "sale_completed":
        if amount_val, ok := data_map["amount"]; ok {
            if amount, ok_f64 := amount_val.(f64); ok_f64 {
                base_xp = 10
                if amount > 1000 { base_xp += 40 }
                if amount > 5000 { base_xp += 100 }
            }
        }
    case "daily_login":
        base_xp = state.streaks.login * 5
        default:
        base_xp = 1
    }
    streak_multiplier := 1.0 + (f64(state.streaks.login) * 0.01)
    return int(f64(base_xp) * streak_multiplier)
}

// مثال تحديث المستخدم
update_user_state :: proc(state: ^UserGamificationState, action: string, xp_earned: int, data: json.Value) -> UpdateResult {
    result: UpdateResult
    result.xp_earned = xp_earned
    state.xp += xp_earned
    old_level := state.level
    new_level := calculate_level(state.xp)

    if new_level > old_level {
        state.level = new_level
        result.level_up = true
        result.old_level = old_level
        result.new_level = new_level
    }

    state.last_updated = time.now()
    return result
}

// دوال التخزين والتحديث اللحظي
save_to_database :: proc(state: UserGamificationState) {
    fmt.println("💾 حفظ حالة المستخدم:", state.user_id, "XP:", state.xp)
}

send_realtime_update :: proc(user_id: string, result: UpdateResult) {
    fmt.println("🔔 تحديث لحظي للمستخدم", user_id, "XP المكتسبة:", result.xp_earned)
}

// الدالة الأساسية
main :: proc() {
    fmt.println("🚀 بدء محرك Gamification...")

    user := UserGamificationState{
        user_id = "user_42",
        xp = 120,
        level = 1,
    }

    xp := calculate_xp_for_action("daily_login", json.Null, user)
    user_copy := user
    result := update_user_state(&user, "daily_login", xp, json.Null)

    fmt.println("✅ Gamification جاهز")
}
