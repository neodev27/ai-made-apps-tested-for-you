import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import EventForm from "./event-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Event } from "@shared/schema";
import ReactMarkdown from "react-markdown";

export default function CalendarView() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const { data: events = [], isLoading } = useQuery<Event[]>({ 
    queryKey: ["/api/events"],
    staleTime: 0, // Her zaman güncel veriyi alalım
    refetchOnWindowFocus: true // Sayfa fokuslandığında yenileyelim
  });

  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter events for the selected date
  const selectedDateEvents = events.filter(event => {
    if (!date) return false;
    const eventDate = new Date(event.startTime);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Takvim</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Etkinlik
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="border rounded-lg p-4">
          <CalendarUI
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full"
          />
        </div>

        <div className="lg:col-span-2 border rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">
            {date ? date.toLocaleDateString('tr-TR', { 
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            }) : 'Seçili Gün'} Etkinlikleri
          </h2>

          {isLoading ? (
            <p>Yükleniyor...</p>
          ) : selectedDateEvents && selectedDateEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedDateEvents.map(event => (
                <div key={event.id} className="border rounded p-3 bg-card">
                  <h3 className="font-medium text-card-foreground">{event.title}</h3>
                  {event.description && (
                    <div className="prose prose-sm mt-1 prose-headings:text-card-foreground prose-p:text-card-foreground prose-strong:text-card-foreground prose-em:text-card-foreground">
                      <ReactMarkdown>
                        {event.description}
                      </ReactMarkdown>
                    </div>
                  )}
                  <div className="text-sm mt-2 text-card-foreground">
                    <time>{new Date(event.startTime).toLocaleTimeString('tr-TR')}</time>
                    {' - '}
                    <time>{new Date(event.endTime).toLocaleTimeString('tr-TR')}</time>
                  </div>
                  {event.location && (
                    <p className="text-sm text-muted-foreground mt-1">
                      📍 {event.location}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event);
                        setIsDialogOpen(true);
                      }}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={async () => {
                        if (confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
                          await fetch(`/api/events/${event.id}`, {
                            method: 'DELETE',
                          });
                          queryClient.invalidateQueries({ queryKey: ['/api/events'] });
                        }
                      }}
                    >
                      Sil
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Bu tarihte etkinlik bulunmuyor.</p>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogTitle>{selectedEvent ? 'Etkinlik Düzenle' : 'Yeni Etkinlik'}</DialogTitle>
          <EventForm 
            onClose={() => {
              setIsDialogOpen(false);
              setSelectedEvent(null);
            }} 
            selectedDate={date}
            event={selectedEvent}
            selectedEvent={selectedEvent}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}