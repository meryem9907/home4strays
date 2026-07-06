# Description 
Home4Strays is a platform where caretakers and stray animals (published by NGOs) can connect and be matched via a Tinderlike Matching algorithm. It should ease and fasten the adoption process.

# Scope 
1. Must-have
- caretaker only sees matched animals
- caretaker first has to give some informations about oneself and preferences: Distance, breed preference, accomodation style, space (qm/miles), experience with other animal (type, time), current animals (type, amount), permanent or temporary care, age preference, gender preference, vaccinated, free of flees?, castrated, accept chronic illness, prefered character (doesnt matter, specify)
- ngo can post animals with following information: image, breed, gender, weight, age, distance, vaccination, castration status, free of flees, chronic illness, character, desired food
- caretaker and ngo member can create a use profile
- an ngo member can create/edit/delete a ngo
- the caretaker can swipe between matched animals or click on buttons
- the caretaker can favor, like or dislike an animal
- the ngo member vice versa can find a match to 
- ngo member and caretaker can communicate via email
2. Nice-to-have

# Specification
1. Functional
- as a user i want to login/sign in with a specific role. On sign-in two roles are given.
- as a caretaker/ngo member i want my matches to be swipable or clickable.
- as a caretaker/ngo member i only want to see my matches
2. Non-functional
- as a user while signing in i want the questions to be asked page by page not all at once. 
- as a frontend dev I want to have a futuristic design. 
3. Constraints
- frontend: Next.js + tailwind
- Backend:Spring Boot
- Database: PostgreSQL
- ORM:  JPA for Spring Boot
- Auth: NextAuth/Auth.js, Clerk, Supabase Auth, or backend JWT
- File storage: S3 / Cloudflare R2 / Supabase Storage
- Email: Resend / SendGrid / AWS SES
- Deployment: Vercel + Render/Railway/Fly.io or AWS

# MVP
- Swipe throught matched results as caretaker and ngo member

# Sprints
- 1. 24.06 - 01.07
- Create a design with tinder effect in figma
- init repo and create project boilerplate
2. 02.07 - 08.07
- implement frontend
3. 08.07 - 15.07
- implement backend
4. 15.07 - 22.07 
- test and deploy 
- draft an UML-diagramm and create an architecture sketch