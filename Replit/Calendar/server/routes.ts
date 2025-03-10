import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import axios from "axios";
import { insertEventSchema, insertSettingsSchema } from "@shared/schema";

export async function registerRoutes(app: Express) {
  // Events API - CRUD Operations
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const event = await storage.getEvent(Number(req.params.id));
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      res.json(event);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch event" });
    }
  });

  app.post("/api/events", async (req, res) => {
    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation error", details: parsed.error.errors });
    }

    try {
      const event = await storage.createEvent(parsed.data);
      res.status(201).json(event);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create event" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    const parsed = insertEventSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Validation error", details: parsed.error.errors });
    }

    try {
      const event = await storage.updateEvent(id, parsed.data);
      res.json(event);
    } catch (error: any) {
      if (error.message === "Event not found") {
        res.status(404).json({ error: "Event not found" });
      } else {
        res.status(500).json({ error: "Failed to update event" });
      }
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid event ID" });
    }

    try {
      await storage.deleteEvent(id);
      res.status(204).end();
    } catch (error: any) {
      if (error.message === "Event not found") {
        res.status(404).json({ error: "Event not found" });
      } else {
        res.status(500).json({ error: "Failed to delete event" });
      }
    }
  });

  // Settings API
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.patch("/api/settings", async (req, res) => {
    const parsed = insertSettingsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error });
    }
    const settings = await storage.updateSettings(parsed.data);
    res.json(settings);
  });

  // Weather API
  app.get("/api/weather/:city", async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
      );
      res.json(response.data);
    } catch (error: any) {
      console.error('OpenWeather API error:', error.response?.data || error.message);
      res.status(500).json({ error: "Hava durumu bilgisi alınamadı" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}