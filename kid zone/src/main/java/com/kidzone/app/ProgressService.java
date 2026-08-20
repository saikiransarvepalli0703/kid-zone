package com.kidzone.app;

import java.util.HashMap;
import java.util.Map;

/**
 * ProgressService handles game stats, score calculations,
 * coin/star rewards, and level progression logic.
 */
public class ProgressService {

    private int totalCoins = 50;
    private int totalStars = 12;
    private int currentLevel = 1;

    public Map<String, Object> getProgress() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("coins", totalCoins);
        stats.put("stars", totalStars);
        stats.put("currentLevel", currentLevel);
        stats.put("status", "SUCCESS");
        return stats;
    }

    public synchronized Map<String, Object> addReward(int coins, int stars) {
        this.totalCoins += coins;
        this.totalStars += stars;
        if (this.totalStars >= 20 && this.currentLevel < 2) {
            this.currentLevel = 2;
        }
        if (this.totalStars >= 50 && this.currentLevel < 3) {
            this.currentLevel = 3;
        }
        if (this.totalStars >= 100 && this.currentLevel < 4) {
            this.currentLevel = 4;
        }
        return getProgress();
    }

    public synchronized boolean spendCoins(int amount) {
        if (this.totalCoins >= amount) {
            this.totalCoins -= amount;
            return true;
        }
        return false;
    }
}
