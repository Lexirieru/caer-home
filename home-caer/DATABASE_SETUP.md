# Database Setup untuk Waitlist

Sekarang sistem waitlist menggunakan database Supabase untuk menyimpan data secara permanen.

## 🗄️ Setup Supabase

### 1. Buat Akun Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Sign up dengan GitHub atau email
3. Buat project baru

### 2. Buat Table Waitlist
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Buat table waitlist
CREATE TABLE waitlist (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  position INTEGER NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Buat index untuk performa
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_position ON waitlist(position);
```

### 3. Konfigurasi Environment Variables
Tambahkan ke `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📊 Data yang Disimpan

Setiap user yang join waitlist akan disimpan dengan:
- **Email**: Alamat email user
- **Position**: Posisi di waitlist (#1, #2, dst.)
- **Joined_at**: Waktu join
- **Created_at**: Waktu record dibuat

## 🔍 Query Database

### Lihat semua user di waitlist:
```sql
SELECT * FROM waitlist ORDER BY position;
```

### Hitung total user:
```sql
SELECT COUNT(*) FROM waitlist;
```

### Cari user tertentu:
```sql
SELECT * FROM waitlist WHERE email = 'user@example.com';
```

## 🚀 Keuntungan Database

✅ **Data Permanen**: Tidak hilang saat server restart
✅ **Scalable**: Bisa handle ribuan user
✅ **Backup Otomatis**: Supabase backup data secara otomatis
✅ **Real-time**: Bisa update data real-time
✅ **Analytics**: Bisa analisis data user

## 📧 Email + Database

Sekarang sistem:
1. **Simpan email** ke database
2. **Kirim email konfirmasi** ke user
3. **Track posisi** di waitlist
4. **Prevent duplicate** email
