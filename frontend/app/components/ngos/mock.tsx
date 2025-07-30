import { NGO } from "../../types/ngo";

export const getExampleNGOs = (): NGO[] => {
  return [
    {
      id: "1",
      name: "Green Future Alliance",
      country: "Germany",
      verificationDoc: "green_future_cert.pdf",
      verified: true,
      logo: "https://images.unsplash.com/photo-1701500096456-28186c4a306d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      phone: "+49 30 12345678",
      email: "dLhM0@example.com",
      membercount: 15,
      websites: ["https://www.greenfuture.de", "https://www.instagram.com/tierschutzbund/?hl=de", "https://www.twitch.tv/tt_teamtierschutz?lang=de"],
      mission: "Promoting sustainable practices and environmental education across Europe.",
      member: [
      {
        name: "Nikolai Hellwig",
        email: "nikolai.hellwig@tha.de",
        image: "./logo.svg",
        schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" },
          { weekday: "Satruday", start: "09:00", end: "17:00" },
          { weekday: "Sunday", start: "09:00", end: "17:00" }
        ],
      },
      {
        name: "Test User",
        email: "jessica.schach1@hs-augsburg.de",
        image: null,
        schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" }
        ],
      },
      {
        name: "Jessica Schach 2",
        email: "jessica.schach2@hs-augsburg.de",
        image: null,
        schedule: [
          { weekday: "Monday", start: "09:00", end: "17:00" },
          { weekday: "Tuesday", start: "09:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" }
        ],
      },
      {
        name: "Jessica Schach 3",
        email: "jessica.schach3@hs-augsburg.de",
        image: null,
        schedule: [
          { weekday: "Monday", start: "19:00", end: "17:00" },
          { weekday: "Wednesday", start: "09:00", end: "17:00" },
          { weekday: "Thursday", start: "09:00", end: "17:00" },
          { weekday: "Friday", start: "09:00", end: "17:00" }
        ],
      }
    ],
      animals: [],
      ngoHours: [
        { weekday: "monday", start: "09:00", end: "18:00" },
        { weekday: "friday", start: "10:00", end: "16:00" }
      ],
      status: "Opened",
    },
    {
      id: "2",
      name: "Water for All",
      country: "Kenya",
      verificationDoc: "waterforall_approval.pdf",
      verified: false,
      logo: "https://images.unsplash.com/photo-1628760584600-6c31148991e9?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      phone: "+254 700 123456",
      email: "dLhM0@example.com",
      membercount: 22,
      websites: ["https://www.waterforall.org", "https://discord.gg/PcFvJ8nv "],
      mission: "Ensuring access to clean drinking water in rural African communities.",
      member: [
        {
          email: "james.kamau@waterforall.org",
          name: "James Kamau",
          image: "james_kamau.png",
          schedule: [
            { weekday: "tuesday", start: "08:00", end: "15:00" },
            { weekday: "thursday", start: "09:00", end: "14:00" },
          ]
        }
      ],
      animals: [],
      ngoHours: [
        { weekday: "tuesday", start: "08:00", end: "17:00" },
        { weekday: "thursday", start: "08:00", end: "16:00" }
      ],
      status: "Opened",
    },
    {
      id: "3",
      name: "EduLight Foundation",
      country: "India",
      verificationDoc: "edulight_docs.pdf",
      verified: false,
      logo: "https://images.unsplash.com/photo-1653499676737-becf2c9562c8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      phone: "+91 9876543210",
      email: "dLhM0@example.com",
      membercount: 30,
      websites: ["https://www.edulight.in"],
      mission: "Empowering underprivileged children through education and digital literacy.",
      member: [
        {
          email: "priya.menon@edulight.in",
          name: "Priya Menon",
          image: "priya_menon.jpeg",
          schedule: [
            { weekday: "monday", start: "10:00", end: "18:00" },
            { weekday: "friday", start: "09:00", end: "13:00" },
          ]
        }
      ],
      animals: [],
      ngoHours: [
        { weekday: "monday", start: "09:00", end: "17:00" },
        { weekday: "friday", start: "09:00", end: "15:00" }
      ],
      status: "Opened",
    },
    {
      id: "4",
      name: "OceanCare Watch",
      country: "Australia",
      verificationDoc: "oceancare_certified.pdf",
      verified: true,
      logo: "https://images.unsplash.com/photo-1584441405886-bc91be61e56a?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      phone: "+61 2 8000 1234",
      email: "dLhM0@example.com",
      membercount: 18,
      websites: ["https://www.oceancarewatch.au"],
      mission: "Protecting marine life and promoting clean oceans.",
      member: [
        {
          email: "lisa.brown@oceancarewatch.au",
          name: "Lisa Brown",
          image: "lisa_brown.png",
          schedule: [
            { weekday: "wednesday", start: "09:00", end: "17:00" },
            { weekday: "thursday", start: "09:30", end: "16:30" },
          ]
        }
      ],
      animals: [],
      ngoHours: [
        { weekday: "wednesday", start: "08:00", end: "18:00" },
        { weekday: "thursday", start: "08:00", end: "17:00" }
      ],
      status: "Opened",
    }
  ];
};
