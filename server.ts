import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("marine.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS services (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    icon TEXT,
    category TEXT,
    image TEXT,
    tags TEXT
  );
`);

// Seed services if empty
const serviceCount = db.prepare("SELECT COUNT(*) as count FROM services").get() as { count: number };
if (serviceCount.count === 0) {
  const defaultServices = [
    {
      id: 'outboard',
      title: 'Outboard Maintenance',
      description: 'Full-service diagnostic and repair for major outboard brands. From 20-hour checks to complete powerhead rebuilds.',
      icon: 'Settings',
      category: 'engine',
      image: 'https://images.unsplash.com/photo-1599256629751-4d7764392661?q=80&w=800&auto=format&fit=crop',
      tags: 'Yamaha, Mercury, Honda, Suzuki'
    },
    {
      id: 'diesel',
      title: 'Diesel Engine Repair',
      description: 'Expert diesel mechanics for propulsion and generators. Fuel system cleaning, cooling system service, and valve adjustments.',
      icon: 'Wrench',
      category: 'engine',
      image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800&auto=format&fit=crop',
      tags: 'Inboard Specialty'
    },
    {
      id: 'battery',
      title: 'Battery & Power Systems',
      description: 'Battery bank optimization, smart charger installations, and shore power configurations.',
      icon: 'BatteryCharging',
      category: 'electrical',
      image: '',
      tags: 'Authorized Dealer'
    },
    {
      id: 'nav',
      title: 'Nav Systems & Sonar',
      description: 'Installation and calibration of Garmin, Simrad, and Lowrance systems including NMEA 2000 networking.',
      icon: 'Navigation',
      category: 'electrical',
      image: '',
      tags: 'Calibration Experts'
    },
    {
      id: 'winterization',
      title: 'Winterization',
      description: 'Full protection package: Shrink wrap, oil change, and engine fogging.',
      icon: 'Snowflake',
      category: 'seasonal',
      image: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=800&auto=format&fit=crop',
      tags: ''
    },
    {
      id: 'spring',
      title: 'Spring Startup',
      description: 'Complete fluid checks, system testing, and hull detailing for launch day.',
      icon: 'Sun',
      category: 'seasonal',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop',
      tags: ''
    }
  ];

  const insert = db.prepare("INSERT INTO services (id, title, description, icon, category, image, tags) VALUES (?, ?, ?, ?, ?, ?, ?)");
  defaultServices.forEach(s => insert.run(s.id, s.title, s.description, s.icon, s.category, s.image, s.tags));
}

// Seed default brand assets if empty
const assetCount = db.prepare("SELECT COUNT(*) as count FROM settings WHERE key IN ('hero_bg_url', 'watermark_url')").get() as { count: number };
if (assetCount.count === 0) {
  const defaultAssets = [
    { key: 'hero_bg_url', value: 'https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?q=80&w=2000&auto=format&fit=crop' },
    { key: 'watermark_url', value: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_e-A-n-c-h-o-r-l-o-g-o-u-r-l' },
    { key: 'header_logo_size', value: '32' },
    { key: 'footer_logo_size', value: '26' },
    { key: 'hero_logo_size', value: '120' }
  ];
  const insertSetting = db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)");
  defaultAssets.forEach(a => insertSetting.run(a.key, a.value));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const session = req.cookies.admin_session;
    if (session === "authenticated") {
      next();
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  };

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    try {
      const { email, password } = req.body;
      // Force hardcoded credentials for reliability in preview
      const adminEmail = "admin@email.com";
      const adminPassword = "huskie";

      console.log(`[AUTH DEBUG] Attempting login for: "${email}"`);
      console.log(`[AUTH DEBUG] Expected Email: "${adminEmail}"`);
      console.log(`[AUTH DEBUG] Password Match: ${password === adminPassword}`);

      if (email?.toLowerCase() === adminEmail && password === adminPassword) {
        res.cookie("admin_session", "authenticated", {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        return res.json({ success: true });
      } else {
        console.log(`Invalid credentials for: ${email}`);
        return res.status(401).json({ error: "Invalid email or password" });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ error: "Internal server error during login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("admin_session", {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });
    res.json({ success: true });
  });

  app.get("/api/auth/me", (req, res) => {
    const session = req.cookies.admin_session;
    if (session === "authenticated") {
      res.json({ authenticated: true, email: "admin@email.com" });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Settings API
  app.get("/api/settings/:key", (req, res) => {
    const row = db.prepare("SELECT value FROM settings WHERE key = ?").get(req.params.key) as { value: string } | undefined;
    res.json({ value: row?.value || null });
  });

  app.post("/api/settings", authenticate, (req, res) => {
    const { key, value } = req.body;
    if (!key) return res.status(400).json({ error: "Key is required" });
    
    db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run(key, value);
    res.json({ success: true });
  });

  // Services API
  app.get("/api/services", (req, res) => {
    const rows = db.prepare("SELECT * FROM services").all();
    res.json(rows.map((r: any) => ({ ...r, tags: r.tags ? r.tags.split(',').map((t: string) => t.trim()) : [] })));
  });

  app.post("/api/services/:id", authenticate, (req, res) => {
    const { title, description, image, tags, icon, category } = req.body;
    const tagsStr = Array.isArray(tags) ? tags.join(', ') : tags;
    
    db.prepare("UPDATE services SET title = ?, description = ?, image = ?, tags = ?, icon = ?, category = ? WHERE id = ?")
      .run(title, description, image, tagsStr, icon, category, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
