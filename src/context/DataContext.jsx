import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../admin/utils/api';
import { 
  agencyInfo as defaultAgencyInfo, 
  tourPackages as defaultPackages, 
  destinationsList as defaultDestinations, 
  blogPosts as defaultBlogs, 
  teamMembers as defaultTeam 
} from '../data/travelData';

const defaultReviews = [
  {
    name: "Praveen Kumar",
    time: "2 weeks ago",
    rating: 5,
    trip: "Family Kerala Tour",
    category: "Family",
    text: "Booked our family Kerala tour (Munnar & Alleppey) with Spot Tours and Travels Coimbatore. Excellent vehicle condition, hygienic resorts, and punctual driver. The entire trip coordination was seamless and stress-free. Highly recommended in Kuniyamuthur!"
  },
  {
    name: "Ananya & Karthik",
    time: "a month ago",
    rating: 5,
    trip: "Bali Honeymoon Package",
    category: "Honeymoon",
    text: "We planned our honeymoon to Bali through Spot Tours and Travels. From flight ticketing and visa guidance to romantic candlelit dinner and private sightseeing, everything was executed flawlessly. Best travel agency in Coimbatore!"
  },
  {
    name: "Suresh Sundaram",
    time: "3 weeks ago",
    rating: 5,
    trip: "Rameswaram Temple Tour",
    category: "Pilgrimage",
    text: "Organized a spiritual pilgrimage trip to Rameswaram & Madurai for my elderly parents. The AC tourist cab was spotless and the driver was extremely patient and courteous with senior citizens. Truly 'The Spot For Needs'!"
  },
  {
    name: "Deepak Raj",
    time: "2 months ago",
    rating: 5,
    trip: "Goa Friends Vacation",
    category: "Friends",
    text: "Spot Tours and Travels gave us the best transparent pricing for our Goa trip with friends. No hidden charges, great resort right next to the beach, and constant support from their Coimbatore office."
  },
  {
    name: "Divya Ramesh",
    time: "1 month ago",
    rating: 5,
    trip: "Ooty & Kodaikanal Tour",
    category: "Family",
    text: "Top-notch travel agency near Kuniyamuthur SBI Bank. Prompt train ticket reservations and a fantastic customized hill station itinerary. The resort stay in Ooty was breathtaking."
  },
  {
    name: "Mohammed Farooq",
    time: "3 months ago",
    rating: 5,
    trip: "Dubai Holiday Package",
    category: "International",
    text: "Booked a Dubai holiday for our family. Smooth tourist visa processing, hotel stays, desert safari, and Burj Khalifa tickets. Spot Tours handled everything end-to-end with high professionalism."
  }
];

const defaultServices = [
  {
    title: "Domestic Tour Packages",
    description: "Customized holiday packages across India including Ooty, Kodaikanal, Kerala, Goa, Kashmir, Himachal, and Rajasthan.",
    iconKey: "plane",
    order: 0
  },
  {
    title: "International Holidays",
    description: "Exciting overseas vacation packages to Dubai, Bali, Singapore, Malaysia, Thailand, Sri Lanka, Maldives, and Europe.",
    iconKey: "globe",
    order: 1
  },
  {
    title: "Honeymoon Specials",
    description: "Romantic getaways with luxury resort stays, flower bed decoration, private sightseeing cabs, and candlelit dinners.",
    iconKey: "heart",
    order: 2
  },
  {
    title: "Pilgrimage & Temple Tours",
    description: "Curated spiritual journeys to Rameswaram, Madurai, Tirupati, Varanasi, Chidambaram, Navagraha, and Kumbakonam.",
    iconKey: "om",
    order: 3
  },
  {
    title: "AC Cab & Bus Rentals",
    description: "Comfortable sedans, Innova, Crysta, and Tempo Travelers for local Coimbatore transfers and outstation journeys.",
    iconKey: "car",
    order: 4
  },
  {
    title: "Flight & Train Ticketing",
    description: "Quick, hassle-free domestic & international flight ticketing, tatkal train booking assistance, and bus seat reservations.",
    iconKey: "ticket",
    order: 5
  },
  {
    title: "Visa & Passport Guidance",
    description: "End-to-end support for tourist visas, travel insurance, documentation, and passport appointment assistance.",
    iconKey: "passport",
    order: 6
  },
  {
    title: "Hotel & Resort Bookings",
    description: "Handpicked verified 3-star, 4-star, 5-star hotels, homestays, and jungle resorts with complimentary breakfast.",
    iconKey: "hotel",
    order: 7
  }
];

