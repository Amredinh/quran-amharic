import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

// Enable JSON bodies with higher limits for XML translation uploads
app.use(express.json({ limit: "15mb" }));

// Ensure database directory exists
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "db.json");

// Helper to load/save database
interface DbSchema {
  blogs: any[];
  translations: { id: string; name: string; xml: string }[];
  reciters: { name: string; subfolder: string; isEveryAyah?: boolean }[];
  donationConfig: {
    message: string;
    buttonText: string;
    link: string;
    enabled: boolean;
  };
}

const DEFAULT_RECITERS = [
  { name: 'Abdulbasit Abdulsamad (Sura Recitation)', subfolder: 'basit', isEveryAyah: false },
  { name: 'Maher Al-Meaqli (Sura Recitation)', subfolder: 'maher', isEveryAyah: false },
  { name: 'Mishary Alafasi (Sura Recitation)', subfolder: 'afs', isEveryAyah: false },
  { name: 'Saad Al-Ghamdi (Sura Recitation)', subfolder: 's_gmd', isEveryAyah: false },
  { name: 'Abdulrahman Al-Sudaes (Sura Recitation)', subfolder: 'sds', isEveryAyah: false },
  { name: 'Abdul Basit (Every Ayah - AbdulSamad_64kbps)', subfolder: 'AbdulSamad_64kbps_QuranExplorer.Com', isEveryAyah: true },
  { name: 'Mishary Alafasy (Every Ayah - Alafasy_128kbps)', subfolder: 'Alafasy_128kbps', isEveryAyah: true },
  { name: 'Saad Al-Ghamdi (Every Ayah - Ghamadi_40kbps)', subfolder: 'Ghamadi_40kbps', isEveryAyah: true },
  { name: 'Mahmoud Al-Husary (Every Ayah - Husary_128kbps)', subfolder: 'Husary_128kbps', isEveryAyah: true },
  { name: 'Maher Al-Muaiqly (Every Ayah - Maher_AlMuaiqly_64kbps)', subfolder: 'Maher_AlMuaiqly_64kbps', isEveryAyah: true },
];

const loadDb = (): DbSchema => {
  if (fs.existsSync(DB_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    } catch (e) {
      console.error("Error reading database file, using defaults", e);
    }
  }

  // Create default mock data to seed DB
  const defaultDb: DbSchema = {
    blogs: [
      {
        id: 1,
        title: "Understanding the Revelation of Surah Al-Alaq",
        excerpt: "The first revealed surah holds deep significance...",
        content: "The revelation of Surah Al-Alaq marks the beginning of the Quranic journey. 'Iqra' or 'Read' was the first command given to Prophet Muhammad (PBUH) in the cave of Hira. This command highlights the supreme importance of knowledge, education, and literacy in the Islamic faith.",
        image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
        date: "Oct 24, 2023"
      },
      {
        id: 2,
        title: "The Importance of Tajweed",
        excerpt: "Why reciting the Quran correctly matters.",
        content: "Tajweed is the set of rules governing the pronunciation of Quranic letters. It is not merely about aesthetics; it is about preserving the divine message exactly as it was revealed.",
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=800",
        date: "Oct 20, 2023"
      }
    ],
    translations: [], // Starts with none; the frontend automatically defaults 'am' to the mock data, but customized data goes here
    reciters: DEFAULT_RECITERS,
    donationConfig: {
      message: "Help us keep Quran.et free and sustainable for the Ethiopian community.",
      buttonText: "Donate Now",
      link: "https://example.com/donate",
      enabled: true
    }
  };
  saveDb(defaultDb);
  return defaultDb;
};

const saveDb = (data: DbSchema) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
};

// Admin authentication middleware
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || "admin123";

const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers["authorization"]?.split(" ")[1] || req.headers["x-admin-token"];
  if (token && token === ADMIN_SECRET_KEY) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized access. Invalid or missing admin token." });
  }
};

// API ROUTES BEFORE VITE

