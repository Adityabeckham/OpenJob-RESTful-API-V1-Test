# OpenJob RESTful API V1

OpenJob API adalah project submission kelas Belajar Fundamental Back-end dengan Javascript, Project backend untuk sistem rekrutmen pekerjaan yang dibangun menggunakan Node.js, Express, dan PostgreSQL. API ini menyediakan berbagai fitur mulai dari manajemen pengguna, lowongan pekerjaan, hingga proses lamaran kerja.

## 🚀 Fitur Utama

- **Autentikasi & Otorisasi**: Login, refresh token, dan proteksi route menggunakan JWT.
- **Manajemen Pengguna**: Registrasi dan pembaruan profil pengguna.
- **Perusahaan**: Pengelolaan data perusahaan.
- **Lowongan Pekerjaan (Jobs)**: Posting, update, pencarian, dan filter lowongan kerja berdasarkan kategori atau perusahaan.
- **Lamaran Kerja (Applications)**: Proses melamar pekerjaan dan pelacakan status lamaran.
- **Bookmark**: Menyimpan lowongan pekerjaan favorit.
- **Dokumen**: Unggah dan kelola dokumen pendukung seperti CV/Resume.
- **Validasi Data**: Menggunakan Joi untuk memastikan integritas data input.
- **Error Handling**: Penanganan error yang tersentralisasi untuk respon API yang konsisten.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Migration**: node-pg-migrate
- **Validation**: Joi
- **Security**: bcrypt (hashing), jsonwebtoken (JWT)
- **File Upload**: Multer
- **ID Generation**: Nanoid

## 📂 Struktur Proyek

```text
.
├── migrations/           # File migrasi database
├── src/
│   ├── config/           # Konfigurasi database
│   ├── middleware/       # Auth, error handler, validation middleware
│   ├── routes/           # Definisi API routes
│   ├── services/         # Logika bisnis (Database interaction)
│   ├── utils/            # Utility classes (TokenManager, Custom Errors)
│   ├── validators/       # Skema validasi Joi
│   ├── app.js            # Inisialisasi Express app
│   └── server.js         # Entry point server
├── uploads/              # Folder penyimpanan file upload
├── package.json          # Dependensi dan script proyek
└── database.json         # Konfigurasi migrasi
```

## ⚙️ Persiapan Lingkungan (Setup)

### 1. Prasyarat

- Node.js (versi 14 atau lebih baru)
- PostgreSQL

### 2. Instalasi

Clone repositori ini dan instal dependensi:

```bash
npm install
```

### 3. Konfigurasi Database

Buat database di PostgreSQL, kemudian buat file `.env` di root direktori dan sesuaikan konfigurasinya:

```env
# Server Configuration
HOST=localhost
PORT=3000

# Database Configuration
PGUSER=user_postgres_anda
PGHOST=localhost
PGDATABASE=nama_database_anda
PGPASSWORD=password_postgres_anda
PGPORT=5432

# JWT Configuration
ACCESS_TOKEN_KEY=string_rahasia_akses_token
REFRESH_TOKEN_KEY=string_rahasia_refresh_token
```

### 4. Menjalankan Migrasi

Jalankan perintah berikut untuk membuat tabel di database:

```bash
npm run migrate up
```

## 🏃 Menjalankan Aplikasi

- **Mode Pengembangan (Development)**:

```bash
npm run start:dev
```

- **Mode Produksi (Production)**:

```bash
npm run start
```

Server akan berjalan di `http://localhost:3000` (atau sesuai konfigurasi `PORT` di `.env`).

## 📡 API Endpoints (Ringkasan)

| Method | Endpoint | Deskripsi | Akses |
| :----- | :------- | :--------- | :---- |
| POST | `/users` | Registrasi user baru | Public |
| POST | `/authentications` | Login (Mendapatkan Token) | Public |
| PUT | `/authentications` | Refresh Access Token | Public |
| GET | `/jobs` | List semua lowongan kerja | Public |
| POST | `/jobs` | Membuat lowongan baru | Private |
| POST | `/applications` | Melamar pekerjaan | Private |
| GET | `/profile` | Mendapatkan profil user | Private |
| POST | `/documents` | Unggah CV/Resume | Private |

Detail lengkap endpoint dapat dilihat pada file Postman Collection yang disertakan.

## 🧪 Pengujian

Tersedia folder **postman environment & collection** dan environment-nya untuk memudahkan pengujian API menggunakan Postman.

## 📊 Database Schema

Skema database (ERD) dapat dilihat pada file `ERD-OpenJob-versi-1.png` yang terdapat di root direktori.

---


## 📖 Lisensi
Proyek ini dibuat untuk keperluan edukasi pada platform **Dicoding Academy** - Belajar Fundamental Back-End dengan JavaScript. Silakan digunakan sebagai referensi belajar! 🎓