const DEFAULT_CONTENT = {
  agency: {
    name: defaultAgencyInfo.name,
    tagline: defaultAgencyInfo.tagline,
    phone: defaultAgencyInfo.phone,
    phoneRaw: defaultAgencyInfo.phoneRaw,
    whatsapp: defaultAgencyInfo.whatsapp,
    whatsappRaw: defaultAgencyInfo.whatsappRaw,
    email: defaultAgencyInfo.email,
    address: defaultAgencyInfo.address,
    plusCode: defaultAgencyInfo.plusCode,
    weekdays: defaultAgencyInfo.workingHours.weekdays,
    sunday: defaultAgencyInfo.workingHours.sunday
  },
  hero: {
    hero_badge: "COIMBATORE'S PREMIER TRAVEL PARTNER",
    hero_title: "DISCOVER THE WORLD WITH SPOT TOURS & TRAVELS",
    hero_subtitle: "Specializing in customized domestic tours, international holidays, honeymoon packages, flight/train ticketing, and premium cab rentals from Kuniyamuthur, Coimbatore.",
    stat_rating: "4.7",
    stat_reviews: "Google Rating (34 Reviews)",
    stat_destinations: "100+",
    stat_destinations_label: "Tour Destinations",
    stat_customized: "100%",
    stat_customized_label: "Customized Itineraries",
    cta_primary: "View All Tour Packages",
    cta_secondary: "WhatsApp Enquire"
  },
  why_us: {
    section_tag: "WHY TRAVEL WITH US",
    section_title: "THE SPOT TOURS & TRAVELS ADVANTAGE",
    section_subtitle: "Headquartered in Kuniyamuthur, Coimbatore, we deliver genuine hospitality, transparent pricing, and 100% peace of mind.",
    card1_title: "100% Verified & Safe Stays",
    card1_desc: "We handpick only hygienic, top-reviewed 3-star to 5-star hotels and luxury houseboats checked for family and couple safety.",
    card2_title: "Tailor-Made Flexible Plans",
    card2_desc: "Customise sightseeing spots, vehicle types, stay durations, and meal preferences exactly according to your group's budget.",
    card3_title: "24/7 Dedicated Trip Coordinator",
    card3_desc: "Our Coimbatore travel specialist is always one call away throughout your journey to ensure seamless travel from day one.",
    card4_title: "4.7★ Top Rated in Coimbatore",
    card4_desc: "Backed by 34+ verified Google reviews from satisfied families, honeymooners, and corporate clients."
  },
  about: {
    page_tag: "ABOUT OUR AGENCY",
    page_title: "SPOT TOURS & TRAVELS",
    page_subtitle: "The Spot For Need's — Coimbatore's Most Trusted Travel Companion for Domestic & Overseas Holidays",
    journey_tag: "OUR JOURNEY",
    journey_title: "CREATING MEMORIES THAT LAST A LIFETIME",
    lead_paragraph: "Founded on the belief that travel should be enriching, transparent, and completely stress-free, Spot Tours and Travels has grown into one of Coimbatore's premier travel agencies and tour operators.",
    story_paragraph_1: "Located conveniently on Palakkad - Coimbatore Road (near SBI Bank, Pulakadu, Kuniyamuthur), we specialize in organizing customized family vacations, romantic honeymoons, spiritual temple pilgrimages, corporate outings, and reliable 24/7 outstation tourist cab rentals.",
    story_paragraph_2: "Under our brand promise 'The Spot For Need's', we take care of every minute detail: flight/train ticketing, star hotel reservations, local sightseeing with experienced polite chauffeurs, and dedicated trip coordinator assistance.",
    highlight_1: "100% Customized Itineraries to match your budget",
    highlight_2: "Transparent, upfront pricing with zero hidden surcharges",
    highlight_3: "Handpicked 3-Star, 4-Star & 5-Star verified hygienic resorts",
    highlight_4: "Well-maintained AC Sedans, Innovas, and Tempo Travelers",
    office_photo: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop",
    floating_stat_score: "4.7★",
    floating_stat_text: "Google Rating (34+ Reviews)",
    credential_1_title: "4.7 Google Rating",
    credential_1_desc: "Consistently rated 4.7 stars across 34+ verified customer reviews for top-notch service and punctuality.",
    credential_2_title: "Licensed Tour Operator",
    credential_2_desc: "Government-registered travel agency with commercial passenger transport permits and safety assurance.",
    credential_3_title: "Transparent Pricing",
    credential_3_desc: "Clear, itemized billing including tolls, driver allowances, and taxes with zero surprise charges.",
    credential_4_title: "Senior & Family Care",
    credential_4_desc: "Special pacing, ground-floor room allocations, and patient drivers trained for elder comfort."
  },
  packages_page: {
    page_tag: "TOUR ITINERARIES",
    page_title: "ALL TOUR PACKAGES",
    page_subtitle: "Explore handcrafted domestic & international tour packages starting from Coimbatore. 100% customizable to your schedule and budget.",
    custom_box_title: "Want a customized trip tailored specifically for your group?",
    custom_box_desc: "We arrange private tourist cabs, flight tickets, hotel reservations, and custom day-by-day plans from Coimbatore."
  },
  destinations_page: {
    page_tag: "EXPLORE THE WORLD",
    page_title: "POPULAR DESTINATIONS",
    page_subtitle: "From misty hill tops in the Nilgiris to turquoise tropical waters and grand world heritage sites. Discover your next journey starting from Coimbatore."
  },
  reviews_page: {
    page_tag: "VERIFIED REVIEWS",
    page_title: "TRAVELER TESTIMONIALS",
    page_subtitle: "Read real experiences and reviews from our travelers across Coimbatore and South India.",
    overall_rating: "4.7",
    review_source: "Based on 34+ Google Reviews"
  },
  blog_page: {
    page_tag: "TRAVEL GUIDES & TIPS",
    page_title: "SPOT TOURS TRAVEL BLOG",
    page_subtitle: "Expert travel advice, custom itinerary guides, temple circuits, and packing tips from Coimbatore travel specialists."
  },
  contact_page: {
    page_tag: "GET IN TOUCH",
    page_title: "CONTACT OUR OFFICE",
    page_subtitle: "Visit our Kuniyamuthur office or reach out via phone, email, or WhatsApp for quick holiday quotes.",
    office_details_heading: "OUR OFFICE DETAILS",
    office_details_sub: "We are located directly on Palakkad - Coimbatore Road, next to SBI Bank in Kuniyamuthur. Drop in anytime or call for prompt trip quotes!",
    enquiry_form_heading: "SEND US AN ENQUIRY",
    enquiry_form_sub: "Fill out this form and our team will get back to you with custom itinerary and pricing within 30 minutes!"
  },
  showcases: {
    orbit_tag: "360° IMMERSIVE EXPLORER",
    orbit_title: "DISCOVER THE WORLD IN 360° ORBIT",
    orbit_subtitle: "Glide through iconic global wonders. Hover over any destination card to pause the orbit and explore trip details.",
    gallery_tag: "3D PERSPECTIVE GALLERY",
    gallery_title: "CAPTURING REAL TRAVEL EXPERIENCES",
    gallery_subtitle: "Immerse yourself in dynamic 3D moments captured across our signature tours. Click or swipe any card to focus."
  },
  seo: {
    meta_title: "Spot Tours and Travels | Premier Travel Agency in Coimbatore",
    meta_description: "Spot Tours and Travels — Premium tour packages from Coimbatore. Ooty, Kodaikanal, Kerala, and International holidays.",
    meta_keywords: "Spot Tours and Travels, Coimbatore tour packages, Ooty cab packages, Kodaikanal tours, Kerala holidays",
    announcement_active: "true",
    announcement_message: "Summer Holiday Packages Open! Call 095005 51404 or WhatsApp for Customized Itineraries."
  }
};

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [packages, setPackages] = useState(defaultPackages);
  const [destinations, setDestinations] = useState(defaultDestinations);
  const [blogs, setBlogs] = useState(defaultBlogs);
  const [reviews, setReviews] = useState(defaultReviews);
  const [services, setServices] = useState(defaultServices);
  const [teamMembers, setTeamMembers] = useState(defaultTeam);
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      const [
        pkgRes,
        destRes,
        blogRes,
        revRes,
        srvRes,
        teamRes,
        cntRes
      ] = await Promise.allSettled([
        api.getPackages(),
        api.getDestinations(),
        api.getBlogs(),
        api.getReviews(),
        api.getServices(),
        api.getTeam(),
        api.getContent()
      ]);

      if (pkgRes.status === 'fulfilled' && pkgRes.value?.packages?.length) {
        setPackages(pkgRes.value.packages);
      }
      if (destRes.status === 'fulfilled' && destRes.value?.destinations?.length) {
        setDestinations(destRes.value.destinations);
      }
      if (blogRes.status === 'fulfilled' && blogRes.value?.blogs?.length) {
        setBlogs(blogRes.value.blogs);
      }
      if (revRes.status === 'fulfilled' && revRes.value?.reviews?.length) {
        setReviews(revRes.value.reviews);
      }
      if (srvRes.status === 'fulfilled' && srvRes.value?.services?.length) {
        setServices(srvRes.value.services);
      }
      if (teamRes.status === 'fulfilled' && teamRes.value?.members?.length) {
        setTeamMembers(teamRes.value.members);
      }
      if (cntRes.status === 'fulfilled' && cntRes.value?.content) {
        const merged = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
        Object.entries(cntRes.value.content).forEach(([section, keys]) => {
          if (!merged[section]) merged[section] = {};
          Object.entries(keys).forEach(([k, v]) => {
            merged[section][k] = v;
          });
        });
        setContent(merged);
      }
    } catch (e) {
      console.warn('Live data fetch failed, using fallback data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Derived agencyInfo synced with content.agency
  const agencyInfo = {
    ...defaultAgencyInfo,
    ...(content.agency || {}),
    phoneRaw: (content.agency?.phone || defaultAgencyInfo.phone).replace(/[^0-9]/g, ''),
    whatsappRaw: (content.agency?.whatsapp || defaultAgencyInfo.whatsapp).replace(/[^0-9]/g, ''),
    workingHours: {
      weekdays: content.agency?.weekdays || defaultAgencyInfo.workingHours.weekdays,
      sunday: content.agency?.sunday || defaultAgencyInfo.workingHours.sunday,
      status: "Mon - Sat: 9:00 AM – 8:30 PM"
    }
  };

  const submitReview = async (reviewData) => {
    try {
      const data = await api.createReview(reviewData);
      setReviews(prev => [data.review || reviewData, ...prev]);
      return { success: true, review: data.review };
    } catch (err) {
      // Optimistic update in state
      setReviews(prev => [reviewData, ...prev]);
      return { success: true, localOnly: true };
    }
  };

  const value = {
    packages,
    destinations,
    blogs,
    reviews,
    services,
    teamMembers,
    content,
    agencyInfo,
    loading,
    refreshData: fetchAllData,
    submitReview
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
