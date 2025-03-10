import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { insertEventSchema } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import DatePicker, { registerLocale } from "react-datepicker";
import { tr } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

// Türkçe yerelleştirmeyi kaydet
registerLocale("tr", tr);

interface EventFormProps {
  onClose: () => void;
  selectedDate?: Date;
  event?: Event | null;
  selectedEvent?: Event | null;
}

export default function EventForm({ onClose, selectedDate, selectedEvent }: EventFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Tarih ve saat için varsayılan değerleri ayarla
  const defaultDate = event?.startTime ? new Date(event.startTime) : selectedDate || new Date();
  const defaultEndDate = event?.endTime ? new Date(event.endTime) : new Date(defaultDate);
  if (!event?.endTime) {
    defaultEndDate.setHours(defaultEndDate.getHours() + 1);
  }

  const form = useForm({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: selectedEvent?.title || "",
      description: selectedEvent?.description || "",
      startTime: selectedEvent?.startTime ? new Date(selectedEvent.startTime) : new Date(),
      endTime: selectedEvent?.endTime ? new Date(selectedEvent.endTime) : new Date(Date.now() + 3600000),
      location: selectedEvent?.location || "",
      coordinates: selectedEvent?.coordinates || "",
      creatorEmail: selectedEvent?.creatorEmail || ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const method = selectedEvent ? "PUT" : "POST";
      const url = selectedEvent ? `/api/events/${selectedEvent.id}` : "/api/events";

      try {
        const res = await apiRequest(method, url, {
          ...data,
          startTime: data.startTime.toISOString(),
          endTime: data.endTime.toISOString()
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'İşlem başarısız oldu');
        }

        return await res.json();
      } catch (error: any) {
        throw new Error(error.message || 'İşlem başarısız oldu');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/events"] });
      toast({ title: "Etkinlik başarıyla oluşturuldu" });
      onClose();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Etkinlik oluşturulamadı", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Başlık</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Açıklama</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>
                Markdown formatını kullanabilirsiniz. Örnek: **kalın**, *italik*, - liste öğesi
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Başlangıç Zamanı</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="d MMMM yyyy HH:mm"
                    locale="tr"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bitiş Zamanı</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date) => field.onChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="d MMMM yyyy HH:mm"
                    locale="tr"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    minDate={form.watch("startTime")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Konum</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="creatorEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-posta</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Kaydediliyor..." : selectedEvent ? "Güncelle" : "Oluştur"}
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            İptal
          </Button>
        </div>
      </form>
    </Form>
  );
}