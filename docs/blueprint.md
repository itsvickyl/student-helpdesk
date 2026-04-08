# **App Name**: EduHelp Connect

## Core Features:

- User Authentication & Authorization (Student/Admin): Secure sign-up, login, and access control for students and administrators, managing user credentials with Firebase Authentication and profiles in Firestore. Includes password reset flow simulation.
- Student User Dashboard: Personalized dashboard for students to view their profile (Name, Phone, Email, DoB, Address), access quick actions (create ticket, raise issue, contact helpdesk), and navigate the application.
- Ticket Submission: Intuitive form for students to create new support tickets, with robust server-side validation using Next.js API routes before saving issue title and description to Firestore.
- Student Ticket History: Display a personalized list of all tickets submitted by the logged-in student on their dashboard, showing issue title, description, status (Solved/Unsolved), creation date, and last update date, fetched from Firestore.
- Admin Dashboard & Ticket Management: Comprehensive dashboard for administrators to view and manage all college-wide tickets. Includes functionality to view ticket details, update ticket status, and add resolution notes, with all changes reflected in Firestore.
- AI-Powered Ticket Categorization Tool: A generative AI tool integrated into the Next.js API routes that analyzes new ticket descriptions upon submission to suggest an appropriate department or category (e.g., 'IT Support', 'Admissions') which an administrator can review or confirm, improving triage efficiency.
- Robust Data Validation & Messaging: Comprehensive server-side input validation for all forms (phone number format, email format, non-empty fields) implemented via Next.js API routes, with user-friendly error messages and success notifications displayed prominently.

## Style Guidelines:

- Primary Color: A deep, academic blue (#334C99). Chosen to evoke professionalism, intellect, and trust, common in higher education branding.
- Background Color: A very light, hint-of-blue off-white (#EEF0F5). Provides a clean, modern, and easily readable canvas for text and content.
- Accent Color: A rich, muted gold/ochre (#D7A73F). This warm, sophisticated tone offers excellent contrast and adds a touch of distinction and importance, often found in collegiate emblems. While not strictly 30 degrees 'left' on the color wheel from the primary, it creates a harmonious and visually appealing contrast within a professional context, avoiding any problematic teal hues.
- All text (headlines and body) will use 'Inter' (sans-serif) for its modern, clean, and highly readable characteristics, suitable for conveying information clearly in a professional helpdesk environment.
- Use clear, universally recognizable line-art icons that correspond to common helpdesk actions (e.g., 'submit', 'edit', 'status update', 'logout'). Icons should maintain a professional and uncluttered aesthetic, supporting quick comprehension without decorative excess.
- Dashboard layouts will feature a prominent left sidebar for user details and main navigation. Content areas (like ticket lists) will be organized into a main section, utilizing cards for individual tickets to ensure visual separation and easy scanning of information.
- Animations will be minimal and subtle, primarily utilizing CSS transitions for hover states on buttons and links, or smooth fades for message displays. This approach ensures an 'attractive' yet unobtrusive user experience, adhering to a perceived preference for minimal client-side interaction.