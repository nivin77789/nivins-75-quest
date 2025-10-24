# Cult.fit Clone - Project Structure

This project is a comprehensive fitness and wellness application inspired by Cult.fit, built with React, TypeScript, and Firebase.

## Features

### 🏠 Main Dashboard (`/`)
- Overview of all fitness features
- Quick stats (active programs, workouts this week, calories burned)
- Feature cards linking to different sections

### 💪 Workouts (`/workouts`)
- HIIT, Strength Training, Cardio, and Fat Burn programs
- Workout duration, difficulty levels, and calorie estimates
- Personal training booking option

### 🍎 Nutrition (`/nutrition`)
- Daily calorie tracking
- Macronutrient monitoring (Protein, Carbs, Fats)
- Meal logging throughout the day

### 📅 Programs (`/programs`)
- Structured fitness programs
- **75 Hard Challenge** (fully functional)
- 30-Day Shred, Strength Builder, Yoga Journey (coming soon)

### 🏆 75 Hard Challenge (`/75-hard-challenge`)
Complete transformation program with:
- Daily tasks tracking (10 core tasks)
- Lookmaxing challenges
- Workout plans (home workouts days 1-15, gym workouts after)
- Water intake tracking (1 gallon/day)
- Weight tracking with BMI calculation
- Dopamine-boosting activities
- Skincare routines (morning & night)
- Daily steps counter
- Motivational quotes
- Atomic Habits content
- Daily notes

### 🛡️ Admin Panel (`/admin`)
- Platform analytics
- User management (view total users)
- System statistics
- Content management options

**Note:** Admin access requires role setup in Firebase. See [ADMIN_SETUP.md](./ADMIN_SETUP.md) for instructions.

### ⚙️ Settings (`/settings`)
- Profile information
- Security settings
- Notification preferences

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Backend:** Firebase (Firestore, Authentication)
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Animations:** Canvas Confetti

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── AnimatedBackground.tsx
│   ├── AppSidebar.tsx   # Main navigation sidebar
│   ├── Layout.tsx       # App layout wrapper
│   └── [other components...]
├── pages/
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Workouts.tsx
│   ├── Nutrition.tsx
│   ├── Programs.tsx
│   ├── SeventyFiveHard.tsx  # 75 Hard Challenge page
│   ├── Admin.tsx
│   ├── Settings.tsx
│   ├── Auth.tsx         # Login/Signup
│   └── NotFound.tsx
├── hooks/
│   ├── useAuth.tsx      # Firebase authentication hook
│   └── use-toast.ts
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── constants.ts     # App constants
│   └── utils.ts
└── App.tsx              # Main app with routing

```

## Navigation

The app uses a collapsible sidebar for navigation with sections:

**Main:**
- Dashboard
- Workouts
- Nutrition
- Programs

**Programs:**
- 75 Hard Challenge

**Admin** (visible only to admin users):
- Admin Panel

**Bottom:**
- Settings

## Firebase Collections

### `userProfiles`
Stores user profile information:
- name, age, height, initialWeight
- email
- startDate, endDate (for 75 Hard Challenge)

### `users/{uid}/dailyData/{date}`
Stores daily progress data:
- tasks, lookmaxingDone, waterIntake, weight
- dopamineTasks, skincareTasks, workouts
- dailySteps, notes

### `userRoles`
Manages user permissions:
- Document ID: user UID
- role: "admin" | "user"

## Authentication

- Email/password authentication via Firebase
- Protected routes (redirect to `/auth` if not logged in)
- Automatic session persistence
- Logout functionality in header

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Update `src/lib/firebase.ts` with your Firebase config
   - Enable Authentication and Firestore in Firebase Console

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Set up admin user (optional):**
   - Follow instructions in [ADMIN_SETUP.md](./ADMIN_SETUP.md)

## Key Features

✅ Responsive design (mobile, tablet, desktop)
✅ Dark/Light mode toggle
✅ Real-time data sync with Firebase
✅ Progress tracking with visual indicators
✅ Animated backgrounds
✅ Role-based access control
✅ Toast notifications
✅ Confetti celebrations for achievements
✅ BMI calculator
✅ Daily motivational quotes
✅ Atomic Habits daily content

## Future Enhancements

- [ ] Complete nutrition tracking with meal database
- [ ] Video workout classes
- [ ] Social features (friends, challenges)
- [ ] Advanced analytics and charts
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Payment integration for premium features
- [ ] Personal trainer matching
- [ ] Community forums
