export interface Temple {
  id: string;
  name: string;
  image: string;
  district: string;
  timings: string;
  type: string;
  description: string;
  crowdLevel: "Low" | "Medium" | "High";
  history?: string;
  significance?: string;
  deity?: string;
  festivals?: string[];
  howToReach?: {
    road?: string;
    train?: string;
    air?: string;
  };
  nearbyAttractions?: string[];
}

export const temples: Temple[] = [
  {
    id: "mahakaleshwar",
    name: "Mahakaleshwar Temple",
    image: "/src/assets/mahakaleshwar.jpg",
    district: "Ujjain",
    timings: "4:00 AM – 11:00 PM",
    type: "Jyotirlinga",
    description: "One of the 12 sacred Jyotirlingas of Lord Shiva, known for the famous Bhasma Aarti.",
    crowdLevel: "High",
    history: "The Mahakaleshwar Temple is one of the most revered Jyotirlingas in India. The temple has a rich history dating back to ancient times and is mentioned in various Puranas.",
    significance: "The temple is believed to derive its power from within itself, unlike other images which are consecrated by Vedic mantras.",
    deity: "Lord Shiva as Mahakal",
    festivals: ["Mahashivratri", "Shravan Month", "Nag Panchami"],
    howToReach: {
      road: "Well connected by road to major cities in Madhya Pradesh",
      train: "Ujjain Junction railway station",
      air: "Nearest airport is Indore (55 km)"
    },
    nearbyAttractions: ["Ram Ghat", "Kal Bhairav Temple", "Sandipani Ashram"]
  },
  {
    id: "omkareshwar",
    name: "Omkareshwar Temple",
    image: "/src/assets/omkareshwar.jpg",
    district: "Khandwa",
    timings: "5:00 AM – 10:00 PM",
    type: "Jyotirlinga",
    description: "Jyotirlinga situated on Mandhata island shaped like the sacred OM symbol in Narmada River.",
    crowdLevel: "Medium",
    history: "Located on an island shaped like the Hindu symbol 'Om', this temple is one of the 12 revered Jyotirlinga shrines of Lord Shiva.",
    significance: "The island is formed by the Narmada River and has immense religious significance.",
    deity: "Lord Shiva as Omkareshwar",
    festivals: ["Mahashivratri", "Kartik Purnima", "Narmada Aarti Festival"],
    howToReach: {
      road: "Accessible by road from Indore (77 km) and Khandwa (65 km)",
      train: "Omkareshwar Road railway station",
      air: "Nearest airport is Indore (77 km)"
    },
    nearbyAttractions: ["Mamleshwar Temple", "Siddhanath Temple"]
  },
  {
    id: "kalbhairav",
    name: "Kal Bhairav Temple",
    image: "/src/assets/kalbhairav.jpg",
    district: "Ujjain",
    timings: "6:00 AM – 6:00 PM",
    type: "Shiva Temple",
    description: "Ancient temple of Lord Bhairav known for the unique ritual of offering liquor to the deity.",
    crowdLevel: "Medium",
    history: "One of the most ancient temples in Ujjain, dedicated to Lord Kal Bhairav, a fierce manifestation of Lord Shiva.",
    significance: "Known for the unique ritual where devotees offer liquor to the deity.",
    deity: "Lord Kal Bhairav",
    festivals: ["Bhairav Jayanti", "Mahashivratri"],
    howToReach: {
      road: "Located in Ujjain city center",
      train: "Ujjain Junction railway station (3 km)",
      air: "Nearest airport is Indore (55 km)"
    },
    nearbyAttractions: ["Mahakaleshwar Temple", "Ram Ghat"]
  },
  {
    id: "maihar",
    name: "Maihar Temple (Maa Sharda Devi)",
    image: "/src/assets/maihar.jpg",
    district: "Satna",
    timings: "5:00 AM – 9:00 PM",
    type: "Devi Temple",
    description: "Famous Maa Sharda temple accessible via ropeway, one of the Shakti Peethas.",
    crowdLevel: "Low",
    history: "Situated atop the Trikuta Hill, this temple is dedicated to Goddess Sharda Devi and is believed to be one of the Shakti Peethas.",
    significance: "The temple is located at a height and requires climbing 1063 steps to reach, or take the ropeway.",
    deity: "Maa Sharda Devi",
    festivals: ["Navratri", "Chaitra Navratri", "Sharad Purnima"],
    howToReach: {
      road: "Well connected by road to Satna and nearby cities",
      train: "Maihar railway station at the base of the hill",
      air: "Nearest airport is Jabalpur (120 km)"
    },
    nearbyAttractions: ["Alha Udal Fort", "Chitrakoot"]
  },
  {
    id: "salkanpur",
    name: "Salkanpur Temple (Mai Vindhyavasini Devi)",
    image: "/src/assets/salkanpur.jpg",
    district: "Sehore",
    timings: "6:00 AM – 10:00 PM",
    type: "Devi Temple",
    description: "Popular hilltop shrine with 1000+ steps, dedicated to Maa Vindhyavasini.",
    crowdLevel: "Low",
    history: "An ancient temple dedicated to Goddess Vindhyavasini, believed to be a manifestation of Goddess Durga.",
    significance: "Known for fulfilling the wishes of devotees who visit with pure devotion.",
    deity: "Maa Vindhyavasini",
    festivals: ["Navratri", "Diwali", "Navratri Maha Mela"],
    howToReach: {
      road: "Located about 40 km from Bhopal",
      train: "Nearest railway station is Bhopal (40 km)",
      air: "Bhopal airport (40 km)"
    },
    nearbyAttractions: ["Bhojpur Temple", "Upper Lake Bhopal"]
  },
  {
    id: "khajrana",
    name: "Khajrana Ganesh Temple",
    image: "/src/assets/khajrana.jpg",
    district: "Indore",
    timings: "6:00 AM – 7:00 PM",
    type: "Ganesh Temple",
    description: "Holiest Ganesh temple in MP, built by Rani Ahilyabai Holkar around 200 years ago.",
    crowdLevel: "Medium",
    history: "Built by Queen Ahilyabai Holkar around 200 years ago, this is one of the most famous Ganesh temples in Madhya Pradesh.",
    significance: "Known for its miraculous powers and believed to fulfill wishes of devotees.",
    deity: "Lord Ganesha",
    festivals: ["Ganesh Chaturthi", "Angarki Chaturthi", "Pran Pratishtha Day"],
    howToReach: {
      road: "Located in Indore city",
      train: "Indore Junction railway station (7 km)",
      air: "Devi Ahilyabai Holkar Airport (10 km)"
    },
    nearbyAttractions: ["Rajwada Palace", "Lal Bagh Palace", "Sarafa Bazaar"]
  },
  {
    id: "chintaman-ganesh",
    name: "Chintaman Ganesh Temple",
    image: "/src/assets/khajrana.jpg",
    district: "Ujjain",
    timings: "5:00 AM – 9:00 PM",
    type: "Ganesh Temple",
    description: "11th-century Ganesh temple known for wish fulfilment, one of the oldest in India.",
    crowdLevel: "Medium",
    history: "Dating back to the 11th century, this temple is one of the oldest Ganesh temples in India.",
    significance: "The name 'Chintaman' means 'one who removes worries', believed to fulfill all wishes.",
    deity: "Lord Ganesha",
    festivals: ["Ganesh Chaturthi", "Angarki Chaturthi"],
    howToReach: {
      road: "Located in Ujjain city",
      train: "Ujjain Junction railway station (4 km)",
      air: "Nearest airport is Indore (55 km)"
    },
    nearbyAttractions: ["Mahakaleshwar Temple", "Ram Ghat", "Kal Bhairav Temple"]
  },
  {
    id: "bhojpur",
    name: "Bhojpur Shiv Mandir",
    image: "/src/assets/mahakaleshwar.jpg",
    district: "Bhopal",
    timings: "6:00 AM – 6:00 PM",
    type: "Shiva Temple",
    description: "Houses one of the tallest Shiva lingams in India (7.5 feet), built by Raja Bhoj.",
    crowdLevel: "Low",
    history: "Built by Raja Bhoj in the 11th century, this incomplete temple houses one of the largest Shiva lingams in India.",
    significance: "The Shiva lingam is 7.5 feet tall and sits on a platform 21 feet in diameter.",
    deity: "Lord Shiva",
    festivals: ["Mahashivratri", "Shravan Month"],
    howToReach: {
      road: "Located 28 km from Bhopal",
      train: "Bhopal Junction railway station (28 km)",
      air: "Bhopal airport (30 km)"
    },
    nearbyAttractions: ["Bhimbetka Caves", "Upper Lake Bhopal"]
  },
  {
    id: "jatashankar",
    name: "Jatashankar Mahadev",
    image: "/src/assets/omkareshwar.jpg",
    district: "Pachmarhi",
    timings: "6:00 AM – 5:00 PM",
    type: "Shiva Temple",
    description: "Cave temple dedicated to Shiva with natural shivling formed by rock formations.",
    crowdLevel: "Low",
    history: "According to legend, Lord Shiva hid in this cave to escape the demon Bhasmasur.",
    significance: "The natural rock formation resembles Lord Shiva's hair (jata), giving the temple its name.",
    deity: "Lord Shiva",
    festivals: ["Mahashivratri"],
    howToReach: {
      road: "Located in Pachmarhi town",
      train: "Nearest railway station is Pipariya (52 km)",
      air: "Nearest airport is Bhopal (195 km)"
    },
    nearbyAttractions: ["Bee Falls", "Pandav Caves", "Dhupgarh"]
  },
  {
    id: "kaal-bhairav-dhar",
    name: "Kaal Bhairav of Dhar",
    image: "/src/assets/kalbhairav.jpg",
    district: "Dhar",
    timings: "6:00 AM – 8:00 PM",
    type: "Shiva Temple",
    description: "Very significant shrine for Tantric tradition, ancient temple with powerful deity.",
    crowdLevel: "Low",
    history: "An ancient temple with deep connections to tantric practices and traditions.",
    significance: "Known for powerful tantric rituals and is considered highly auspicious for spiritual seekers.",
    deity: "Lord Kaal Bhairav",
    festivals: ["Bhairav Jayanti", "Mahashivratri"],
    howToReach: {
      road: "Located in Dhar city",
      train: "Nearest railway station is Ratlam (65 km)",
      air: "Nearest airport is Indore (60 km)"
    },
    nearbyAttractions: ["Dhar Fort", "Bhojshala", "Mandu"]
  }
];
