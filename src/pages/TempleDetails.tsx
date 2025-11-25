import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { temples } from "@/data/temples";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Clock, Calendar, Users, Phone, Car, Train, Plane, Ticket, Video, ExternalLink, TrendingUp } from "lucide-react";
import { predictDay, findBestTimeSlot, getTempleType } from "@/lib/predictionEngine";
import mahakaleshwar from "@/assets/mahakaleshwar.jpg";
import omkareshwar from "@/assets/omkareshwar.jpg";
import kalbhairav from "@/assets/kalbhairav.jpg";
import maihar from "@/assets/maihar.jpg";
import salkanpur from "@/assets/salkanpur.jpg";
import khajrana from "@/assets/khajrana.jpg";

const TempleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const temple = temples.find((t) => t.id === id);

  const templeImages: { [key: string]: string } = {
    mahakaleshwar,
    omkareshwar,
    kalbhairav,
    maihar,
    salkanpur,
    khajrana,
  };

  // Dynamic crowd predictions
  const crowdPredictions = useMemo(() => {
    if (!temple) return [];
    const templeType = getTempleType(temple.id, temple.type);
    return predictDay(temple.id, templeType, new Date(), "Clear", false);
  }, [temple]);

  const bestTimeSlot = useMemo(() => {
    return findBestTimeSlot(crowdPredictions);
  }, [crowdPredictions]);

  if (!temple) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Temple not found</h1>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "Low":
        return "bg-green-500 text-white";
      case "Medium":
        return "bg-yellow-500 text-white";
      case "High":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getCrowdBorder = (level: string) => {
    switch (level) {
      case "Low":
        return "border-green-500 shadow-lg shadow-green-500/30 bg-green-500/5";
      case "Medium":
        return "border-yellow-500";
      case "High":
        return "border-red-500";
      default:
        return "border-border";
    }
  };

  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${temple.name}, ${temple.district}, Madhya Pradesh`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getEmbedMapUrl = () => {
    const query = encodeURIComponent(`${temple.name}, ${temple.district}, Madhya Pradesh`);
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}`;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />

      {/* Hero Banner */}
      <section
        className="relative h-96 bg-cover bg-center"
        style={{ backgroundImage: `url(${templeImages[temple.id]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <Badge className="mb-4 badge-temple bg-primary text-primary-foreground">
            {temple.type}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{temple.name}</h1>
          <div className="flex flex-wrap gap-4 text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{temple.district}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{temple.timings}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <Button 
            size="lg" 
            className="gap-2 shadow-lg animate-pulse-slow"
            onClick={() => navigate(`/book-darshan/${temple.id}`)}
          >
            <Ticket className="h-5 w-5" />
            Book Darshan
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" variant="outline" className="gap-2">
                <Video className="h-5 w-5" />
                Watch Live Darshan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Virtual Darshan - {temple.name}</DialogTitle>
              </DialogHeader>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/live_stream?channel=UCkEwJ6Ml-kVBxF_Jsr0J_wA"
                  title="Live Darshan"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Live stream availability depends on temple schedule
              </p>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="crowd">Crowd Prediction</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="travel">How to Reach</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {temple.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{temple.description}</p>
                {temple.history && (
                  <div>
                    <h3 className="font-semibold mb-2">History</h3>
                    <p className="text-muted-foreground">{temple.history}</p>
                  </div>
                )}
                {temple.significance && (
                  <div>
                    <h3 className="font-semibold mb-2">Significance</h3>
                    <p className="text-muted-foreground">{temple.significance}</p>
                  </div>
                )}
                {temple.deity && (
                  <div>
                    <h3 className="font-semibold mb-2">Deity</h3>
                    <p className="text-muted-foreground">{temple.deity}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {temple.nearbyAttractions && temple.nearbyAttractions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Nearby Attractions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {temple.nearbyAttractions.map((attraction, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>{attraction}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="crowd" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Today's Crowd Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {crowdPredictions.map((data, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                        data.time_slot === bestTimeSlot
                          ? getCrowdBorder("Low")
                          : "border-border hover:border-muted-foreground/30 bg-muted/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{data.time_slot}</span>
                        {data.time_slot === bestTimeSlot && (
                          <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <Badge className={getCrowdColor(data.crowd_level)}>
                        {data.crowd_level} Crowd
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="flex items-center gap-2 font-semibold">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Best time to visit:
                  </p>
                  <p className="text-lg mt-1">{bestTimeSlot}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Festivals & Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                {temple.festivals && temple.festivals.length > 0 ? (
                  <ul className="space-y-3">
                    {temple.festivals.map((festival, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="font-medium">{festival}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">Festival information coming soon</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="travel" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Temple Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <iframe
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={getEmbedMapUrl()}
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                  <Button 
                    onClick={() => window.open(getGoogleMapsUrl(), '_blank')}
                    className="w-full gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>

            {temple.howToReach && (
              <>
                {temple.howToReach.road && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Car className="h-5 w-5" />
                        By Road
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{temple.howToReach.road}</p>
                    </CardContent>
                  </Card>
                )}

                {temple.howToReach.train && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Train className="h-5 w-5" />
                        By Train
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{temple.howToReach.train}</p>
                    </CardContent>
                  </Card>
                )}

                {temple.howToReach.air && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="h-5 w-5" />
                        By Air
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{temple.howToReach.air}</p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Helpline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  1800-MP-YATRA
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <Footer />
    </div>
  );
};

export default TempleDetails;
