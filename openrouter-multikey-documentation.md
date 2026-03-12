# OpenRouter Multi-Key Agent - Dokumentasi Lengkap

## 📋 Overview

**Agent:** OpenRouter Multi-Key Load Balancer dengan Failover Otomatis  
**Tujuan:** Memaksimalkan 50 request/hari per API key OpenRouter tanpa downtime  
**Status:** Production-ready, aktif sejak 2026-02-28  

## 🚀 Cara Kerja

### 1. Monitoring Real-time
- **Interval:** 5 menit (configurable)
- **API:** `GET https://openrouter.ai/api/v1/auth/key`
- **Data:** Usage per key (requests_used/requests_limit)

### 2. Auto-Switch Logic
```
checkAndSwitch():
1. Baca current key dari openrouter-api-key.txt
2. Fetch usage dari OpenRouter API
3. Update usage di openrouter-keys.json
4. Jika usage >= 45/50:
   - Pilih next available key (round-robin)
   - Switch ke key baru
   - Restart gateway otomatis
5. Jika semua key habis:
   - Switch ke fallback model (openrouter/auto)
```

### 3. Failover Protection
- ✅ Zero-downtime switching
- ✅ Auto-restart gateway
- ✅ Fallback ke model default
- ✅ Real usage tracking