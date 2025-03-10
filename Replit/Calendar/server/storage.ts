
import type { Event, InsertEvent, Settings, InsertSettings } from "@shared/schema";

class MemoryStorage {
  private events = new Map<number, Event>();
  private currentId = 1;
  private settings: Settings = {
    id: 1,
    theme: "warm",
    city: "istanbul",
    emailNotifications: true,
  };

  // CREATE
  async createEvent(data: InsertEvent): Promise<Event> {
    const id = this.currentId++;
    const event: Event = {
      id,
      title: data.title,
      description: data.description || null,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || null,
      coordinates: data.coordinates || null,
      creatorEmail: data.creatorEmail
    };
    this.events.set(id, event);
    return event;
  }

  // READ
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | null> {
    return this.events.get(id) || null;
  }

  // UPDATE
  async updateEvent(id: number, data: InsertEvent): Promise<Event> {
    const event = this.events.get(id);
    if (!event) {
      throw new Error("Event not found");
    }

    const updatedEvent: Event = {
      id,
      title: data.title,
      description: data.description || null,
      startTime: data.startTime,
      endTime: data.endTime,
      location: data.location || null,
      coordinates: data.coordinates || null,
      creatorEmail: data.creatorEmail
    };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  // DELETE
  async deleteEvent(id: number): Promise<void> {
    if (!this.events.has(id)) {
      throw new Error("Event not found");
    }
    this.events.delete(id);
  }

  // Settings operations
  async getSettings(): Promise<Settings> {
    return this.settings;
  }

  async updateSettings(data: InsertSettings): Promise<Settings> {
    this.settings = { ...this.settings, ...data };
    return this.settings;
  }
}

export const storage = new MemoryStorage();
