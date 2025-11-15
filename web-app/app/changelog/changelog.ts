export const changelog = [
    {
        date: "2025-11-15",
        title: "UI Layout Polish & Color Consistency",
        items: [
            "Aligned all pages with the updated SpeakPrepAI design system.",
            "Unified font weights, margins, and spacing across components.",
            "Refined orange highlight strokes for better brand consistency.",
            "Improved overall visual balance on both desktop and mobile."
        ],
        tag: "UI",
    },

    {
        date: "2025-11-14",
        title: "Dynamic Question Generation Based on User Answers",
        items: [
            "Replaced static questions with real-time adaptive generation.",
            "Interviewer now responds dynamically to user answers.",
            "Conversations feel significantly more natural and human-like.",
        ],
        tag: "New Feature",
    },

    {
        date: "2025-11-13",
        title: "Interview Flow Logic Refactor",
        items: [
            "Standardized technical and HR interview flows.",
            "Added branching logic for better conversation diversity.",
            "Improved topic rotation for smoother transitions.",
            "Enhanced continuity to maintain a natural interview flow."
        ],
        tag: "Refactor",
    },

    {
        date: "2025-11-12",
        title: "New Interview Conclusion Messages",
        items: [
            "Added warm and natural closing messages for technical interviews.",
            "Added HR-specific conversational wrap-up messages.",
            "Improved transitions into the analysis report section.",
        ],
        tag: "Content",
    },

    {
        date: "2025-11-11",
        title: "Improved First Question Generation Logic",
        items: [
            "Refined prompts to increase contextual relevance.",
            "Made questions more direct and conversational.",
            "Personalized first questions to candidate resume + job description."
        ],
        tag: "Improvement",
    },

    {
        date: "2025-11-10",
        title: "Improved UI Rendering & Frontend Performance",
        items: [
            "Optimized rendering performance across all UI components.",
            "Reduced layout shifts on all pages.",
            "Polished animation flow for smoother interactions.",
            "Overall interface feels faster and more responsive."
        ],
        tag: "Improvement",
    },

    {
        date: "2025-11-08",
        title: "Frontend Mock Interview UI Created",
        items: [
            "Built the main mock interview page (recording, question UI, answer flow).",
            "Implemented session handling and progress tracking.",
            "Added user-friendly loading and feedback states."
        ],
        tag: "UI",
    },

    {
        date: "2025-11-05",
        title: "Redis Context Store Integration",
        items: [
            "Integrated Redis to enable persistent multi-turn interview sessions.",
            "Stored question history, answers, and interview-type context.",
            "Improved flow consistency across long sessions."
        ],
        tag: "Infrastructure",
    },

    {
        date: "2025-11-02",
        title: "Resume & Job Description Parsing (Initial Version)",
        items: [
            "Built AI-based resume parsing for extracting user skills and details.",
            "Implemented job description summarizer.",
            "Enabled personalized interview openings using extracted data."
        ],
        tag: "Feature",
    },

    {
        date: "2025-10-28",
        title: "LLM Pipeline Prototype (Technical + HR)",
        items: [
            "Created early LLM-based question generators.",
            "Implemented basic follow-up models.",
            "Built initial technical + HR interview flows for internal testing."
        ],
        tag: "Prototype",
    },

    {
        date: "2025-10-25",
        title: "Secure AI Authorization Middleware",
        items: [
            "Added token-based authorization for backend AI services.",
            "Secured endpoints against unauthorized external usage.",
            "Introduced header-based validation for clients."
        ],
        tag: "Security",
    },

    {
        date: "2025-10-23",
        title: "Process Handling & Async Threading Improvements",
        items: [
            "Shifted heavy LLM calls into background threads.",
            "Improved concurrency and multi-session reliability.",
            "Reduced API response latency significantly."
        ],
        tag: "Performance",
    },

    {
        date: "2025-10-20",
        title: "Project Initialization & Core Architecture Setup",
        items: [
            "Started the SpeakPrepAI project.",
            "Set up Next.js frontend and FastAPI backend.",
            "Added Redis and initial AI service architecture.",
            "Defined the base structure for interview session flow."
        ],
        tag: "Kickoff",
    },
];
