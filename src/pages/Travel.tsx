import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Train, Plane, Hotel, MapPin, Utensils } from "lucide-react";

const Travel = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-gradient-peaceful py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Travel Information</h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Plan your pilgrimage with comprehensive travel guides
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Transportation */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Transportation Options</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5 text-primary" />
                    By Road
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Madhya Pradesh is well connected by national highways. State transport buses
                    and private taxis are readily available.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5 text-primary" />
                    By Train
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Major temples are accessible via railway stations in Ujjain, Indore, Satna,
                    and other cities.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-primary" />
                    By Air
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Nearest airports: Indore (Devi Ahilyabai Holkar), Bhopal (Raja Bhoj), and
                    Jabalpur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Accommodation & Facilities</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hotel className="h-5 w-5 text-primary" />
                    Hotels & Lodges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Wide range of accommodation options available near all major temples:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Budget dharamshalas and guest houses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Mid-range hotels with modern amenities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Premium hotels for comfortable stays</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    Food & Dining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-3">
                    Sattvic and traditional vegetarian meals available:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Temple prasadam and langar services</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Local restaurants serving authentic cuisine</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Food courts near major temple complexes</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Travel Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Essential Travel Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>
                    <strong>Best time to visit:</strong> October to March for pleasant weather
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>
                    <strong>Dress code:</strong> Modest clothing recommended, traditional attire
                    preferred
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>
                    <strong>Photography:</strong> Check temple-specific rules before taking photos
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>
                    <strong>Advance booking:</strong> Recommended during festival seasons
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">5.</span>
                  <span>
                    <strong>Local guides:</strong> Available at major temples for detailed tours
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Travel;
