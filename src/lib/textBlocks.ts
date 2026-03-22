export interface TextBlock {
  id: string;
  category: string;
  label: string;
  preview: string;
  html: string;
}

export const DEFAULT_TEXT_BLOCKS: TextBlock[] = [
  // General
  {
    id: "tb-general-1",
    category: "General",
    label: "Welcome message",
    preview: "Dear patient, this plan has been prepared personally for you…",
    html: "<p>Dear patient, this plan has been prepared personally for you by your care team. Please follow the instructions carefully and do not hesitate to reach out if you have any questions.</p>",
  },
  {
    id: "tb-general-2",
    category: "General",
    label: "Compliance reminder",
    preview: "Consistent adherence to this plan is essential for the best outcome…",
    html: "<p>Consistent adherence to this plan is essential for the best possible outcome. If you experience any unexpected side effects or have concerns, please contact us immediately.</p>",
  },
  {
    id: "tb-general-3",
    category: "General",
    label: "Follow-up reminder",
    preview: "A follow-up appointment has been scheduled for you…",
    html: "<p>A follow-up appointment has been scheduled for you. Please ensure you attend so we can monitor your progress and adjust the plan if necessary.</p>",
  },
  // Post-Op
  {
    id: "tb-postop-1",
    category: "Post-Op",
    label: "Wound care instructions",
    preview: "Keep the wound area clean and dry for at least 48 hours…",
    html: "<h2>Wound Care</h2><ul><li>Keep the wound area clean and dry for at least 48 hours after surgery.</li><li>Change dressings as instructed by your nurse.</li><li>Do not submerge the wound in water until fully healed.</li><li>Watch for signs of infection: redness, swelling, discharge, or fever above 38 °C.</li></ul>",
  },
  {
    id: "tb-postop-2",
    category: "Post-Op",
    label: "Activity restrictions",
    preview: "Avoid heavy lifting (over 5 kg) for at least 4 weeks…",
    html: "<h2>Activity Restrictions</h2><ul><li>Avoid heavy lifting (over 5 kg) for at least 4 weeks.</li><li>No driving until cleared by your doctor.</li><li>Short, gentle walks are encouraged from day 2 onwards.</li><li>Return to full activity only after medical clearance.</li></ul>",
  },
  {
    id: "tb-postop-3",
    category: "Post-Op",
    label: "Pain management",
    preview: "Take prescribed pain medication as directed. Do not exceed the stated dose…",
    html: "<h2>Pain Management</h2><p>Take prescribed pain medication as directed. Do not exceed the stated dose. If pain is not controlled or worsens after 48 hours, contact your care team. Ice packs applied for 15–20 minutes every 2 hours can help reduce swelling.</p>",
  },
  // Diet
  {
    id: "tb-diet-1",
    category: "Diet",
    label: "Anti-inflammatory diet",
    preview: "Focus on whole foods rich in omega-3 fatty acids and antioxidants…",
    html: "<h2>Anti-Inflammatory Diet</h2><ul><li>Focus on whole foods: vegetables, fruit, legumes, and whole grains.</li><li>Include omega-3 rich foods: salmon, sardines, walnuts, flaxseed.</li><li>Reduce processed foods, refined sugar, and trans fats.</li><li>Stay well hydrated — aim for 1.5–2 litres of water per day.</li></ul>",
  },
  {
    id: "tb-diet-2",
    category: "Diet",
    label: "Post-surgery soft diet",
    preview: "For the first 3–5 days, stick to soft or liquid foods…",
    html: "<h2>Post-Surgery Diet</h2><p>For the first 3–5 days, stick to soft or liquid foods such as soups, yoghurt, mashed vegetables, and smoothies. Gradually reintroduce solid foods as tolerated. Avoid alcohol and highly spiced foods until fully healed.</p>",
  },
  {
    id: "tb-diet-3",
    category: "Diet",
    label: "Hydration guidance",
    preview: "Adequate hydration supports healing and medication absorption…",
    html: "<h2>Hydration</h2><p>Adequate hydration supports healing and helps medication work effectively. Aim for at least 8 glasses (approx. 2 litres) of water daily. Avoid excessive caffeine and alcohol during recovery.</p>",
  },
  // Exercise
  {
    id: "tb-exercise-1",
    category: "Exercise",
    label: "Gentle mobility routine",
    preview: "Begin with 5–10 minutes of light movement twice a day…",
    html: "<h2>Gentle Mobility Routine</h2><p>Begin with 5–10 minutes of light movement twice a day. Focus on range-of-motion exercises as advised by your physiotherapist. Stop immediately if you experience sharp pain.</p>",
  },
  {
    id: "tb-exercise-2",
    category: "Exercise",
    label: "Breathing exercises",
    preview: "Deep breathing helps prevent post-operative complications…",
    html: "<h2>Breathing Exercises</h2><ul><li>Take 10 slow deep breaths every hour while awake.</li><li>Inhale through the nose for 4 counts, hold for 2, exhale through the mouth for 6.</li><li>This helps prevent post-operative pulmonary complications and reduces stress.</li></ul>",
  },
  {
    id: "tb-exercise-3",
    category: "Exercise",
    label: "Progressive walking plan",
    preview: "Week 1: 5–10 min walks, twice daily. Week 2: increase to 15–20 min…",
    html: "<h2>Progressive Walking Plan</h2><ul><li><strong>Week 1:</strong> 5–10 minute walks, twice daily.</li><li><strong>Week 2:</strong> Increase to 15–20 minutes, once or twice daily.</li><li><strong>Week 3+:</strong> Gradual increase as tolerated, based on your progress.</li></ul><p>Always wear supportive footwear and stop if you feel pain or dizziness.</p>",
  },
  // Medication
  {
    id: "tb-med-1",
    category: "Medication",
    label: "General medication guidance",
    preview: "Take all medications as prescribed. Do not stop without consulting your doctor…",
    html: "<h2>Medication Guidance</h2><ul><li>Take all medications as prescribed — do not skip doses.</li><li>Do not stop taking any medication without consulting your doctor first.</li><li>Store medications in a cool, dry place away from children.</li><li>If you miss a dose, take it as soon as you remember unless it is close to the next scheduled dose.</li></ul>",
  },
  {
    id: "tb-med-2",
    category: "Medication",
    label: "Antibiotic course",
    preview: "Complete the full course of antibiotics even if you feel better…",
    html: "<h2>Antibiotic Course</h2><p>It is important to complete the full prescribed course of antibiotics, even if you start feeling better before it is finished. Stopping early can cause the infection to return and may contribute to antibiotic resistance. Take with food if stomach upset occurs.</p>",
  },
  // Mental Health
  {
    id: "tb-mental-1",
    category: "Mental Health",
    label: "Rest and recovery mindset",
    preview: "Recovery takes time. Be patient with yourself and prioritise rest…",
    html: "<h2>Rest &amp; Recovery</h2><p>Recovery takes time — be patient with yourself. Prioritise sleep (7–9 hours per night), limit screen time before bed, and allow yourself to rest without guilt. A calm environment supports both physical and emotional healing.</p>",
  },
  {
    id: "tb-mental-2",
    category: "Mental Health",
    label: "Stress management tips",
    preview: "Try simple breathing or mindfulness practices to reduce stress…",
    html: "<h2>Stress Management</h2><ul><li>Practice slow, deep breathing for 5 minutes when feeling anxious.</li><li>Consider short guided meditation sessions (apps like Calm or Headspace can help).</li><li>Talk to someone you trust if you feel overwhelmed.</li><li>Contact your care team if stress is significantly affecting your daily life.</li></ul>",
  },
];

export const TEXT_BLOCK_CATEGORIES = [
  "All",
  ...Array.from(new Set(DEFAULT_TEXT_BLOCKS.map((b) => b.category))),
];