// Public configuration and aggregated static database
app.get("/api/public/data", (req, res) => {
  const db = loadDb();
  res.json({
    blogs: db.blogs,
    reciters: db.reciters,
    donationConfig: db.donationConfig,
    translationsMeta: db.translations.map(t => ({ id: t.id, name: t.name })), // only return headers for list
  });
});

// GET specific translation XML content by ID
app.get("/api/public/translation/:id", (req, res) => {
  const db = loadDb();
  const tr = db.translations.find(t => t.id === req.params.id);
  if (tr) {
    res.json(tr);
  } else {
    res.status(404).json({ error: "Translation not found" });
  }
});

// Admin verify key
app.post("/api/admin/verify", (req, res) => {
  const { key } = req.body;
  if (key === ADMIN_SECRET_KEY) {
    res.json({ success: true, message: "Authentication successful" });
  } else {
    res.status(401).json({ success: false, error: "Invalid admin key" });
  }
});

// Admin endpoints (require token authentication)

// Read All Admin database
app.get("/api/admin/data", authenticateAdmin, (req, res) => {
  res.json(loadDb());
});

// Manage Blogs
app.post("/api/admin/blogs", authenticateAdmin, (req, res) => {
  const { title, excerpt, content, image } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required." });
    return;
  }
  const db = loadDb();
  const newBlog = {
    id: Date.now(),
    title,
    excerpt: excerpt || content.substring(0, 100) + "...",
    content,
    image: image || "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  };
  db.blogs.unshift(newBlog);
  saveDb(db);
  res.json(newBlog);
});

app.delete("/api/admin/blogs/:id", authenticateAdmin, (req, res) => {
  const idNum = parseInt(req.params.id);
  const db = loadDb();
  db.blogs = db.blogs.filter(b => b.id !== idNum);
  saveDb(db);
  res.json({ success: true, message: "Blog post removed." });
});

// Manage reciters
app.post("/api/admin/reciters", authenticateAdmin, (req, res) => {
  const { name, subfolder, isEveryAyah } = req.body;
  if (!name || !subfolder) {
    res.status(400).json({ error: "Name and subfolder identifier are required." });
    return;
  }
  const db = loadDb();
  const newReciter = { name, subfolder, isEveryAyah: !!isEveryAyah };
  db.reciters.push(newReciter);
  saveDb(db);
  res.json(newReciter);
});

app.delete("/api/admin/reciters", authenticateAdmin, (req, res) => {
  const { subfolder } = req.body;
  const db = loadDb();
  db.reciters = db.reciters.filter(r => r.subfolder !== subfolder);
  saveDb(db);
  res.json({ success: true, message: "Reciter removed." });
});

// Manage Translations
app.post("/api/admin/translations", authenticateAdmin, (req, res) => {
  const { id, name, xml } = req.body;
  if (!id || !name || !xml) {
    res.status(400).json({ error: "ID, Language Name, and XML content are required." });
    return;
  }
  const db = loadDb();
  
  // Upsert translation
  db.translations = db.translations.filter(t => t.id !== id);
  db.translations.push({ id, name, xml });
  saveDb(db);
  res.json({ success: true, message: `Translation for ${name} added successfully.` });
});

app.delete("/api/admin/translations/:id", authenticateAdmin, (req, res) => {
  const db = loadDb();
  db.translations = db.translations.filter(t => t.id !== req.params.id);
  saveDb(db);
  res.json({ success: true, message: "Translation removed." });
});

// Manage Donation Config
app.put("/api/admin/donation", authenticateAdmin, (req, res) => {
  const { message, buttonText, link, enabled } = req.body;
  const db = loadDb();
  db.donationConfig = {
    message: message || db.donationConfig.message,
    buttonText: buttonText || db.donationConfig.buttonText,
    link: link !== undefined ? link : db.donationConfig.link,
    enabled: enabled !== undefined ? !!enabled : db.donationConfig.enabled
  };
  saveDb(db);
  res.json(db.donationConfig);
});

// Serve separate dynamic admin dashboard at /admin
app.get("/admin", (req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "admin.html"));
});

// Vite server integrations or static build serve
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Quran.et Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
