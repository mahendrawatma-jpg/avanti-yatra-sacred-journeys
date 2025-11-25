import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Events = () => {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    const { data, error } = await supabase
      .from("festivals")
      .select("*")
      .order("start_date", { ascending: true });

    if (data) {
      setFestivals(data);
    }
    setLoading(false);
  };

  const defaultEvents = [
    {
      name: "Mahashivratri",
      start_date: "2025-02-26",
      temple_id: "mahakaleshwar",
      category: "Festival",
      description: "Grand celebration of Lord Shiva with special night-long prayers and rituals at Mahakaleshwar Temple, Ujjain.",
    },
    {
      name: "Somvati Amavasya",
      start_date: "2025-03-29",
      temple_id: "omkareshwar",
      category: "Special Darshan",
      description: "Sacred new moon day falling on Monday, considered highly auspicious for Shiva worship.",
    },
    {
      name: "Chaitra Navratri",
      start_date: "2025-03-30",
      end_date: "2025-04-07",
      temple_id: "maihar",
      category: "Festival",
      description: "Nine days of devotion to Goddess Durga with special darshan arrangements at Maihar Temple.",
    },
    {
      name: "Shravan Month",
      start_date: "2025-07-17",
      end_date: "2025-08-15",
      temple_id: "mahakaleshwar",
      category: "Festival",
      description: "Holy month dedicated to Lord Shiva with special Rudrabhishek ceremonies every Monday.",
    },
    {
      name: "Ganesh Chaturthi",
      start_date: "2025-08-27",
      temple_id: "khajrana",
      category: "Festival",
      description: "Celebration of Lord Ganesha's birth with elaborate decorations and special pujas.",
    },
    {
      name: "Sharad Navratri",
      start_date: "2025-09-22",
      end_date: "2025-09-30",
      temple_id: "salkanpur",
      category: "Festival",
      description: "Nine nights of worship to Goddess Durga with grand celebrations and cultural programs.",
    },
    {
      name: "Diwali Poojan",
      start_date: "2025-10-20",
      temple_id: "",
      category: "Festival",
      description: "Festival of lights celebrated with special evening aartis at all temples.",
    },
    {
      name: "Kartik Purnima",
      start_date: "2025-11-05",
      temple_id: "omkareshwar",
      category: "Special Darshan",
      description: "Sacred full moon day with special prayers and boat rituals on Narmada River.",
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
    };
    return temples[templeId] || "All Temples";
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Festival: "bg-primary text-primary-foreground",
      "Special Darshan": "bg-secondary text-secondary-foreground",
      Rally: "bg-accent text-accent-foreground",
      Procession: "bg-muted text-muted-foreground",
    };
    return colors[category] || "bg-primary text-primary-foreground";
  };

  return (
    <div className="min-h-screen">
      <Navbar />

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
              <h2 className="text-2xl font-bold mb-6 text-center">All Festivals</h2>
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
