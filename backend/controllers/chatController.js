import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Instructor from '../models/Instructor.js';

let GoogleGenerativeAI;
try {
  const aiModule = await import('@google/generative-ai');
  GoogleGenerativeAI = aiModule.GoogleGenerativeAI;
} catch (error) {
  console.log('Google Generative AI SDK not imported yet. Dynamic import will run or fallback will be used.');
}

export const handleChat = async (req, res, next) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // Try to identify user if authenticated (optional authorization)
    let user = null;
    if (req.headers.authorization?.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.id).select('-password');
      } catch (e) {
        // Treat as guest
      }
    }

    // Fetch active instructors
    const instructors = await Instructor.find({ isActive: true });

    // Check if Gemini API key is available
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      if (!GoogleGenerativeAI) {
        try {
          const aiModule = await import('@google/generative-ai');
          GoogleGenerativeAI = aiModule.GoogleGenerativeAI;
        } catch (e) {
          console.error('Failed to import @google/generative-ai package dynamically:', e.message);
        }
      }

      if (GoogleGenerativeAI) {
        try {
          const genAI = new GoogleGenerativeAI(geminiKey);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

          // Format instructors context
          const instructorsCtx = instructors
            .map(
              (i) =>
                `- **${i.name}**
  * Specializations: ${i.specializations.join(', ')}
  * Yoga Types: ${i.yogaTypes.join(', ')}
  * Location: ${i.location}
  * Experience: ${i.experience} years
  * Rating: ${i.rating} ★ (${i.reviewCount} reviews)
  * Price: $${i.sessionPrice}/hour
  * Bio: "${i.bio}"`
            )
            .join('\n');

          const systemPrompt = `You are "Harmony AI Assistant", a friendly, empathetic, and professional yoga booking assistant for "Harmony Bookings".
Your role is to help users find suitable yoga instructors, suggest styles, explain yoga benefits, and explain how the booking system works.

Here is the list of active instructors available in the database:
${instructorsCtx}

Booking System Guidelines:
1. Users can browse the list of instructors on the "Explore Instructors" page.
2. Users can view detailed profiles (experience, specializations, reviews, session prices).
3. To book, they click "Book Session" on the instructor's page, select an available date and 1-hour time slot, add any optional notes, and complete the booking.
4. They can view, manage, and join sessions (Zoom/Google Meet links are provided in the booking details) from the "My Sessions" tab in their Dashboard.
5. Users can also view and edit their preferences in the "Profile" tab to receive personalized recommendations.

Current User: ${user ? `${user.name} (Location: ${user.location || 'Unknown'}, Preferences: ${user.yogaPreferences?.join(', ') || 'None'})` : 'Guest Visitor'}

Response Rules:
- Be warm, encouraging, and welcoming. Use appropriate emojis.
- Keep responses relatively concise, focused, and easy to read.
- Use Markdown formatting (bold, bullet points, headers, or clean tables) to present lists of instructors or choices.
- If recommending instructors, clearly state their session price, rating, location, and why they fit the user's query.
- When referring to pages, you can use markdown links:
  * Browse instructors: [Explore Instructors](/instructors)
  * Login page: [Log In](/login)
  * Signup page: [Sign Up](/signup)
  * User Dashboard: [Dashboard](/dashboard)
  * User Profile: [Profile](/profile)
  * User Bookings: [My Sessions](/my-sessions)
- Do not mention implementation details (like MONGODB_URI or environment keys).`;

          // Format history for Gemini chat
          // Gemini chat history expects [{ role: 'user' | 'model', parts: [{ text: string }] }]
          const formattedHistory = [];
          if (history && Array.isArray(history)) {
            history.slice(-10).forEach((chat) => {
              formattedHistory.push({
                role: chat.sender === 'user' ? 'user' : 'model',
                parts: [{ text: chat.text }],
              });
            });
          }

          const chatSession = model.startChat({
            history: formattedHistory,
            systemInstruction: systemPrompt,
          });

          const result = await chatSession.sendMessage(message);
          const responseText = result.response.text();

          return res.json({
            success: true,
            message: responseText,
            mode: 'ai',
          });
        } catch (apiError) {
          console.error('Gemini API execution error, falling back to local assistant:', apiError.message);
          // If Gemini fails, fall through to fallback
        }
      }
    }

    // --- FALLBACK LOCAL ASSISTANT ---
    const msgLower = message.toLowerCase();
    let responseText = '';
    const name = user ? user.name.split(' ')[0] : 'there';

    // 1. Greetings
    if (msgLower.match(/\b(hi|hello|hey|greetings|hola|good morning|good afternoon)\b/)) {
      responseText = `Hello ${name}! 👋 Welcome to Harmony Bookings. I am your Harmony Assistant. 

I can help you:
- 🧘 **Find yoga instructors** based on your preferences
- 📍 **Filter instructors** by location (e.g. New York, LA, Austin, Remote)
- 💰 **Find affordable options** (e.g. classes under $75/hr)
- 📖 **Explain yoga styles** (Vinyasa, Yin, Hatha, Kundalini, Restorative)
- 🗓️ **Guide you through booking** a session

What are you looking for today?`;
    }
    // 2. Booking instructions
    else if (msgLower.includes('book') || msgLower.includes('schedule') || msgLower.includes('reserve') || msgLower.includes('appointment')) {
      responseText = `Booking a private session with one of our certified yoga instructors is simple! Here is how to do it:

1. Browse our available instructors on the **[Explore Instructors](/instructors)** page.
2. Click on the profile of the instructor you'd like to work with.
3. Click the **Book Session** button.
4. Select a date and an available 1-hour slot from their schedule.
5. Add any personal goals or notes for the session and confirm.

You can manage all your sessions, see meeting links (Zoom/Google Meet), and track your history in **[My Sessions](/my-sessions)** inside your dashboard.`;
    }
    // 3. Yoga Style Explanations
    else if (msgLower.includes('style') || msgLower.includes('types of yoga') || msgLower.includes('hatha') || msgLower.includes('vinyasa') || msgLower.includes('yin') || msgLower.includes('kundalini') || msgLower.includes('restorative') || msgLower.includes('ashtanga')) {
      let matchedStyle = '';
      if (msgLower.includes('vinyasa')) matchedStyle = 'Vinyasa';
      else if (msgLower.includes('hatha')) matchedStyle = 'Hatha';
      else if (msgLower.includes('yin')) matchedStyle = 'Yin';
      else if (msgLower.includes('kundalini')) matchedStyle = 'Kundalini';
      else if (msgLower.includes('restorative')) matchedStyle = 'Restorative';
      else if (msgLower.includes('ashtanga')) matchedStyle = 'Ashtanga';

      if (matchedStyle) {
        let details = '';
        if (matchedStyle === 'Vinyasa') details = 'a dynamic practice connecting movement and breath. Ideal for building strength, endurance, and cardiovascular health.';
        if (matchedStyle === 'Hatha') details = 'a foundational, slower-paced practice focused on alignment, breathing techniques, and basic physical postures. Great for beginners!';
        if (matchedStyle === 'Yin') details = 'a slow-paced style targeting deep connective tissues (fascia, joints). Postures are held for 3-5 minutes, offering deep relaxation.';
        if (matchedStyle === 'Kundalini') details = 'incorporates breathwork, chanting, meditation, and repetitive physical poses to awaken energy within the body.';
        if (matchedStyle === 'Restorative') details = 'focused on passive stretching and relaxation, utilizing props (bolsters, blankets) to release muscle tension with zero effort.';
        if (matchedStyle === 'Ashtanga') details = 'a structured, rigorous style following a specific sequence of posture flows. Best for building physical discipline.';

        const styleInstructors = instructors.filter(i => 
          i.yogaTypes.some(t => t.toLowerCase() === matchedStyle.toLowerCase()) ||
          i.specializations.some(s => s.toLowerCase() === matchedStyle.toLowerCase())
        );

        responseText = `🧘 **${matchedStyle} Yoga** is ${details}\n\n`;
        if (styleInstructors.length > 0) {
          responseText += `Here are our instructors specializing in **${matchedStyle}**:\n`;
          styleInstructors.forEach(i => {
            responseText += `- **[${i.name}](/instructors/${i._id})** ($${i.sessionPrice}/hr, ${i.rating} ★, based in ${i.location})\n`;
          });
        } else {
          responseText += `We currently don't have active instructors specializing in ${matchedStyle}, but check out our **[Explore Instructors](/instructors)** page for all profiles.`;
        }
      } else {
        responseText = `We support a variety of yoga styles at Harmony Bookings:
- **Hatha**: Gentle and slow-paced, great for beginners.
- **Vinyasa**: Flowing, dynamic movement synchronized with breath.
- **Yin**: Restorative, holding deep stretches for deep muscle/fascia release.
- **Kundalini**: Dynamic breathing, chanting, and energy activation.
- **Restorative**: Deep healing relaxation using props.
- **Ashtanga/Power Yoga**: Athletic and strength-focused sequences.

Who would you like to practice with? Check our **[Explore Instructors](/instructors)** page to filter by these styles!`;
      }
    }
    // 4. Price-based queries
    else if (msgLower.includes('price') || msgLower.includes('cost') || msgLower.includes('cheap') || msgLower.includes('rate') || msgLower.includes('under') || msgLower.includes('$')) {
      let maxPrice = 80; // default cutoff
      const numMatch = msgLower.match(/\$?(\d+)/);
      if (numMatch && numMatch[1]) {
        maxPrice = parseInt(numMatch[1], 10);
      }

      const affordable = instructors.filter(i => i.sessionPrice <= maxPrice);

      if (affordable.length > 0) {
        responseText = `Here are instructors with session rates of **$${maxPrice} or less**:\n\n`;
        affordable.sort((a, b) => a.sessionPrice - b.sessionPrice).forEach(i => {
          responseText += `- **[${i.name}](/instructors/${i._id})** — **$${i.sessionPrice}/hour** (${i.rating} ★, teaches ${i.yogaTypes.join(', ')})\n`;
        });
      } else {
        const cheapest = [...instructors].sort((a, b) => a.sessionPrice - b.sessionPrice)[0];
        responseText = `We couldn't find instructors under $${maxPrice}/hr. Our most affordable instructor is **[${cheapest?.name}](/instructors/${cheapest?._id})** at **$${cheapest?.sessionPrice}/hour**. Would you like to check their profile?`;
      }
    }
    // 5. Location-based queries
    else if (msgLower.includes('location') || msgLower.includes('in ') || msgLower.includes('near') || msgLower.includes('live') || 
             locations.some(loc => msgLower.includes(loc.split(',')[0].toLowerCase()))) {
      
      let matchedLoc = '';
      if (msgLower.includes('new york') || msgLower.includes('ny')) matchedLoc = 'New York, NY';
      else if (msgLower.includes('los angeles') || msgLower.includes('la')) matchedLoc = 'Los Angeles, CA';
      else if (msgLower.includes('austin') || msgLower.includes('tx')) matchedLoc = 'Austin, TX';
      else if (msgLower.includes('seattle') || msgLower.includes('wa')) matchedLoc = 'Seattle, WA';
      else if (msgLower.includes('miami') || msgLower.includes('fl')) matchedLoc = 'Miami, FL';
      else if (msgLower.includes('remote') || msgLower.includes('online')) matchedLoc = 'Remote';

      if (matchedLoc) {
        const localInstructors = instructors.filter(i => i.location.toLowerCase().includes(matchedLoc.toLowerCase().split(',')[0]));
        if (localInstructors.length > 0) {
          responseText = `Here are our instructors in or near **${matchedLoc}**:\n\n`;
          localInstructors.forEach(i => {
            responseText += `- **[${i.name}](/instructors/${i._id})** ($${i.sessionPrice}/hr, ${i.rating} ★, teaches ${i.yogaTypes.join(', ')})\n`;
          });
        } else {
          responseText = `We don't have active instructors physically located in **${matchedLoc}**. However, you can book **Remote** online sessions with instructors like **[Anika Patel](/instructors/${instructors.find(inst => inst.location === 'Remote')?._id || ''})**!`;
        }
      } else {
        responseText = `Our instructors are located in **New York, NY**, **Los Angeles, CA**, **Austin, TX**, **Seattle, WA**, and **Miami, FL**. We also offer **Remote/Online** sessions. 

Where would you prefer to take your yoga class?`;
      }
    }
    // 6. Specific instructor search by name
    else {
      const foundInstructors = instructors.filter(i => msgLower.includes(i.name.toLowerCase().split(' ')[0]));
      if (foundInstructors.length > 0) {
        responseText = `Here is information on the instructor you mentioned:\n\n`;
        foundInstructors.forEach(i => {
          responseText += `### **[${i.name}](/instructors/${i._id})**\n`;
          responseText += `- **Experience**: ${i.experience} years\n`;
          responseText += `- **Rating**: ${i.rating} ★ (${i.reviewCount} reviews)\n`;
          responseText += `- **Price**: $${i.sessionPrice}/hour\n`;
          responseText += `- **Teaches**: ${i.yogaTypes.join(', ')}\n`;
          responseText += `- **Bio**: *"${i.bio}"*\n\n`;
        });
        responseText += `Would you like to book a session with them? Click on their name to view their schedule!`;
      } else {
        // Default generic reply
        const featured = instructors.filter(i => i.isFeatured).slice(0, 3);
        responseText = `I can help you explore Harmony Bookings! 🧘

Here are a few of our featured instructors:
${featured.map(i => `- **[${i.name}](/instructors/${i._id})** ($${i.sessionPrice}/hr, ${i.rating} ★, teaches ${i.yogaTypes.join(', ')})`).join('\n')}

Feel free to ask me something specific, like:
- *"Who teaches Vinyasa?"*
- *"Show me instructors in Austin"*
- *"Find classes under $80"*
- *"How do I book a class?"*

*(To unlock fully conversational answers powered by AI, add a \`GEMINI_API_KEY\` to the backend \`.env\` file).*`;
      }
    }

    res.json({
      success: true,
      message: responseText,
      mode: 'fallback',
    });
  } catch (error) {
    next(error);
  }
};
