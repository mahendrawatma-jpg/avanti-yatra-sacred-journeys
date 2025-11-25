import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Events = () => {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivals();
    fetchAlerts();
  }, []);

  const fetchFestivals = async () => {
    const { data, error } = await supabase
      .from("festivals")
      .select("*")
      .order("start_date", { ascending: true });

    if (data && data.length > 0) {
      setFestivals(data);
    }
    setLoading(false);
  };

  const fetchAlerts = async () => {
    const { data } = await supabase
      .from("alerts")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (data) {
      setAlerts(data);
    }
  };

  const defaultEvents = [
    {
      name: "Kartik Purnima Ujjain Mahotsav",
      start_date: "2025-11-15",
      temple_id: "mahakaleshwar",
      category: "Cultural + Spiritual",
      description: "Grand processions, lighting ceremonies, and Ganga aarti-style rituals at Ujjain. A beautiful celebration with thousands of oil lamps.",
    },
    {
      name: "Omkareshwar Narmada Aarti Festival",
      start_date: "2025-01-01",
      temple_id: "omkareshwar",
      category: "Daily Event",
      description: "Daily evening Aarti on Narmada River ghats at 7 PM. Witness the mesmerizing spectacle of lamps floating on the sacred river.",
    },
    {
      name: "Salkanpur Navratri Maha Mela",
      start_date: "2025-03-30",
      end_date: "2025-04-07",
      temple_id: "salkanpur",
      category: "Festival",
      description: "9 days of devotion with lakhs of devotees, bhajans, and extended darshan queues. Special arrangements for pilgrims.",
    },
    {
      name: "Maihar Sharda Devi Sharad Purnima Darshan",
      start_date: "2025-10-13",
      temple_id: "maihar",
      category: "Special Darshan",
      description: "Special night darshan with ropeway timings extended till midnight. Moonlit prayers at the hilltop temple.",
    },
    {
      name: "Indore Khajrana Ganesh Pran Pratishtha Day",
      start_date: "2025-09-15",
      temple_id: "khajrana",
      category: "Festival",
      description: "Annual festival celebrating the consecration of Lord Ganesha with special poojas and prasad distribution.",
    },
    {
      name: "Mahashivratri at Mahakaleshwar",
      start_date: "2025-02-26",
      temple_id: "mahakaleshwar",
      category: "Festival",
      description: "Grand celebration of Lord Shiva with special night-long prayers, Bhasma Aarti, and rituals at Mahakaleshwar Temple.",
    },
    {
      name: "Chaitra Navratri at Maihar",
      start_date: "2025-03-30",
      end_date: "2025-04-07",
      temple_id: "maihar",
      category: "Festival",
      description: "Nine days of devotion to Goddess Sharda with special darshan arrangements and ropeway services.",
    },
    {
      name: "Shravan Month Celebrations",
      start_date: "2025-07-17",
      end_date: "2025-08-15",
      temple_id: "mahakaleshwar",
      category: "Festival",
      description: "Holy month dedicated to Lord Shiva with special Rudrabhishek ceremonies every Monday.",
    },
    {
      name: "Ganesh Chaturthi at Khajrana",
      start_date: "2025-08-27",
      temple_id: "khajrana",
      category: "Festival",
      description: "10-day celebration of Lord Ganesha's birth with elaborate decorations, cultural programs, and special pujas.",
    },
    {
      name: "Sharad Navratri at Salkanpur",
      start_date: "2025-09-22",
      end_date: "2025-09-30",
      temple_id: "salkanpur",
      category: "Festival",
      description: "Nine nights of worship to Goddess Vindhyavasini with grand celebrations and cultural programs.",
    },
  ];

  const displayEvents = festivals.length > 0 ? festivals : defaultEvents;

  const getTempleName = (templeId: string) => {
    const temples: { [key: string]: string } = {
      mahakaleshwar: "Mahakaleshwar Temple, Ujjain",
      omkareshwar: "Omkareshwar Temple, Khandwa",
      kalbhairav: "Kal Bhairav Temple, Ujjain",
      maihar: "Maihar Temple, Satna",
      salkanpur: "Salkanpur Temple, Sehore",
      khajrana: "Khajrana Ganesh Temple, Indore",
      "chintaman-ganesh": "Chintaman Ganesh Temple, Ujjain",
      bhojpur: "Bhojpur Shiv Mandir, Bhopal",
      jatashankar: "Jatashankar Mahadev, Pachmarhi",
      "kaal-bhairav-dhar": "Kaal Bhairav Temple, Dhar",
    };
    return temples[templeId] || "All Temples";
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Festival: "bg-primary text-primary-foreground",
      "Special Darshan": "bg-secondary text-secondary-foreground",
      "Cultural + Spiritual": "bg-accent text-accent-foreground",
      "Daily Event": "bg-muted text-muted-foreground",
    };
    return colors[category] || "bg-primary text-primary-foreground";
  };

  const getAlertIcon = (alertType: string) => {
    return AlertCircle;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />

      <section className="bg-gradient-peaceful py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Events & Festivals
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Celebrate divine occasions at sacred temples across Madhya Pradesh
          </p>
        </div>
      </section>

      {/* Announcements Section */}
      {alerts.length > 0 && (
        <section className="container mx-auto px-4 py-6">
          <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, index) => (
              <Alert key={index} variant={alert.alert_type === "Crowd High" ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center py-12">
            <p>Loading events...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-6 min-w-max">
                {displayEvents.map((event, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Card className="w-80 cursor-pointer hover:shadow-lg transition-all temple-card">
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <CardTitle className="text-xl">{event.name}</CardTitle>
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-sm">
                              {new Date(event.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                              {event.end_date && 
                                ` - ${new Date(event.end_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric"
                                })}`
                              }
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 text-sm mb-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{getTempleName(event.temple_id)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{event.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(event.start_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })}
                            {event.end_date && 
                              ` - ${new Date(event.end_date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric"
                              })}`
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{getTempleName(event.temple_id)}</span>
                        </div>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                        <p className="text-muted-foreground pt-2">{event.description}</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </div>

            <div className="max-w-3xl mx-auto mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">All Festivals & Events</h2>
              <div className="grid gap-4">
                {displayEvents.map((event, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{event.name}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span>
                              {new Date(event.start_date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                              })}
                              {event.end_date && 
                                ` - ${new Date(event.end_date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric"
                                })}`
                              }
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{getTempleName(event.temple_id)}</span>
                          </div>
                        </div>
                        <Badge className={getCategoryColor(event.category)}>
                          {event.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">{event.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Events;
