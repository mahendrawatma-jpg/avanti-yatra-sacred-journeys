import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";

const Events = () => {
  const events = [
    {
      name: "Mahashivratri",
      date: "March 8, 2025",
      temple: "Mahakaleshwar Temple",
      location: "Ujjain",
      type: "Festival",
      description: "Grand celebration of Lord Shiva with special night-long prayers and rituals.",
    },
    {
      name: "Navratri",
      date: "April 10-18, 2025",
      temple: "Maihar Temple",
      location: "Satna",
      type: "Festival",
      description: "Nine days of devotion to Goddess Durga with special darshan arrangements.",
    },
    {
      name: "Ganesh Chaturthi",
      date: "August 29, 2025",
      temple: "Khajrana Ganesh Temple",
      location: "Indore",
      type: "Festival",
      description: "Celebration of Lord Ganesha's birth with elaborate decorations.",
    },
    {
      name: "Kartik Purnima",
      date: "November 12, 2025",
      temple: "Omkareshwar Temple",
      location: "Khandwa",
      type: "Special Darshan",
      description: "Sacred full moon day with special prayers and boat rituals on Narmada.",
    },
  ];

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
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {events.map((event, index) => (
            <Card key={index} className="temple-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{event.name}</CardTitle>
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-sm">{event.date}</span>
                    </div>
                  </div>
                  <Badge className="badge-temple bg-primary text-primary-foreground">
                    {event.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-1">{event.temple}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
