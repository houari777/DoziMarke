#+feature dynamic-literals
package main

import "core:fmt"
import "core:time"
import "core:json"

// =======================
// هياكل البيانات
// =======================
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
last_updated: time.Time
}

StreakData :: struct { login, sales, activity, best_login, best_sales: int }
Achievement :: struct { id, name, category: string, xp_reward: int, unlocked_at: time.Time }
Badge :: struct { id, name, icon, tier: string, earned_at: time.Time }
DailyChallenge :: struct { id, name: string, goal, progress: int, completed: bool, rewards: ChallengeRewards; expires_at: time.Time }
ChallengeRewards :: struct { xp, coins, gems: int }
UserStatistics :: struct { total_sales: int; total_revenue, average_rating, response_time, completion_rate: f64 }
LeaderboardEntry :: struct { user_id, name: string; xp, level, sales, rank, change: int; revenue: f64 }

// =======================
// AI Model
// =======================
AIModel :: struct { weights: map[string]f64; biases: map[string]f64 }
init_ai_model :: proc() -> AIModel {
return AIModel{ weights = map[string]f64{"price_sensitivity":0.3,"brand_loyalty":0.2,"category_preference":0.25},
biases = map[string]f64{"base":0.5} }
}
recommend_price :: proc(model: AIModel, base_cost: f64) -> f64 {
return base_cost * (1.0 + model.weights["price_sensitivity"]) + model.biases["base"]
}

// =======================
// متغيرات التخزين
// =======================
user_cache: map[string]UserGamificationState
leaderboard_cache: [dynamic]LeaderboardEntry

// =======================
// دوال Gamification
// =======================
calculate_xp_for_action :: proc(action: string, data: json.Value, state: UserGamificationState) -> int {
xp: int = 0
data_map, is_map := data.(map[string]json.Value)
if !is_map { return 0 }
switch action {
case "sale_completed":
if amount_val, ok := data_map["amount"]; ok {
if amount, ok_f64 := amount_val.(f64); ok_f64 {
xp = 10
if amount > 1000 { xp += 40 }
if amount > 5000 { xp += 100 }
}
}
case "product_added": xp = 5
case "review_received":
if rating_val, ok := data_map["rating"]; ok {
if rating, ok_f64 := rating_val.(f64); ok_f64 { xp = int(rating*4) }
}
case "daily_login": xp = state.streaks.login*5
}
multiplier := 1.0 + (f64(state.streaks.login)*0.01)
return int(f64(xp)*multiplier)
}

calculate_level :: proc(xp: int) -> int {
level, total := 1,0
for {
total += level*1000
if xp < total { return level }
level += 1
if level>100 { return 100 }
}
}

get_user_name :: proc(user_id: string) -> string { return "تاجر" }
grant_level_rewards :: proc(state: ^UserGamificationState, level: int) {
switch level { case 5: state.coins+=500 case 10: state.coins+=1500; state.gems+=5 case 20: state.coins+=5000; state.gems+=20 case 50: state.gems+=100 }
}

save_to_database :: proc(state: UserGamificationState) { fmt.println("💾 حفظ الحالة:", state.user_id,"XP:",state.xp) }
send_realtime_update :: proc(user_id: string, message: string) { fmt.println("🔔 تحديث لحظي للمستخدم", user_id, ":", message) }
append_achievements :: proc(state: ^UserGamificationState, new_achievements: [dynamic]Achievement) {
for a in new_achievements { state.achievements[a.id] = a; state.xp += a.xp_reward }
}

// =======================
// Leaderboard
// =======================
update_leaderboard :: proc(state: ^UserGamificationState) {
found := false
for &entry, i in leaderboard_cache {
if entry.user_id == state.user_id {
old_rank := entry.rank
entry.xp = state.xp
entry.level = state.level
entry.sales = state.statistics.total_sales
entry.revenue = state.statistics.total_revenue
sort_leaderboard()
entry.change = old_rank - find_rank(state.user_id)
found = true
break
}
}
if !found {
append(&leaderboard_cache, LeaderboardEntry{user_id=state.user_id, name=get_user_name(state.user_id),
xp=state.xp, level=state.level, sales=state.statistics.total_sales, revenue=state.statistics.total_revenue, rank=0, change=0})
sort_leaderboard()
}
}

sort_leaderboard :: proc() {
n := len(leaderboard_cache)
for i in 0..<n-1 {
for j in 0..<n-i-1 {
if leaderboard_cache[j].xp < leaderboard_cache[j+1].xp {
leaderboard_cache[j], leaderboard_cache[j+1] = leaderboard_cache[j+1], leaderboard_cache[j]
}
}
}
for &entry, i in leaderboard_cache { entry.rank = i+1 }
}

find_rank :: proc(user_id: string) -> int {
for entry, i in leaderboard_cache { if entry.user_id == user_id { return i+1 } }
return 0
}

// =======================
// main
// =======================
main :: proc() {
fmt.println("🚀 بدء Gamification + AI + Leaderboard Engine...")

ai_model := init_ai_model()
user_id := "user_42"
state := UserGamificationState{user_id=user_id, xp=1200, level=3, coins=500, streaks=StreakData{login=10}}

// حدث بيع
data := json.Object{"amount" = json.Float(1200.0)}
xp := calculate_xp_for_action("sale_completed", data, state)
state.xp += xp
state.level = calculate_level(state.xp)

// إضافة إنجازات
new_achievements: [dynamic]Achievement
if state.statistics.total_sales == 0 { // أول بيع
new_achievements = [Achievement{"first_sale","أول عملية بيع 🎯","sales",100,time.now()}]
append_achievements(&state, new_achievements)
}

// AI توصية سعر
recommended_price := recommend_price(ai_model, 1200.0)
fmt.println("💡 AI توصي بسعر:", recommended_price)

// تحديث Leaderboard
update_leaderboard(&state)

// حفظ وإرسال التحديثات
save_to_database(state)
send_realtime_update(user_id, fmt.sprintf("XP اكتسب: %d, السعر الموصى به: %.2f", xp, recommended_price))

fmt.println("✅ جاهز")
fmt.println("🏆 Leaderboard:")
for entry in leaderboard_cache {
fmt.println(entry.rank,"-",entry.name,"XP:",entry.xp)
}
}
