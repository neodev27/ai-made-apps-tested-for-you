import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { insertSettingsSchema } from "@shared/schema";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({ 
    queryKey: ["/api/settings"] 
  });

  const form = useForm({
    resolver: zodResolver(insertSettingsSchema),
    values: settings || {
      theme: "warm",
      city: "istanbul",
      emailNotifications: true
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("PATCH", "/api/settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Settings updated successfully" });
    }
  });

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şehir</FormLabel>
                  <FormControl>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      {...field}
                    >
                      <optgroup label="Marmara Bölgesi">
                        <option value="Balikesir">Balıkesir</option>
                        <option value="Bilecik">Bilecik</option>
                        <option value="Bursa">Bursa</option>
                        <option value="Canakkale">Çanakkale</option>
                        <option value="Edirne">Edirne</option>
                        <option value="Istanbul">İstanbul</option>
                        <option value="Kirklareli">Kırklareli</option>
                        <option value="Kocaeli">Kocaeli</option>
                        <option value="Sakarya">Sakarya</option>
                        <option value="Tekirdag">Tekirdağ</option>
                        <option value="Yalova">Yalova</option>
                      </optgroup>
                      <optgroup label="Ege Bölgesi">
                        <option value="Afyonkarahisar">Afyonkarahisar</option>
                        <option value="Aydin">Aydın</option>
                        <option value="Denizli">Denizli</option>
                        <option value="Izmir">İzmir</option>
                        <option value="Kutahya">Kütahya</option>
                        <option value="Manisa">Manisa</option>
                        <option value="Mugla">Muğla</option>
                        <option value="Usak">Uşak</option>
                      </optgroup>
                      <optgroup label="Akdeniz Bölgesi">
                        <option value="Adana">Adana</option>
                        <option value="Antalya">Antalya</option>
                        <option value="Burdur">Burdur</option>
                        <option value="Hatay">Hatay</option>
                        <option value="Isparta">Isparta</option>
                        <option value="Kahramanmaras">Kahramanmaraş</option>
                        <option value="Mersin">Mersin</option>
                        <option value="Osmaniye">Osmaniye</option>
                      </optgroup>
                      <optgroup label="İç Anadolu Bölgesi">
                        <option value="Aksaray">Aksaray</option>
                        <option value="Ankara">Ankara</option>
                        <option value="Cankiri">Çankırı</option>
                        <option value="Eskisehir">Eskişehir</option>
                        <option value="Karaman">Karaman</option>
                        <option value="Kayseri">Kayseri</option>
                        <option value="Kirikkale">Kırıkkale</option>
                        <option value="Kirsehir">Kırşehir</option>
                        <option value="Konya">Konya</option>
                        <option value="Nevsehir">Nevşehir</option>
                        <option value="Nigde">Niğde</option>
                        <option value="Sivas">Sivas</option>
                        <option value="Yozgat">Yozgat</option>
                      </optgroup>
                      <optgroup label="Karadeniz Bölgesi">
                        <option value="Amasya">Amasya</option>
                        <option value="Artvin">Artvin</option>
                        <option value="Bartin">Bartın</option>
                        <option value="Bayburt">Bayburt</option>
                        <option value="Bolu">Bolu</option>
                        <option value="Corum">Çorum</option>
                        <option value="Duzce">Düzce</option>
                        <option value="Giresun">Giresun</option>
                        <option value="Gumushane">Gümüşhane</option>
                        <option value="Karabuk">Karabük</option>
                        <option value="Kastamonu">Kastamonu</option>
                        <option value="Ordu">Ordu</option>
                        <option value="Rize">Rize</option>
                        <option value="Samsun">Samsun</option>
                        <option value="Sinop">Sinop</option>
                        <option value="Tokat">Tokat</option>
                        <option value="Trabzon">Trabzon</option>
                        <option value="Zonguldak">Zonguldak</option>
                      </optgroup>
                      <optgroup label="Doğu Anadolu Bölgesi">
                        <option value="Agri">Ağrı</option>
                        <option value="Ardahan">Ardahan</option>
                        <option value="Bitlis">Bitlis</option>
                        <option value="Bingol">Bingöl</option>
                        <option value="Elazig">Elazığ</option>
                        <option value="Erzincan">Erzincan</option>
                        <option value="Erzurum">Erzurum</option>
                        <option value="Hakkari">Hakkari</option>
                        <option value="Igdir">Iğdır</option>
                        <option value="Kars">Kars</option>
                        <option value="Malatya">Malatya</option>
                        <option value="Mus">Muş</option>
                        <option value="Tunceli">Tunceli</option>
                        <option value="Van">Van</option>
                      </optgroup>
                      <optgroup label="Güneydoğu Anadolu Bölgesi">
                        <option value="Adiyaman">Adıyaman</option>
                        <option value="Batman">Batman</option>
                        <option value="Diyarbakir">Diyarbakır</option>
                        <option value="Gaziantep">Gaziantep</option>
                        <option value="Kilis">Kilis</option>
                        <option value="Mardin">Mardin</option>
                        <option value="Siirt">Siirt</option>
                        <option value="Sanliurfa">Şanlıurfa</option>
                        <option value="Sirnak">Şırnak</option>
                      </optgroup>
                      <optgroup label="Ege Bölgesi">
                        <option value="Afyonkarahisar">Afyonkarahisar</option>
                        <option value="Aydin">Aydın</option>
                        <option value="Denizli">Denizli</option>
                        <option value="Izmir">İzmir</option>
                        <option value="Kutahya">Kütahya</option>
                        <option value="Manisa">Manisa</option>
                        <option value="Mugla">Muğla</option>
                        <option value="Usak">Uşak</option>
                      </optgroup>
                      <optgroup label="Akdeniz Bölgesi">
                        <option value="Adana">Adana</option>
                        <option value="Antalya">Antalya</option>
                        <option value="Burdur">Burdur</option>
                        <option value="Hatay">Hatay</option>
                        <option value="Isparta">Isparta</option>
                        <option value="Kahramanmaras">Kahramanmaraş</option>
                        <option value="Mersin">Mersin</option>
                        <option value="Osmaniye">Osmaniye</option>
                      </optgroup>
                      <optgroup label="İç Anadolu Bölgesi">
                        <option value="Aksaray">Aksaray</option>
                        <option value="Ankara">Ankara</option>
                        <option value="Cankiri">Çankırı</option>
                        <option value="Eskisehir">Eskişehir</option>
                        <option value="Karaman">Karaman</option>
                        <option value="Kayseri">Kayseri</option>
                        <option value="Kirikkale">Kırıkkale</option>
                        <option value="Kirsehir">Kırşehir</option>
                        <option value="Konya">Konya</option>
                        <option value="Nevsehir">Nevşehir</option>
                        <option value="Nigde">Niğde</option>
                        <option value="Sivas">Sivas</option>
                        <option value="Yozgat">Yozgat</option>
                      </optgroup>
                      <optgroup label="Karadeniz Bölgesi">
                        <option value="Amasya">Amasya</option>
                        <option value="Artvin">Artvin</option>
                        <option value="Bartin">Bartın</option>
                        <option value="Bayburt">Bayburt</option>
                        <option value="Bolu">Bolu</option>
                        <option value="Corum">Çorum</option>
                        <option value="Duzce">Düzce</option>
                        <option value="Giresun">Giresun</option>
                        <option value="Gumushane">Gümüşhane</option>
                        <option value="Karabuk">Karabük</option>
                        <option value="Kastamonu">Kastamonu</option>
                        <option value="Ordu">Ordu</option>
                        <option value="Rize">Rize</option>
                        <option value="Samsun">Samsun</option>
                        <option value="Sinop">Sinop</option>
                        <option value="Tokat">Tokat</option>
                        <option value="Trabzon">Trabzon</option>
                        <option value="Zonguldak">Zonguldak</option>
                      </optgroup>
                      <optgroup label="Doğu Anadolu Bölgesi">
                        <option value="Agri">Ağrı</option>
                        <option value="Ardahan">Ardahan</option>
                        <option value="Bitlis">Bitlis</option>
                        <option value="Bingol">Bingöl</option>
                        <option value="Elazig">Elazığ</option>
                        <option value="Erzincan">Erzincan</option>
                        <option value="Erzurum">Erzurum</option>
                        <option value="Hakkari">Hakkari</option>
                        <option value="Igdir">Iğdır</option>
                        <option value="Kars">Kars</option>
                        <option value="Malatya">Malatya</option>
                        <option value="Mus">Muş</option>
                        <option value="Tunceli">Tunceli</option>
                        <option value="Van">Van</option>
                      </optgroup>
                      <optgroup label="Güneydoğu Anadolu Bölgesi">
                        <option value="Adiyaman">Adıyaman</option>
                        <option value="Batman">Batman</option>
                        <option value="Diyarbakir">Diyarbakır</option>
                        <option value="Gaziantep">Gaziantep</option>
                        <option value="Kilis">Kilis</option>
                        <option value="Mardin">Mardin</option>
                        <option value="Siirt">Siirt</option>
                        <option value="Sanliurfa">Şanlıurfa</option>
                        <option value="Sirnak">Şırnak</option>
                      </optgroup>
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailNotifications"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel>Email Notifications</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h2 className="font-semibold">Pomodoro Ayarları</h2>
              
              <FormField
                control={form.control}
                name="pomodoroWorkDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Çalışma Süresi (dakika)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Süre seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[5,10,15,20,25,30,35,40,45,50].map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} dakika
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pomodoroBreakDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kısa Mola Süresi (dakika)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Süre seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[5,10,15,20,25,30,35,40,45,50].map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} dakika
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pomodoroLongBreakDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uzun Mola Süresi (dakika)</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Süre seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[5,10,15,20,25,30,35,40,45,50].map(duration => (
                          <SelectItem key={duration} value={duration.toString()}>
                            {duration} dakika
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pomodoroRounds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uzun Mola Öncesi Tur Sayısı</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={mutation.isPending}>
              Save Changes
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}