import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import TempleCard from "@/components/TempleCard";
import { temples } from "@/data/temples";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import mahakaleshwar from "@/assets/mahakaleshwar.jpg";
import omkareshwar from "@/assets/omkareshwar.jpg";
import kalbhairav from "@/assets/kalbhairav.jpg";
import maihar from "@/assets/maihar.jpg";
import salkanpur from "@/assets/salkanpur.jpg";
import khajrana from "@/assets/khajrana.jpg";

const Temples = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [crowdFilter, setCrowdFilter] = useState("all");

  const templeImages: { [key: string]: string } = {
    mahakaleshwar,
    omkareshwar,
    kalbhairav,
    maihar,
    salkanpur,
    khajrana,
  };

  const districts = Array.from(new Set(temples.map((t) => t.district)));
  const types = Array.from(new Set(temples.map((t) => t.type)));

  const filteredTemples = temples.filter((temple) => {
    const matchesSearch =
      temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      temple.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = districtFilter === "all" || temple.district === districtFilter;
    const matchesType = typeFilter === "all" || temple.type === typeFilter;
    const matchesCrowd = crowdFilter === "all" || temple.crowdLevel === crowdFilter;

    return matchesSearch && matchesDistrict && matchesType && matchesCrowd;
  });

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-peaceful py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Explore Sacred Temples
          </h1>
          <p className="text-center text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover divine destinations across Madhya Pradesh
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <SearchBar onSearch={setSearchTerm} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={crowdFilter} onValueChange={setCrowdFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Crowd Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crowd Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Temples Grid */}
      <section className="container mx-auto px-4 pb-20">
        {filteredTemples.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemples.map((temple) => (
              <TempleCard
                key={temple.id}
                id={temple.id}
                name={temple.name}
                image={templeImages[temple.id]}
                district={temple.district}
                timings={temple.timings}
                type={temple.type}
                description={temple.description}
                crowdLevel={temple.crowdLevel}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground">No temples found matching your filters</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Temples;
