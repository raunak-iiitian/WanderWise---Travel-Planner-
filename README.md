# 🌍 WanderWise: Smart Personalized Travel Planner

> **Plan Smarter, Travel Better.** > A DBMS Group Project by students of PDPM IIITDM Jabalpur.

![Project Status](https://img.shields.io/badge/Status-In%20Development-green)
![Tech Stack](https://img.shields.io/badge/Stack-Spring%20Boot%20|%20React%20|%20MySQL-blue)

## 📖 Overview

**WanderWise** is not just another itinerary app; it is a **smart travel planner** designed to solve the chaos of trip planning. It integrates sustainability, personalization, and analytics to create seamless travel experiences.

[cite_start]Whether you are a solo backpacker or a group of foodies, WanderWise optimizes your time and budget while keeping you aware of weather conditions and your carbon footprint[cite: 1, 5].

---

## 🚀 Key Features

### 🔑 Core Functionality
* [cite_start]**Itinerary Generation:** Suggests trips based on budget, duration, and specific interests (nature, adventure, heritage, food, shopping)[cite: 1].
* [cite_start]**Time Optimization:** Utilizes algorithms to suggest the best routes and timings to maximize sightseeing within a limited timeframe[cite: 1].
* [cite_start]**Budget Tracking:** detailed breakdown of costs including travel, hotel, food, and activities[cite: 1].

### ✨ Innovations & Unique Selling Points
* **☁️ Smart Context Awareness:** Suggests itineraries based on **season/weather** at the destination. [cite_start]For example, it avoids monsoon treks or suggests indoor activities during rain[cite: 1, 5].
* [cite_start]**👥 Group Personalization:** Allows multiple users to add preferences and creates a **merged itinerary** that balances everyone's interests (e.g., balancing the needs of foodies and trekkers)[cite: 5].
* [cite_start]**🌍 Eco-Travel Mode:** Suggests sustainable travel options (public transport, eco-friendly stays) and displays a **"Carbon Footprint Score"** for each itinerary[cite: 5].
* [cite_start]**🔗 Community-Driven Add-ons:** Travelers can share their own itineraries (e.g., "Student Budget Goa Trip") for others to reuse, edit, or rate[cite: 5].

---

## 🏗️ System Modules

The project is divided into 5 distinct modules to ensure modular development and clear separation of concerns:

1.  [cite_start]**User Module:** Handles authentication, user profiles, and preference management[cite: 2].
2.  [cite_start]**Destination & Activity Module:** Manages the database of places, activities, costs, and seasonality data[cite: 2].
3.  [cite_start]**Itinerary Generator Module:** The core logic engine that takes Budget + Time + Preference to output a smart plan[cite: 2].
4.  [cite_start]**Community/Sharing Module:** Allows users to save, share, and rate itineraries[cite: 2].
5.  [cite_start]**Admin/Analytics Module:** A dashboard to monitor users, track popular destinations, analyze seasonal trends, and view revenue stats[cite: 2, 5].

---

## 🛠️ Tech Stack

* [cite_start]**Backend:** Spring Boot (Java, REST APIs)[cite: 3].
* [cite_start]**Frontend:** React.js / Angular[cite: 3].
* [cite_start]**Database:** MySQL / PostgreSQL (Stores destinations, activities, costs, user prefs)[cite: 3].
* **External APIs:**
    * [cite_start]**OpenWeather API:** For real-time weather context[cite: 3].
    * [cite_start]**Google Maps API:** For travel times and routing[cite: 3].
* **Tools:** GitHub, Postman, Maven/Gradle.

---

## 🗄️ Database Design

The database schema is designed to support complex relationships between users, trips, and itineraries.

### ER Diagram Overview
The system relies on a relational database containing the following key entities:
* **User:** Stores login info, roles (User/Admin), and preferences.
* **Trip:** Represents a planned event with members, start/end dates.
* **Itinerary:** Connects trips to specific items, calculates total cost, and tracks the carbon footprint score.
* **Activity/Destination:** Static data regarding places to visit, their costs, and types (Sightseeing, Food, etc.).
* **Shared_Itinerary_Review:** Handles the community aspect where users rate shared plans.

> *Refer to the `docs/` folder for the full ER Diagram and Schema definitions.*

---

## 🔮 Future Enhancements
* [cite_start]**AI/ML Recommendation Engine:** To recommend trips based on past travel history and behavioral preferences[cite: 2].
* **Payment Gateway Integration:** For direct booking of activities and hotels.

---

## 👥 Team Members (IIITDMJ)

* **Pratik**
* **Shraddha**
* **Vinita**
* **Priya**

---

## ⚙️ How to Run

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/your-username/WanderWise.git](https://github.com/your-username/WanderWise.git)
    ```
2.  **Backend Setup:**
    * Navigate to `backend/`.
    * Configure `application.properties` with your MySQL credentials.
    * Run `mvn spring-boot:run`.
3.  **Frontend Setup:**
    * Navigate to `frontend/`.
    * Run `npm install`.
    * Run `npm start`.

---
