# Quran.et - Administrative Portal Documentation

This document serves as the guide for accessing and using the custom administration backend for the Quran.et portal. It documents the authentication mechanism, the separate admin panel, and the administrative API endpoints.

---

## 🔑 Accessing the Admin Panel

The administration controls have been entirely decoupled from the client app bundle to increase security and prevent search engines or standard users from indexing administrative panels.

- **Admin Landing URL:** `/admin`
- **Port:** Served on port `3000` (alongside the main site).
- **Default Authentication Key:** `admin123`

To modify the default passkey, specify the environment variable in `.env` (it will fall back to `admin123` if undefined):
```env
ADMIN_SECRET_KEY=your_secure_random_key_here
```

---

## 🛰️ Administrative API Endpoints

All administrative API endpoints are routed under `/api/admin/*`. They are secured with standard Bearer authorization token validation. Every request MUST declare one of the following validation headers:

- **Header Name:** `Authorization` with value `Bearer <ADMIN_SECRET_KEY>`
- **Backup Header:** `X-Admin-Token` with value `<ADMIN_SECRET_KEY>`

---

### 1. Key Verification
Confirms that the provided access key matches the environment server's credential key.

- **Endpoint:** `POST /api/admin/verify`
- **Request Body:**
  ```json
  {
    "key": "admin123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Authentication successful"
  }
  ```

---

### 2. State Sync
Fetches the entire current configuration, translation listing, active reciters, and blog archive in a single unified payload.

- **Endpoint:** `GET /api/admin/data`
- **Response (200 OK):**
  ```json
  {
    "blogs": [...],
    "translations": [...],
    "reciters": [...],
    "donationConfig": { "message": "...", "buttonText": "...", "link": "...", "enabled": true }
  }
  ```

---

### 3. Translation XML Deployment
Enables deploying additional XML files representing indigenous translations (such as Oromo, Amharic revisions, Tigrinya, etc.).

- **Endpoint:** `POST /api/admin/translations`
- **Request Body:**
  ```json
  {
    "id": "orom",
    "name": "Oromo",
    "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><quran>...</quran>"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Translation for Oromo added successfully."
  }
  ```

- **Delete Endpoint:** `DELETE /api/admin/translations/:id`

---

### 4. Blog Publishing
Articles published here will stream directly into the homepage's Recent Insights card and public archived articles feed.

- **Endpoint:** `POST /api/admin/blogs`
- **Request Body:**
  ```json
  {
    "title": "Understanding the Revelation of Surah Al-Alaq",
    "excerpt": "Short highlight snippet summarizing article content...",
    "content": "The full body prose discussing the Cave of Hira...",
    "image": "https://images.unsplash.com/photo-1542810634-71277d95dcbb"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "id": 1698243600000,
    "title": "...",
    "excerpt": "...",
    "content": "...",
    "image": "...",
    "date": "Jun 2, 2026"
  }
  ```

- **Delete Endpoint:** `DELETE /api/admin/blogs/:id`

---

### 5. Reciter Registrations
Enables adding alternative EveryAyah.com reciter folders to expand recitation capabilities within the reading viewer.

- **Endpoint:** `POST /api/admin/reciters`
- **Request Body:**
  ```json
  {
    "name": "Abdullah Basfar (Every Ayah)",
    "subfolder": "Abdullah_Basfar_32kbps",
    "isEveryAyah": true
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "name": "Abdullah Basfar (Every Ayah)",
    "subfolder": "Abdullah_Basfar_32kbps",
    "isEveryAyah": true
  }
  ```

- **Delete Endpoint:** `DELETE /api/admin/reciters` (Send `{ "subfolder": "basit" }` in JSON body)

---

### 6. Donation Support Prompts
Allows toggling the support prompt banner visibility, destination merchant links, and customized appeals.

- **Endpoint:** `PUT /api/admin/donation`
- **Request Body:**
  ```json
  {
    "message": "Support Quran.et spread indigenous translations.",
    "buttonText": "Donate via Abyssinia Bank",
    "link": "https://example.com/abyssinia",
    "enabled": true
  }
  ```
- **Response (200 OK):** Returns the full updated donation configuration.
