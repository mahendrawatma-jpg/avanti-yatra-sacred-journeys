import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackButton from "@/components/BackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VirtualDarshan = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <BackButton />

      <section className="bg-gradient-peaceful py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Virtual Darshan</h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience divine blessings from anywhere in the world
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Live Temple Darshan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Virtual darshan services will be available soon. Stay connected with your favorite
                temples through live streaming of daily rituals, aartis, and special ceremonies.
              </p>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Live stream coming soon</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Aartis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <h4 className="font-semibold">Morning Aarti</h4>
                    <p className="text-sm text-muted-foreground">Mahakaleshwar Temple</p>
                  </div>
                  <span className="text-primary font-semibold">5:00 AM</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div>
                    <h4 className="font-semibold">Evening Aarti</h4>
                    <p className="text-sm text-muted-foreground">Omkareshwar Temple</p>
                  </div>
                  <span className="text-primary font-semibold">7:00 PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VirtualDarshan;
